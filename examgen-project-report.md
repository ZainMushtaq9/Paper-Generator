# ExamGen AI — Acquisition Project Report & Prospectus

## 1. Executive Summary
**ExamGen AI** is a fully functional, market-ready EdTech B2B SaaS platform designed to automate the process of creating exam papers. By leveraging state-of-the-art AI (Groq API, Llama 3) and OCR technology, the platform allows teachers and educational institutions to upload PDFs or textbooks and generate accurate, bilingual (English & Urdu) exam papers in seconds. The application guarantees absolute adherence to the uploaded curriculum, eliminating AI hallucination by strictly restricting question generation to the user-provided source material.

## 2. Core Problem Solved
Teachers and school administrators globally spend roughly **3 to 5 hours manual labor per exam paper**—searching for questions, ensuring curriculum alignment, typing them out (especially difficult in complex languages like Urdu), and formatting them. ExamGen AI reduces this process to under **2 minutes**.

## 3. Product Features & Moats
*   **Zero-Hallucination Architecture:** Unlike generic ChatGPT prompts, ExamGen AI forces the LLM to strictly cite and use only the uploaded PDF/textbook context, complete with page number references for every generated question.
*   **Bilingual Generation:** Seamlessly generates papers in English or Urdu, a massive competitive advantage in South Asian and Middle Eastern markets.
*   **Role-Based Access Control (RBAC):** Three distinct tiers: Super Admin (platform owner), Institution Admin (school management), and Teacher (end-user).
*   **Granular Paper Configuration:** Users can define exact parameters (e.g., Chapter 3-5, 12 MCQs, 5 Short Questions, 2 Long Questions, 45 minutes duration) and add custom tuning instructions (e.g., "Focus on application-based concepts").
*   **Centralized Resource Library:** Institution admins can upload approved textbooks ensuring that all teachers under their banner pull questions from the exact same standardized material.
*   **Monetization Ready:** Fully integrated with Google AdSense slots on every page for immediate passive income generation, with a clean architecture ready for Stripe/PayPal subscription integration.

## 4. Technical Stack
The platform is built on a modern, highly scalable, and developer-friendly JavaScript ecosystem:
*   **Frontend & Full-Stack Framework:** Next.js 14 (App Router)
*   **Styling:** Custom Vanilla CSS with robust responsive design, dark/light mode, and modern glassmorphism UI/UX.
*   **Database Engine & ORM:** Prisma ORM with SQLite (easily swappable to PostgreSQL via changing one environment variable).
*   **Authentication:** NextAuth.js (Secure credential-based login with encrypted bcrypt passwords and JWT sessions).
*   **AI & Processing:** Groq API integration for lightning-fast inference (Llama-3-70b-versatile).
*   **File Handling:** Local/Server storage system built for robust PDF/Image ingestion.
*   **Hosting Context:** Deployed and verified functioning flawlessly on Render.com.

## 5. Target Market & Ideal Customer Profile
*   **Primary B2B:** Private k-12 schools, tuition centers, academies, and educational chains looking to standardize testing and save faculty time.
*   **Primary B2C:** Independent tutors and freelance educators who need rapid assessment generation.
*   **Geographic Focus:** While globally applicable, it has immediate product-market fit in Pakistan, India, and the UAE due to the built-in Urdu/English bilingual support.

## 6. Growth Opportunities for the Buyer
The purchaser of ExamGen AI acquires a pristine, unbloated codebase primed for rapid scaling:
1.  **SaaS Subscription Model:** Introduce tiered pricing via Stripe (e.g., Free for 3 papers/mo, $9.99/mo for Pro Teachers, $49.99/mo for Institutions).
2.  **White-Labeling:** Resell customized, branded instances of the software directly to large school districts.
3.  **Expanded Output Formats:** Currently renders digital review; adding simple PDF/Word export functionality will drastically increase user retention.
4.  **Auto-Grading Module:** Expand the MCQs and Short Answers into a digital test-taking portal where students can take the generated exams online for instant grading.

## 7. What is included in the Sale?
*   Complete source code repository (Next.js, Prisma, UI assets).
*   Full transfer of the GitHub repository.
*   The `aiclinix.online` domain name (if applicable/owned) and all branding assets.
*   Production deployment configurations and environment variable guides.

---
*This report is structured to be copy-pasted directly into listing platforms such as Flippa, Acquire.com, or directly emailed to prospective B2B EdTech buyers.*
