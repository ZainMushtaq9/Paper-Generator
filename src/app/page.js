'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import AdBanner from '@/components/AdBanner';

function AnimatedCounter({ target, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 2000;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="stat-card glass-card">
      <div className="stat-value">{count.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function TypewriterText({ text, speed = 50 }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        // Blink cursor for a bit then stop
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayText}
      {showCursor && <span style={{ borderRight: '2px solid var(--primary-400)', animation: 'blink 1s infinite', paddingRight: '2px' }}>&nbsp;</span>}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />

      {/* ═══ Hero Section ═══ */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              AI-Powered • Free Forever • Any Book or Notes
            </div>

            <h1>
              Generate <span className="gradient-text">Exam Papers</span> in Seconds with AI
            </h1>

            <p>
              <TypewriterText
                text="Create professional bilingual exam papers from any board textbooks, handwritten notes, or uploaded materials. Powered by AI with anti-hallucination protection and page references."
                speed={30}
              />
            </p>

            <div className="hero-actions">
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                🚀 Start Generating Free
              </Link>
              <Link href="/books" className="btn btn-secondary btn-lg">
                📚 Browse Book Library
              </Link>
            </div>

            {/* Trust indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-8)',
              marginTop: 'var(--space-10)',
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.8s ease 0.6s both'
            }}>
              {['✅ Official PCTB Books', '🌐 Urdu & English', '🔒 Page References', '⚡ Free Forever'].map((text, i) => (
                <span key={i} style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Features Section ═══ */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="gradient-text">ExamGen AI</span>?</h2>
            <p>Everything you need to create perfect exam papers, powered by cutting-edge AI technology.</p>
          </div>

          <div className="feature-grid">
            {[
              {
                icon: '📚',
                title: 'Official PCTB Library',
                desc: 'All Punjab Board textbooks from Class 1-12 pre-loaded. Official curriculum, always up-to-date.'
              },
              {
                icon: '🧠',
                title: 'AI Question Generation',
                desc: 'Advanced AI generates questions directly from book content with page references. Zero hallucination.'
              },
              {
                icon: '🌐',
                title: 'Bilingual Support',
                desc: 'Generate papers in Urdu or English. Full RTL support with Nastaliq font for Urdu papers.'
              },
              {
                icon: '🔬',
                title: 'Smart OCR Engine',
                desc: 'Handles scanned PDFs with powerful OCR. Supports both Urdu and English text extraction.'
              },
              {
                icon: '✅',
                title: 'AI Validation Engine',
                desc: 'Every question is validated for accuracy — formula checks, math verification, and consistency.'
              },
              {
                icon: '📄',
                title: 'Professional Export',
                desc: 'Export as PDF with institution branding, QR codes, watermarks, and proper formatting.'
              },
              {
                icon: '🎯',
                title: 'Page-Level Filtering',
                desc: 'Select specific pages, chapters, or topics. Questions generated only from your selected content.'
              },
              {
                icon: '🏫',
                title: 'Multi-Institution',
                desc: 'Manage teachers, share books, and track analytics across your entire institution.'
              },
              {
                icon: '✍️',
                title: 'Handwritten Practice',
                desc: 'Generate lined answer sheets and handwritten-style practice papers for exam preparation.'
              }
            ].map((feature, i) => (
              <div key={i} className="feature-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Ad Banners ═══ */}
      <div className="container" style={{ paddingBottom: 'var(--space-4)' }}>
        <AdBanner dataAdSlot="home_top" />
      </div>

      {/* ═══ How It Works Section ═══ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>How It <span className="gradient-text">Works</span></h2>
            <p>Generate exam papers in 4 simple steps</p>
          </div>

          <div className="steps-grid">
            {[
              { num: 1, title: 'Upload Any Book', desc: 'Upload textbooks, notes, handwritten material, or any educational PDF you want to generate questions from.' },
              { num: 2, title: 'Choose Content', desc: 'Filter by pages, chapters, or topics. AI only uses your selected content.' },
              { num: 3, title: 'Design Paper', desc: 'Set sections, marks, MCQs, short & long questions with flexible choice options.' },
              { num: 4, title: 'Generate & Export', desc: 'AI generates, validates, and exports professional PDF with page references.' },
            ].map((step, i) => (
              <div key={i} className="step-card animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
                <div className="step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Stats Section ═══ */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Trusted by <span className="gradient-text">Educators</span></h2>
          </div>
          <div className="stats-grid">
            <AnimatedCounter target={500} label="Schools & Institutions" suffix="+" />
            <AnimatedCounter target={2500} label="Active Teachers" suffix="+" />
            <AnimatedCounter target={15000} label="Papers Generated" suffix="+" />
            <AnimatedCounter target={12} label="Class Levels Supported" />
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-4) var(--space-6)' }}>
        <AdBanner dataAdSlot="home_middle" />
      </div>

      {/* ═══ CTA Section ═══ */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card" style={{ padding: 'var(--space-16)', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Ready to <span className="gradient-text">Transform</span> Your Exam Process?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
              Join thousands of teachers creating professional exam papers in minutes, not hours.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                🚀 Create Free Account
              </Link>
              <Link href="/about" className="btn btn-secondary btn-lg">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Ad Banner ═══ */}
      <div className="container" style={{ paddingBottom: 'var(--space-6)' }}>
        <AdBanner dataAdSlot="home_bottom" />
      </div>

      <Footer />
    </>
  );
}
