import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { title: 'Multi-Engine Scanning', desc: 'Cross-reference against 90+ professional security engines simultaneously via VirusTotal.' },
  { title: 'Unified Threat Score', desc: 'Weighted 70/30 scoring model combining VirusTotal and AbuseIPDB into one final risk score.' },
  { title: 'Bulk Scanning', desc: 'Scan up to 10 IPs or domains at once with rate-limited sequential processing.' },
  { title: 'Smart Caching', desc: '1-hour TTL cache delivers 139x faster responses on repeated scans. Zero wasted API calls.' },
  { title: 'Scan History', desc: 'Every scan persisted to SQLite. Track threat patterns over time across all targets.' },
  { title: 'Auto Detection', desc: 'Paste anything — IP, domain, or full URL. ThreatRadar figures out the type automatically.' },
]

const stats = [
  { value: '90+', label: 'Security Engines' },
  { value: '139x', label: 'Cache Speedup' },
  { value: '2', label: 'Live APIs' },
]

function StatBlock({ num, label }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ background: '#0a0a0a', padding: '28px 20px', textAlign: 'center' }}>
      <div style={{
        fontSize: 'clamp(28px, 6vw, 36px)',
        fontWeight: 500,
        color: '#ff3c3c',
        fontFamily: 'monospace',
        transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}>
        {num}
      </div>
      <div style={{
        fontSize: '11px',
        color: '#444',
        marginTop: '6px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        transition: 'opacity 0.8s ease 0.15s',
        opacity: visible ? 1 : 0,
      }}>
        {label}
      </div>
    </div>
  )
}

const Landing = () => {
  const navigate = useNavigate()
  const featuresRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const cards = document.querySelectorAll('.feat-card')
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={styles.shell}>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          Threat<span style={styles.logoRed}>Radar</span>
        </div>
        <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>
          Launch App →
        </button>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroTag}>// Real-Time Threat Intelligence</div>
        <h1 style={styles.heroTitle}>
          Know What's<br />
          <span style={styles.heroRed}>Dangerous.</span>
        </h1>
        <p style={styles.heroSub}>
          Scan any IP, domain, or URL against 90+ security engines.
          Instant threat intelligence powered by VirusTotal and AbuseIPDB.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.btnPrimary} onClick={() => navigate('/dashboard')}>
            Start Scanning →
          </button>
          <button
            style={styles.btnSecondary}
            onClick={() => window.location.href = 'https://github.com/SUVRAAJ/THREAT_RADAR'}
          >
            View on GitHub
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={styles.sectionLabel}>// core features</div>

      <div style={styles.featuresGrid} ref={featuresRef}>
        {features.map((f, i) => (
          <div key={i} className="feat-card" style={styles.featCard}>
            <div style={styles.featIcon}>
              <div style={styles.featIconInner} />
            </div>
            <div style={styles.featTitle}>{f.title}</div>
            <div style={styles.featDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map((s, i) => (
          <StatBlock key={i} num={s.value} label={s.label} />
        ))}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLeft}>
          Built by <span style={{ color: '#666' }}>Suvraaj</span> · ThreatRadar 2026
        </div>
        <div style={styles.footerRight}>
          Node.js · Express · React · SQLite
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .feat-card {
          opacity: 0;
          transform: translateY(16px);
          transition:
            opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.2s ease,
            border-color 0.2s ease !important;
        }
        .feat-card.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .feat-card:hover {
          background: #111 !important;
          border-color: #ff3c3c33 !important;
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .tr-shell {
            padding: 20px 16px !important;
          }
          .tr-nav {
            margin-bottom: 48px !important;
          }
          .tr-hero-title {
            font-size: 40px !important;
          }
          .tr-hero-btns {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .tr-hero-btns button {
            width: 100% !important;
            text-align: center !important;
          }
          .tr-features-grid {
            grid-template-columns: 1fr !important;
            margin: 0 0 1px !important;
          }
          .tr-stats-grid {
            grid-template-columns: 1fr !important;
            margin: 0 0 60px !important;
          }
          .tr-footer {
            flex-direction: column !important;
            gap: 8px !important;
            text-align: center !important;
          }
        }

        /* ── Tablet ── */
        @media (min-width: 601px) and (max-width: 900px) {
          .tr-shell {
            padding: 24px 28px !important;
          }
          .tr-hero-title {
            font-size: 52px !important;
          }
          .tr-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            margin: 0 0 1px !important;
          }
          .tr-stats-grid {
            margin: 0 0 60px !important;
          }
        }
      `}</style>
    </div>
  )
}

const styles = {
  shell: {
    background: '#0a0a0a',
    minHeight: '100vh',
    padding: 'clamp(20px, 4vw, 32px) clamp(16px, 6vw, 60px)',
    fontFamily: 'monospace',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '80px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  logo: {
    fontSize: 'clamp(13px, 3vw, 16px)',
    fontWeight: '500',
    color: '#fff',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  logoRed: { color: '#ff3c3c' },
  navBtn: {
    background: 'none',
    border: '1px solid #333',
    color: '#888',
    padding: '8px 20px',
    fontSize: '13px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },

  hero: {
    textAlign: 'center',
    marginBottom: '80px',
    padding: '0 8px',
  },
  heroTag: {
    fontSize: '11px',
    color: '#ff3c3c',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: '20px',
    border: '1px solid #ff3c3c33',
    display: 'inline-block',
    padding: '4px 14px',
  },
  heroTitle: {
    fontSize: 'clamp(36px, 8vw, 64px)',
    fontWeight: '500',
    color: '#fff',
    lineHeight: '1.1',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  heroRed: { color: '#ff3c3c' },
  heroSub: {
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    color: '#555',
    maxWidth: '480px',
    margin: '0 auto 32px',
    lineHeight: '1.6',
  },
  heroBtns: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: '#ff3c3c',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    fontSize: '14px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    minWidth: '180px',
  },
  btnSecondary: {
    background: 'none',
    border: '1px solid #333',
    color: '#888',
    padding: '14px 32px',
    fontSize: '14px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    minWidth: '180px',
  },

  sectionLabel: {
    fontSize: '11px',
    color: '#444',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '24px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    background: '#1a1a1a',
    marginBottom: '1px',
  },
  featCard: {
    background: '#0a0a0a',
    padding: 'clamp(20px, 3vw, 28px) clamp(16px, 2.5vw, 24px)',
    border: '1px solid #1a1a1a',
  },
  featIcon: {
    width: '32px',
    height: '32px',
    border: '1px solid #ff3c3c33',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    flexShrink: 0,
  },
  featIconInner: { width: '10px', height: '10px', background: '#ff3c3c' },
  featTitle: { fontSize: '14px', fontWeight: '500', color: '#fff', marginBottom: '8px' },
  featDesc: { fontSize: '13px', color: '#444', lineHeight: '1.6' },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    background: '#1a1a1a',
    margin: '0 0 80px',
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '24px',
    borderTop: '1px solid #1a1a1a',
    flexWrap: 'wrap',
    gap: '8px',
  },
  footerLeft: { fontSize: '13px', color: '#333' },
  footerRight: { fontSize: '12px', color: '#333', letterSpacing: '0.05em' },
}

export default Landing