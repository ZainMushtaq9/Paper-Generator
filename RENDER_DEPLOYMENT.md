# Deploying ExamGen AI to Render

This guide outlines the steps to deploy the ExamGen AI platform to [Render](https://render.com/) from your GitHub repository.

## Prerequisites

1.  A [GitHub](https://github.com/) account with the repository pushed.
2.  A [Render](https://render.com/) account (free tier is available, but a paid tier is recommended for production databases and background workers).
3.  A PostgreSQL database (Render provides managed PostgreSQL).
4.  A [Groq API Key](https://console.groq.com/keys).

## Step 1: Push Code to GitHub

Ensure all your code is pushed to your GitHub repository (`ZainMushtaq9` or specifically the repo `Paper-Generator`).

If you haven't pushed yet, run these commands in your project directory:

```bash
git add .
git commit -m "Deploy readiness"
git branch -M main
git push -u origin main
```

## Step 2: Create a PostgreSQL Database on Render

Since SQLite (`dev.db`) is not suitable for a serverless or ephemeral file system environment like Render's web services, it is highly recommended to use PostgreSQL for production.

1.  Log in to your Render dashboard.
2.  Click **New** -> **PostgreSQL**.
3.  Fill in the details:
    *   **Name**: `examgen-db` (or your preferred name)
    *   **Region**: Choose the region closest to your users.
    *   **Instance Type**: Free or Starter.
4.  Click **Create Database**.
5.  Once created, copy the **Internal Database URL** (if deploying the web service in the same region) or **External Database URL**.

## Step 3: Update `prisma/schema.prisma` for PostgreSQL

Before deploying, you need to update your Prisma schema to use PostgreSQL instead of SQLite.

1.  Open `prisma/schema.prisma`.
2.  Change the `provider` from `"sqlite"` to `"postgresql"`.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3.  Commit and push this change to GitHub.

## Step 4: Deploy the Next.js Web Service

1.  In the Render dashboard, click **New** -> **Web Service**.
2.  Connect your GitHub account and select the `Paper-Generator` repository.
3.  Fill in the deployment details:
    *   **Name**: `examgen-ai` (or your preferred name)
    *   **Region**: Same as your database.
    *   **Branch**: `main`
    *   **Root Directory**: `.` (leave empty if it's the root)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
        *(Note: `prisma db push` synchronizes the schema. For production, `prisma migrate deploy` is normally preferred, but `db push` is fine for initial setup).*
    *   **Start Command**: `npm start`
4.  **Advanced / Environment Variables**: Add the following variables:
    *   `DATABASE_URL`: Paste the PostgreSQL URL from Step 2.
    *   `NEXTAUTH_SECRET`: Generate a random secure string (e.g., using `openssl rand -base64 32`).
    *   `NEXTAUTH_URL`: The URL of your Render web service (e.g., `https://examgen-ai.onrender.com`). *You can update this after the service is created and you get the exact URL.*
    *   `GROQ_API_KEY`: Your Groq API key (`gsk_...`).
    *   `MAX_PAPERS_PER_DAY`: `5` (or your preferred limit).
    *   `MAX_FILE_SIZE_MB`: `50`
5.  Click **Create Web Service**.

## Step 5: (Optional) Deploy the Python OCR Microservice

If you need the OCR capabilities for scanned PDFs, deploy the Flask microservice.

1.  In the Render dashboard, click **New** -> **Web Service**.
2.  Select the `Paper-Generator` repository again.
3.  Fill in the details:
    *   **Name**: `examgen-ocr`
    *   **Root Directory**: `ocr-service` (Important: Point to the Python folder)
    *   **Runtime**: `Python`
    *   **Build Command**: `pip install -r requirements.txt` (Render may auto-detect this). Note: You may need a custom Dockerfile if Tesseract/OpenCV system dependencies are required, as Render's native Python environment might not have them pre-installed.
    *   **Start Command**: `gunicorn app:app` (You will need to add `gunicorn` to `requirements.txt`).
4.  Click **Create Web Service**.
5.  Once deployed, copy its URL and add it as an environment variable to your Next.js Web Service:
    *   `OCR_SERVICE_URL`: e.g., `https://examgen-ocr.onrender.com`

**A Note on OCR Dependencies on Render:**
To run Tesseract OCR on Render, you typically need to use a **Docker Runtime** instead of the native Python runtime, because Tesseract requires system-level OS packages (`apt-get install tesseract-ocr`). To do this, create a `Dockerfile` inside `ocr-service`, install the dependencies via `RUN apt-get install -y tesseract-ocr tesseract-ocr-urd`, and instruct Render to build via Docker.

## Step 6: Post-Deployment Setup

1.  **Seed the Database**: To create the initial Super Admin account, you need to execute seed data. Since Render runs start commands on every boot, it's best to run the seed script locally against the remote database URI using `DATABASE_URL="<render_db_url>" npx prisma db push` and `DATABASE_URL="<render_db_url>" node prisma/seed.js`, or by executing it via the Render Shell tab.
2.  **Verify Authentication**: Go to `https://examgen-ai.onrender.com/auth/login` and try logging in with `admin@examgen.pk` / `admin123`.
3.  **AdSense**: Once your custom domain is connected to Render (if applicable), submit the site to Google AdSense.

## Step 7: Persistent File Storage (Important)

In Next.js, files uploaded to `public/uploads` are stored on the local disk. Render Web Services use **ephemeral filesystems**, meaning any uploaded books will be deleted upon the next deployment or server restart.

**For a production deployment on Render, you MUST use external cloud storage for books.**

1.  Set up an AWS S3 bucket, Cloudinary, or UploadThing account.
2.  Update the `src/lib/storage.js` and `src/app/api/books/route.js` files to upload files directly to your chosen cloud provider instead of the local filesystem.
3.  Store the remote URL in the database's `storagePath` relative.

*Since you requested to put a copy on GitHub, these instructions will be available in this repository under `RENDER_DEPLOYMENT.md`.*
