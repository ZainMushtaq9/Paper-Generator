import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limit check
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const dailyCount = await prisma.paper.count({
            where: {
                createdById: session.user.id,
                createdAt: { gte: todayStart },
            },
        });

        const maxPapers = parseInt(process.env.MAX_PAPERS_PER_DAY || '5');
        if (dailyCount >= maxPapers) {
            return NextResponse.json({
                error: `Daily limit reached (${maxPapers} papers/day). Try again tomorrow.`,
            }, { status: 429 });
        }

        const body = await request.json();
        const {
            bookId,
            title,
            language = 'english',
            classLevel,
            subject,
            timeDuration,
            schoolName,
            bookName,
            paperPurpose,
            instructions,
            sections, // [{ type: 'mcq', count: 10, marks: 1, attemptAll: true }, ...]
            pageRange, // { from: 1, to: 50 }
            chapterFilter,
            topicFilter,
        } = body;

        if (!title || !sections || sections.length === 0) {
            return NextResponse.json({ error: 'Title and sections are required' }, { status: 400 });
        }

        // Fetch book content if bookId provided
        let bookContent = [];
        let bookTitle = bookName || ''; // Use custom bookName if provided
        if (bookId) {
            const book = await prisma.book.findUnique({ where: { id: bookId } });
            if (book && !bookTitle) bookTitle = book.title;

            const contentWhere = { bookId };
            if (pageRange) {
                contentWhere.pageNumber = {
                    gte: pageRange.from || 1,
                    lte: pageRange.to || 9999,
                };
            }
            if (chapterFilter) {
                contentWhere.chapterName = { contains: chapterFilter };
            }
            if (topicFilter) {
                contentWhere.topicName = { contains: topicFilter };
            }

            bookContent = await prisma.bookContent.findMany({
                where: contentWhere,
                orderBy: { pageNumber: 'asc' },
                take: 100,
            });
        }

        // Build AI prompt
        const contentText = bookContent.length > 0
            ? bookContent.map(c => `[Page ${c.pageNumber}] ${c.textContent}`).join('\n\n')
            : `Generate questions for ${subject || 'General'} class ${classLevel || '9'} level exam.`;

        const sectionPrompts = sections.map((s, i) => {
            const sectionLabel = String.fromCharCode(65 + i); // A, B, C
            const qType = s.type === 'mcq' ? 'Multiple Choice Questions (MCQs) with 4 options each' :
                s.type === 'short' ? 'Short Answer Questions' : 'Long/Essay Questions';
            return `Section ${sectionLabel}: ${s.count} ${qType}, ${s.marks} marks each.${s.attemptCount ? ` Student must attempt ${s.attemptCount} out of ${s.count}.` : ''
                }`;
        }).join('\n');

        const totalMarks = sections.reduce((sum, s) => {
            const attemptCount = s.attemptCount || s.count;
            return sum + (attemptCount * s.marks);
        }, 0);

        const prompt = `You are an expert exam paper generator for Pakistani education system (Punjab Board).
Generate a ${language === 'urdu' ? 'Urdu' : 'English'} language exam paper based on the following content and structure.

${bookTitle ? `Book: ${bookTitle}` : ''}
Subject: ${subject || 'General'}
Class: ${classLevel || '9'}
Total Marks: ${totalMarks}
${timeDuration ? `Duration: ${timeDuration}` : ''}

Paper Structure:
${sectionPrompts}

Source Content:
${contentText}

IMPORTANT RULES:
1. Generate questions ONLY from the provided content if available.
2. For each question, include the page reference if content has page numbers.
3. For MCQs, provide exactly 4 options and mark the correct answer.
4. Ensure no duplicate questions.
5. Maintain appropriate difficulty levels.
6. If Urdu is requested, write questions in Urdu but keep scientific/mathematical terms in English.

Respond in this exact JSON format:
{
  "sections": [
    {
      "label": "A",
      "type": "mcq",
      "instructions": "Choose the correct answer.",
      "questions": [
        {
          "number": 1,
          "text": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": "Option A",
          "pageRef": 15,
          "marks": 1
        }
      ]
    }
  ]
}

Generate the complete exam paper now.`;

        // Call Groq AI
        let aiResponse;
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 4000,
                response_format: { type: 'json_object' },
            });

            aiResponse = JSON.parse(completion.choices[0]?.message?.content || '{}');
        } catch (aiError) {
            console.error('Groq API error:', aiError);
            // Fallback: generate a basic paper structure
            aiResponse = {
                sections: sections.map((s, i) => ({
                    label: String.fromCharCode(65 + i),
                    type: s.type,
                    instructions: s.type === 'mcq' ? 'Choose the correct answer.' :
                        s.type === 'short' ? 'Answer the following questions briefly.' :
                            'Answer the following questions in detail.',
                    questions: Array.from({ length: s.count }, (_, j) => ({
                        number: j + 1,
                        text: `[AI Generation Pending] Sample ${s.type} question #${j + 1} for ${subject || 'the subject'}`,
                        ...(s.type === 'mcq' ? {
                            options: ['Option A', 'Option B', 'Option C', 'Option D'],
                            correct: 'Option A',
                        } : {}),
                        marks: s.marks,
                        pageRef: null,
                    })),
                })),
            };
        }

        // Create paper in database
        const paper = await prisma.paper.create({
            data: {
                title,
                bookId: bookId || null,
                createdById: session.user.id,
                language,
                classLevel,
                subject,
                sections: JSON.stringify(sections),
                totalMarks,
                timeDuration,
                schoolName,
                bookName,
                paperPurpose,
                instructions,
                status: 'generated',
            },
        });

        // Save questions
        const questionData = [];
        if (aiResponse.sections) {
            for (const section of aiResponse.sections) {
                for (const q of section.questions || []) {
                    questionData.push({
                        paperId: paper.id,
                        section: section.label,
                        questionNumber: q.number,
                        questionText: q.text,
                        questionType: section.type,
                        options: q.options ? JSON.stringify(q.options) : null,
                        correctAnswer: q.correct || null,
                        marks: q.marks || 1,
                        pageReference: q.pageRef || null,
                        confidence: 0.85,
                    });
                }
            }
        }

        if (questionData.length > 0) {
            await prisma.paperQuestion.createMany({ data: questionData });
        }

        // Log analytics
        await prisma.analytics.create({
            data: {
                eventType: 'paper_generated',
                userId: session.user.id,
                metadata: JSON.stringify({ paperId: paper.id, subject, classLevel, totalMarks }),
            },
        });

        // Fetch complete paper with questions
        const completePaper = await prisma.paper.findUnique({
            where: { id: paper.id },
            include: {
                questions: { orderBy: [{ section: 'asc' }, { questionNumber: 'asc' }] },
                book: { select: { title: true } },
            },
        });

        return NextResponse.json({ paper: completePaper, aiResponse });
    } catch (error) {
        console.error('Paper generation error:', error);
        return NextResponse.json({ error: 'Paper generation failed' }, { status: 500 });
    }
}
