import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ScoreBar from '../components/ScoreBar'
import ThreatBadge from '../components/ThreatBadge'
import IPCard from '../components/IPcard'
import EngineList from '../components/Enginelist'
import { generateThreatReport } from '../utilities/generatePDF'
import useIsMobile from '../hooks/useIsMobile'
import { api } from '../utilities/api'
const Dashboard = () => {
  const isMobile= useIsMobile()
  const navigate= useNavigate()
  const [target, setTarget] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
  navigator.clipboard.writeText(`${window.location.origin}/report/${report.scanId}`)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}
  //handler functions
  const handleScan= async () => {
    if(!target.trim()) return
    setLoading(true)
    setError(null)
    setReport(null)

    try {
      //calling the api for scan
      const data = await api.get(
  `/scan/analyze?target=${encodeURIComponent(target.trim())}`
);
      
      if (data.error) throw new Error(data.error)
      setReport(data)
    } catch (error) {
      setError(error.message)
    }
    finally
    {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleScan()
  }
  
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid #1a1a1a'
      }}>
        <div
          onClick={() => navigate('/')}
          style={{ fontSize: '16px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Threat<span style={{ color: '#ff3c3c' }}>Radar</span>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['Dashboard', 'History', 'Bulk'].map((item) => (
            <span
              key={item}
              onClick={() => navigate(item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`)}
              style={{
                fontSize: '12px', color: item === 'Dashboard' ? '#fff' : '#444',
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                borderBottom: item === 'Dashboard' ? '1px solid #ff3c3c' : 'none',
                paddingBottom: '2px'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      {/* Search */}
      <div style={{ padding: isMobile ? '16px 16px 48px' : '48px 48px 48px'}}>
        <div style={{ display: 'flex', gap: '0', marginBottom: '48px' }}>
          <input
            value={target}
            onChange={e => setTarget(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter IP, domain, or URL..."
            style={{
              flex: 1, background: '#111', border: '1px solid #333',
              borderRight: 'none', color: '#fff', fontSize: '15px',
              padding: '14px 20px', fontFamily: 'monospace', outline: 'none'
            }}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              background: loading ? '#333' : '#ff3c3c', color: '#fff',
              border: 'none', padding: '14px 32px', fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Scanning...' : 'Analyze →'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            border: '1px solid #ff3c3c33', background: '#ff3c3c11',
            padding: '16px 20px', color: '#ff3c3c', fontSize: '13px', marginBottom: '32px'
          }}>
            ⚠ {error}
          </div>
        )}

        {!report && !loading && !error && (
  <div style={{ textAlign: 'center', padding: '80px 0', color: '#222' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px', fontFamily: 'monospace' }}>[ ]</div>
    <div style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      Enter a target to begin scanning
    </div>
  </div>
)}

        {/* Empty state */}
        {report && (
  <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
    
    {/* Top row */}
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: '16px', marginBottom: '16px' }}>
      
      {/* Main threat card */}
      <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
  <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
    // Threat Report
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <ThreatBadge level={report.threatLevel} />
    <button
      onClick={() => generateThreatReport(report)}
      style={{
        background: 'none', border: '1px solid #333', color: '#555',
        padding: '4px 14px', fontSize: '11px', cursor: 'pointer',
        letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s'
      }}
      onMouseEnter={e => { e.target.style.borderColor = '#ff3c3c'; e.target.style.color = '#fff' }}
      onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#555' }}
    >
      Export PDF →
    </button>
    <button
  onClick={handleCopy}
  style={{
    background: copied ? '#00d08422' : 'none',
    border: `1px solid ${copied ? '#00d084' : '#333'}`,
    color: copied ? '#00d084' : '#555',
    padding: '4px 14px', fontSize: '11px', cursor: 'pointer',
    letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s'
  }}
>
  {copied ? 'Copied! ✓' : 'Share →'}
</button>
  </div>
</div>

        <div style={{ fontSize: '32px', fontWeight: 500, color: '#fff', fontFamily: 'monospace', marginBottom: '4px' }}>
          {report.ip || report.url}
        </div>
        <div style={{ fontSize: '13px', color: '#333', marginBottom: '28px' }}>
          {report.type?.toUpperCase()} · {report.virustotal?.owner || ''} · {report.virustotal?.country || ''}
        </div>

        <ScoreBar label="VirusTotal Score" score={report.virustotal?.threatScore || 0} delay={0} />
        <ScoreBar label="AbuseIPDB Score" score={report.abuseipdb?.abuseScore || 0} delay={200} />
        <ScoreBar label="Final Score" score={report.finalScore || 0} delay={400} />

        <div style={{ marginTop: '8px', fontSize: '12px', color: '#333' }}>
  Scanned {new Date(report.scannedAt).toLocaleString()} · {report.fromCache ? '[CACHED]' : '[LIVE SCAN]'}
</div>
      </div>

      {/* IP Card */}
      <IPCard virustotal={report.virustotal} abuseipdb={report.abuseipdb} />
    </div>

    {/* Engine breakdown */}
    <EngineList engines={report.virustotal?.engines} />

  </div>
)}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#333' }}>
            <div style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Scanning target...
            </div>
          </div>
        )}
      </div>

      <style>{`
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}</style>
    </div>
  )
}


export default Dashboard
