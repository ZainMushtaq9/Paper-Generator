# ExamGen AI 📝

### AI-Powered Bilingual Exam Paper Generator for Punjab Board (PCTB)

**Free • Bilingual (Urdu & English) • Anti-Hallucination AI • Page References**

---

## 🌟 Features

- 📚 **Official PCTB Library** — Class 1–12 textbooks pre-loaded
- 🧠 **AI Question Generation** — Powered by Groq LLaMA 3.3
- 🌐 **Bilingual** — Urdu (Nastaliq RTL) & English
- 🔬 **Smart OCR** — Handles scanned PDFs via Tesseract
- ✅ **AI Validation** — Confidence scoring, page references
- 📄 **Professional PDF Export** — Institution branding, QR codes
- 🏫 **Multi-Institution** — Role-based access (Super Admin, Institution Admin, Teacher)
- 💰 **Free** — Monetized via Google AdSense

---
Open [http://localhost:3000](http://localhost:3000)

---
## 🤖 OCR Microservice (Optional)

```bash
cd ocr-service
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5000`

---

## 🌐 Tech Stack

| Layer | Technology |
|-------|----------|
| Frontend | Next.js 14 (App Router) |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Auth | NextAuth.js |
| AI | Groq LLaMA 3.3 70B |
| OCR | Python + Tesseract + OpenCV |
| PDF | Puppeteer |
| Styling | Vanilla CSS (dark/light mode) |

---

## 📖 Book Sources

All official books are sourced from [Punjab Curriculum & Textbook Board (PCTB)](https://ptbb.punjab.gov.pk/E-Books) and provided free for educational use by the Government of Punjab.

---

## 👨‍💻 Developer

**Zain Mushtaq** — [mushtaqzain180@gmail.com](mailto:mushtaqzain180@gmail.com)

---

## 📄 License

Free for educational use. See [Terms of Service](/terms).
