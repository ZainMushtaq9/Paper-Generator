# ExamGen AI — Acquisition Project Report & Prospectus

**Live Demo:** [https://aiclinix.online](https://aiclinix.online)
**Repository:** [github.com/ZainMushtaq9/Paper-Generator](https://github.com/ZainMushtaq9/Paper-Generator)

---

## 1. Executive Summary
**ExamGen AI** is a fully functional, market-ready EdTech B2B SaaS platform designed to automate exam paper creation. By leveraging state-of-the-art AI (Groq API, Llama 3.3-70B) and OCR technology, it allows teachers and educational institutions to upload PDFs or textbooks and generate accurate, bilingual (English & Urdu) exam papers in seconds. The application guarantees **zero AI hallucination** by strictly restricting question generation to the user-provided source material, with page references on every question.

## 2. Core Problem Solved
Teachers and school administrators globally spend **3–5 hours per exam paper** — searching questions, ensuring curriculum alignment, typing (especially in Urdu), and formatting. ExamGen AI reduces this to **under 2 minutes**.

## 3. Product Features & Moats
*   **Zero-Hallucination Architecture:** Forces the LLM to cite only the uploaded PDF/textbook content, with page number references for every generated question.
*   **Pre-Loaded Official PCTB Library:** Ships with 100+ official Punjab Textbook Board books (Pre-I through Class XII) — ready to use out of the box. No uploads needed.
*   **AI Difficulty Modes:** Teachers can select Easy (direct recall), Standard, Tough (analytical), or Conceptual modes to control question complexity.
*   **Bilingual Generation:** Seamlessly generates papers in English or Urdu — a massive competitive advantage in South Asian and Middle Eastern markets.
*   **Role-Based Access Control (RBAC):** Three distinct tiers — Super Admin (platform owner), Institution Admin (school), and Teacher (end-user).
*   **Granular Paper Configuration:** Users define exact parameters (chapters, MCQ counts, short/long question counts, marks, duration) plus custom AI instructions.
*   **Centralized Resource Library:** Institution admins upload approved textbooks ensuring all teachers use the same standardized material.
*   **Print-Ready Export:** Papers export to PDF and Word (DOCX) format with professional formatting.
*   **Google AdSense Integration:** Ad placements on every page for immediate passive income.

## 4. Technical Stack
*   **Frontend & Full-Stack Framework:** Next.js 14 (App Router)
*   **Styling:** Custom Vanilla CSS — responsive design, dark/light mode, glassmorphism UI.
*   **Database & ORM:** Prisma ORM with SQLite (one-line swap to PostgreSQL).
*   **Authentication:** NextAuth.js (bcrypt passwords + JWT sessions).
*   **AI Engine:** Groq API (Llama-3.3-70b-versatile) — sub-second inference.
*   **File Handling:** PDF ingestion with local/server storage.
*   **Hosting:** Deployed and verified on Render.com. Custom domain: aiclinix.online.

## 5. Target Market
*   **Primary B2B:** Private K-12 schools, tuition centers, academies, and educational chains.
*   **Primary B2C:** Independent tutors and freelance educators.
*   **Geographic Focus:** Immediate product-market fit in Pakistan, India, and the UAE (built-in Urdu/English bilingual support + PCTB curriculum).

## 6. Growth Opportunities
1.  **SaaS Subscriptions:** Stripe integration — Free (3 papers/mo), Teacher Pro ($9/mo), Institution ($49/mo).
2.  **White-Labeling:** Sell branded instances to school districts.
3.  **Auto-Grading Module:** Expand MCQs into a digital test-taking portal with instant grading.
4.  **Answer Key Generation:** AI-generated model answers alongside the question paper.

## 7. What is Included
*   Complete source code repository (Next.js, Prisma, UI assets, 100+ pre-loaded official textbooks).
*   Full transfer of the GitHub repository.
*   The `aiclinix.online` domain name and all branding assets.
*   Production deployment configurations and environment variable guides.

---
*This report is structured to be copy-pasted directly into Flippa, Acquire.com, or emailed to prospective B2B EdTech buyers.*
