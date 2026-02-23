'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import AdBanner from '@/components/AdBanner';

function GenerateContent() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [books, setBooks] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMsg, setProgressMsg] = useState('');
    const [result, setResult] = useState(null);

    const [config, setConfig] = useState({
        bookId: '',
        title: '',
        schoolName: '',
        bookName: '',
        paperPurpose: '',
        language: 'english',
        classLevel: '9',
        subject: '',
        timeDuration: '3 Hours',
        difficulty: 'Standard',
        instructions: 'Attempt all questions. Marks are indicated against each question.',
        customInstructions: '',
        pageRange: { from: 1, to: 999 },
        chapterFilter: '',
        topicFilter: '',
        sections: [
            { type: 'mcq', count: 12, marks: 1, attemptCount: 12 },
            { type: 'short', count: 8, marks: 5, attemptCount: 5 },
            { type: 'long', count: 5, marks: 10, attemptCount: 3 },
        ],
    });

    // Auto-fill school name from session
    useEffect(() => {
        if (session?.user?.institutionName && !config.schoolName) {
            setConfig(prev => ({ ...prev, schoolName: session.user.institutionName }));
        }
    }, [session]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch('/api/books?limit=100');
            if (res.ok) {
                const data = await res.json();
                setBooks(data.books || []);
            }
        } catch (e) { console.error(e); }
    };

    const totalMarks = config.sections.reduce((sum, s) => sum + (s.attemptCount * s.marks), 0);

    const updateSection = (index, field, value) => {
        const updated = [...config.sections];
        updated[index][field] = parseInt(value) || value;
        setConfig({ ...config, sections: updated });
    };

    const addSection = () => {
        setConfig({
            ...config,
            sections: [...config.sections, { type: 'short', count: 5, marks: 5, attemptCount: 5 }],
        });
    };

    const removeSection = (index) => {
        const updated = config.sections.filter((_, i) => i !== index);
        setConfig({ ...config, sections: updated });
    };

    const handleGenerate = async () => {
        if (!config.title) {
            alert('Please enter a paper title');
            return;
        }
        if (!config.bookId) {
            alert('Please select a book first. Papers can only be generated from uploaded books/notes.');
            return;
        }

        setGenerating(true);
        setProgress(0);
        setProgressMsg('Initializing AI Engine...');

        const messages = [
            'Analyzing book content...',
            'Filtering by selected pages...',
            'Generating MCQ questions...',
            'Generating short questions...',
            'Generating long questions...',
            'Validating with AI...',
            'Checking formula accuracy...',
            'Finalizing paper...',
        ];

        let msgIndex = 0;
        const progressInterval = setInterval(() => {
            setProgress(p => {
                if (p >= 85) {
                    clearInterval(progressInterval);
                    return 85;
                }
                return p + Math.random() * 12;
            });
            if (msgIndex < messages.length) {
                setProgressMsg(messages[msgIndex]);
                msgIndex++;
            }
        }, 1200);

        try {
            const res = await fetch('/api/papers/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            clearInterval(progressInterval);

            if (res.ok) {
                const data = await res.json();
                setProgress(100);
                setProgressMsg('✅ Paper generated successfully!');
                setResult(data);
                setStep(4);
            } else {
                const err = await res.json();
                alert(err.error || 'Generation failed');
                setProgress(0);
            }
        } catch (err) {
            clearInterval(progressInterval);
            alert('Generation failed');
            setProgress(0);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: 'var(--space-12)' }}>
                <div className="container container-lg">
                    {/* Header */}
                    <div className="section-header">
                        <h1>📝 AI Paper <span className="gradient-text">Generator</span></h1>
                        <p>Generate exam papers with AI in {4 - (step >= 4 ? 0 : step - 1)} simple steps</p>
                    </div>

                    <AdBanner dataAdSlot="generate_top" style={{ marginBottom: 'var(--space-6)' }} />

                    {/* Step Indicators */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--space-8)',
                        marginBottom: 'var(--space-8)',
                    }}>
                        {['Select Book', 'Choose Content', 'Design Paper', 'Generate'].map((label, i) => (
                            <div key={i} style={{ textAlign: 'center', opacity: step > i ? 1 : 0.4 }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: step > i ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-2)',
                                    fontWeight: 700,
                                    fontSize: 'var(--text-sm)',
                                    color: step > i ? '#fff' : 'var(--text-muted)',
                                }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Select Book */}
                    {step === 1 && (
                        <div className="glass-card animate-fade-in-up" style={{ padding: 'var(--space-8)' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>📚 Step 1: Select Book *</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                                Select an uploaded book, notes, or PDF to generate questions from. All questions will come strictly from the selected content.
                            </p>

                            <div style={{ display: 'grid', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div className="form-group">
                                    <label className="form-label">Paper Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., Annual Exam 2024 - Physics Class 9"
                                        value={config.title}
                                        onChange={(e) => setConfig({ ...config, title: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Class</label>
                                        <select className="form-select" value={config.classLevel}
                                            onChange={(e) => setConfig({ ...config, classLevel: e.target.value })}>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Subject</label>
                                        <input type="text" className="form-input" placeholder="e.g., Physics"
                                            value={config.subject}
                                            onChange={(e) => setConfig({ ...config, subject: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Language</label>
                                        <select className="form-select" value={config.language}
                                            onChange={(e) => setConfig({ ...config, language: e.target.value })}>
                                            <option value="english">English</option>
                                            <option value="urdu">Urdu</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">School/Institution Name</label>
                                        <input type="text" className="form-input" placeholder="e.g., The Smart School"
                                            value={config.schoolName}
                                            onChange={(e) => setConfig({ ...config, schoolName: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Custom Book/Test Name</label>
                                        <input type="text" className="form-input" placeholder="e.g., First Term Exam"
                                            value={config.bookName}
                                            onChange={(e) => setConfig({ ...config, bookName: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Purpose</label>
                                        <select className="form-select" value={config.paperPurpose}
                                            onChange={(e) => setConfig({ ...config, paperPurpose: e.target.value })}>
                                            <option value="">Select Purpose</option>
                                            <option value="Exam">Exam</option>
                                            <option value="Test">Test</option>
                                            <option value="Assessment Test">Assessment Test</option>
                                            <option value="Quiz">Quiz</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Difficulty / Mode (Optional)</label>
                                        <select className="form-select" value={config.difficulty}
                                            onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}>
                                            <option value="Standard">Standard / Normal</option>
                                            <option value="Easy">Easy Mode (Direct questions)</option>
                                            <option value="Tough">Tough (Advanced analytical)</option>
                                            <option value="Conceptual">Conceptual Based</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">📚 Select Book / Notes / PDF *</label>
                                    <select className="form-select" value={config.bookId}
                                        onChange={(e) => setConfig({ ...config, bookId: e.target.value })}
                                        style={{ borderColor: !config.bookId ? 'var(--warning-400)' : undefined }}>
                                        <option value="">-- Select a book (Required) --</option>
                                        {books.map(b => (
                                            <option key={b.id} value={b.id}>
                                                {b.title} (Class {b.classLevel}, {b.medium})
                                            </option>
                                        ))}
                                    </select>
                                    {!config.bookId && (
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--warning-400)', marginTop: 'var(--space-1)' }}>
                                            ⚠️ A book must be selected. Questions are generated ONLY from uploaded content.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button className="btn btn-primary btn-lg" onClick={() => setStep(2)} style={{ width: '100%' }}>
                                Next: Choose Content →
                            </button>
                        </div>
                    )}

                    {/* Step 2: Content Filters */}
                    {step === 2 && (
                        <div className="glass-card animate-fade-in-up" style={{ padding: 'var(--space-8)' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>🎯 Step 2: Choose Content Scope</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                                Filter which pages, chapters, or topics to generate questions from.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div className="form-group">
                                    <label className="form-label">📄 Page Range (From)</label>
                                    <input type="number" className="form-input" min="1"
                                        value={config.pageRange.from}
                                        onChange={(e) => setConfig({ ...config, pageRange: { ...config.pageRange, from: parseInt(e.target.value) || 1 } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📄 Page Range (To)</label>
                                    <input type="number" className="form-input"
                                        value={config.pageRange.to}
                                        onChange={(e) => setConfig({ ...config, pageRange: { ...config.pageRange, to: parseInt(e.target.value) || 999 } })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">📖 Chapter Filter</label>
                                    <input type="text" className="form-input" placeholder="e.g., Motion, Forces"
                                        value={config.chapterFilter}
                                        onChange={(e) => setConfig({ ...config, chapterFilter: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">🔬 Topic Filter</label>
                                    <input type="text" className="form-input" placeholder="e.g., Newton's Laws"
                                        value={config.topicFilter}
                                        onChange={(e) => setConfig({ ...config, topicFilter: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">⏱️ Time Duration</label>
                                    <input type="text" className="form-input" placeholder="e.g., 3 Hours"
                                        value={config.timeDuration}
                                        onChange={(e) => setConfig({ ...config, timeDuration: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div className="form-group">
                                    <label className="form-label">📝 Custom Instructions for Paper (Optional)</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={3}
                                        placeholder="e.g., Focus on chapter 3-5, include more conceptual MCQs, make long questions application-based, include diagrams-related questions..."
                                        value={config.customInstructions}
                                        onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                                    />
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                                        Tell the AI how you want the paper structured. This will guide the question generation.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>
                                    ← Back
                                </button>
                                <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} style={{ flex: 1 }}>
                                    Next: Design Paper →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Paper Design */}
                    {step === 3 && (
                        <div className="glass-card animate-fade-in-up" style={{ padding: 'var(--space-8)' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>📐 Step 3: Design Paper Structure</h3>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 'var(--space-4)',
                                background: 'rgba(99, 102, 241, 0.1)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--space-6)',
                            }}>
                                <span style={{ fontWeight: 600 }}>Total Marks:</span>
                                <span className="gradient-text" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>
                                    {totalMarks}
                                </span>
                            </div>

                            {config.sections.map((section, i) => (
                                <div key={i} style={{
                                    padding: 'var(--space-6)',
                                    background: 'var(--bg-glass)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    marginBottom: 'var(--space-4)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                        <h4>Section {String.fromCharCode(65 + i)}</h4>
                                        {config.sections.length > 1 && (
                                            <button className="btn btn-ghost btn-sm" onClick={() => removeSection(i)} style={{ color: 'var(--error-400)' }}>
                                                ✕ Remove
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-select" value={section.type} onChange={(e) => updateSection(i, 'type', e.target.value)}>
                                                <option value="mcq">MCQ</option>
                                                <option value="short">Short Answer</option>
                                                <option value="long">Long Answer</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Total Qs</label>
                                            <input type="number" className="form-input" min="1" max="50" value={section.count} onChange={(e) => updateSection(i, 'count', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Attempt</label>
                                            <input type="number" className="form-input" min="1" max={section.count} value={section.attemptCount} onChange={(e) => updateSection(i, 'attemptCount', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Marks Each</label>
                                            <input type="number" className="form-input" min="1" max="30" value={section.marks} onChange={(e) => updateSection(i, 'marks', e.target.value)} />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                                        Subtotal: {section.attemptCount * section.marks} marks ({section.attemptCount} × {section.marks})
                                    </p>
                                </div>
                            ))}

                            <button className="btn btn-secondary" onClick={addSection} style={{ marginBottom: 'var(--space-6)', width: '100%' }}>
                                + Add Section
                            </button>

                            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                                <label className="form-label">📝 Instructions</label>
                                <textarea className="form-textarea" placeholder="Paper instructions..."
                                    value={config.instructions}
                                    onChange={(e) => setConfig({ ...config, instructions: e.target.value })} />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                <button className="btn btn-secondary btn-lg" onClick={() => setStep(2)}>← Back</button>
                                <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={generating} style={{ flex: 1 }}>
                                    {generating ? '🧠 Generating...' : '🚀 Generate with AI'}
                                </button>
                            </div>

                            {/* Progress */}
                            {generating && (
                                <div style={{ marginTop: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                            🧠 {progressMsg}
                                        </span>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-400)' }}>
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                    <div className="ai-progress">
                                        <div className="ai-progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && result && (
                        <div className="animate-fade-in-up">
                            <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                                <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }}>✅</div>
                                    <h2>Paper Generated Successfully!</h2>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        {result.paper?.questions?.length || 0} questions generated • Total: {totalMarks} marks
                                    </p>
                                </div>

                                {/* Paper Preview */}
                                <div style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-8)',
                                }}>
                                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', borderBottom: '2px solid var(--border-color)', paddingBottom: 'var(--space-4)' }}>
                                        <h3>{config.title}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                            {config.schoolName && <span>School: <strong>{config.schoolName}</strong> | </span>}
                                            {config.paperPurpose && <span>Purpose: <strong>{config.paperPurpose}</strong> | </span>}
                                            Class: {config.classLevel} | Subject: {config.subject}
                                        </p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                                            Time: {config.timeDuration} | Marks: {totalMarks}
                                            {config.bookName && <span> | Book/Test: {config.bookName}</span>}
                                        </p>
                                        {config.instructions && (
                                            <p style={{ fontSize: 'var(--text-sm)', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                                                {config.instructions}
                                            </p>
                                        )}
                                    </div>

                                    {result.paper?.questions && (() => {
                                        const grouped = {};
                                        result.paper.questions.forEach(q => {
                                            if (!grouped[q.section]) grouped[q.section] = [];
                                            grouped[q.section].push(q);
                                        });

                                        return Object.entries(grouped).map(([section, questions]) => (
                                            <div key={section} style={{ marginBottom: 'var(--space-6)' }}>
                                                <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--primary-400)' }}>
                                                    Section {section}
                                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 'var(--space-2)' }}>
                                                        ({questions[0]?.questionType})
                                                    </span>
                                                </h4>
                                                {questions.map((q, j) => (
                                                    <div key={j} style={{
                                                        padding: 'var(--space-4)',
                                                        borderBottom: '1px solid var(--border-color)',
                                                        marginBottom: 'var(--space-2)',
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <p><strong>Q{q.questionNumber}.</strong> {q.questionText}</p>
                                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 'var(--space-4)' }}>
                                                                [{q.marks} marks]
                                                            </span>
                                                        </div>
                                                        {q.options && (
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-2)', paddingLeft: 'var(--space-6)' }}>
                                                                {JSON.parse(q.options).map((opt, k) => (
                                                                    <span key={k} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                                                        {String.fromCharCode(97 + k)}) {opt}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {q.pageReference && (
                                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-400)', marginTop: 'var(--space-1)' }}>
                                                                📄 Generated from Page {q.pageReference}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                                <Link href={`/papers/${result.paper?.id}`} className="btn btn-primary btn-lg">
                                    📄 View Full Paper
                                </Link>
                                <button className="btn btn-secondary btn-lg" onClick={() => { setStep(1); setResult(null); }}>
                                    📝 Generate Another
                                </button>
                            </div>
                        </div>
                    )}

                    <AdBanner dataAdSlot="generate_middle" style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)' }} />
                    <AdBanner dataAdSlot="generate_bottom" style={{ marginTop: 'var(--space-4)' }} />
                </div>
            </div>
        </>
    );
}

export default function PaperGeneratePage() {
    return (
        <AuthProvider>
            <GenerateContent />
        </AuthProvider>
    );
}
