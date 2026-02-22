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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+ (for OCR microservice, optional)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# .env.local is already created with defaults
# Update GROQ_API_KEY if needed
```

### 3. Initialize Database
```powershell
$env:DATABASE_URL="file:./dev.db"; npx prisma db push
$env:DATABASE_URL="file:./dev.db"; node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@examgen.pk | admin123 |
| Institution Admin | admin@school.pk | admin123 |
| Teacher | teacher@school.pk | admin123 |

---

## 🏗️ Project Structure

```
exam-generator/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth + register
│   │   │   ├── books/        # Book CRUD + upload
│   │   │   ├── papers/       # Paper generation + export
│   │   │   ├── institutions/ # Institution management
│   │   │   └── analytics/    # Stats
│   │   ├── auth/             # Login / Register pages
│   │   ├── books/            # Book library + detail + upload
│   │   ├── dashboard/        # Role dashboards
│   │   ├── papers/           # Generate + view papers
│   │   ├── about/            # About (AdSense)
│   │   ├── contact/          # Contact (AdSense)
│   │   ├── privacy/          # Privacy Policy
│   │   └── terms/            # Terms of Service
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ParticleBackground.js
│   │   └── AuthProvider.js
│   └── lib/
│       ├── auth.js           # NextAuth config
│       ├── prisma.js         # DB client
│       └── storage.js        # File storage
├── prisma/
│   ├── schema.prisma         # 7-model DB schema
│   └── seed.js               # Default users
├── ocr-service/
│   ├── app.py                # Flask OCR microservice
│   └── requirements.txt
└── public/
    ├── robots.txt
    └── uploads/              # Book PDF storage
```

---

## 🤖 OCR Microservice (Optional)

```bash
cd ocr-service
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5000`

---

## 📡 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/books` | List books with filters |
| POST | `/api/books` | Upload book (Admin) |
| GET | `/api/books/:id` | Book detail + content |
| POST | `/api/papers/generate` | AI generate paper |
| GET | `/api/papers/:id` | Paper detail |
| POST | `/api/papers/:id/export` | Export PDF |
| GET | `/api/institutions` | List institutions |
| POST | `/api/institutions/:id/approve` | Approve institution |
| GET | `/api/analytics/stats` | System stats |
| GET | `/sitemap.xml` | XML sitemap |

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

**Zain Mushtaq** — [zainmushtaq5439@gmail.com](mailto:zainmushtaq5439@gmail.com)

---

## 📄 License

Free for educational use. See [Terms of Service](/terms).
