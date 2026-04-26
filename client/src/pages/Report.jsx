import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ThreatBadge from '../components/ThreatBadge'
import ScoreBar from '../components/ScoreBar'
import IPCard from '../components/IPcard'
import EngineList from '../components/Enginelist'
import { generateThreatReport } from '../utilities/generatePDF'
import useIsMobile from '../hooks/useIsMobile'
const Report = () => {
  const isMobile= useIsMobile()
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  
  useEffect(() => {
    fetchReport()
  }, [id])
  
  async function fetchReport()
  {
    try {
        const res=await fetch(`http://localhost:8080/scan/report/${id}`)
        const data= await res.json()
        
        if (data.error) throw new Error(data.error)
        setReport(data)
    } catch (error) {
        setError(error.message) 
    }
    finally{
        setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid #1a1a1a'
      }}>
        <div onClick={() => navigate('/')} style={{ fontSize: '16px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Threat<span style={{ color: '#ff3c3c' }}>Radar</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: '1px solid #333', color: '#888',
            padding: '8px 20px', fontSize: '13px', cursor: 'pointer',
            letterSpacing: '0.05em', textTransform: 'uppercase'
          }}
        >
          New Scan →
        </button>
      </nav>

      <div style={{oadding: isMobile ? '24px 16px' : '48px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#333', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading report...
          </div>
        )}

        {error && (
          <div style={{ border: '1px solid #ff3c3c33', background: '#ff3c3c11', padding: '16px 20px', color: '#ff3c3c', fontSize: '13px' }}>
            ⚠ {error}
          </div>
        )}

        {report && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>

            {/* Report header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  // Shared Report · ID #{report.id}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 500, color: '#fff', fontFamily: 'monospace' }}>
                  {report.target}
                </div>
              </div>
              <div style={{ display: 'flex', gap: isMobile ? '12px' : '12px',flexDirection: isMobile ? 'column' : 'row' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#00d08422' : 'none',
                    border: `1px solid ${copied ? '#00d084' : '#333'}`,
                    color: copied ? '#00d084' : '#555',
                    padding: '8px 16px', fontSize: '12px', cursor: 'pointer',
                    letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s'
                  }}
                >
                  {copied ? 'Copied! ✓' : 'Copy Link'}
                </button>
                {report.fullReport && (
                  <button
                    onClick={() => generateThreatReport(report.fullReport)}
                    style={{
                      background: 'none', border: '1px solid #333', color: '#555',
                      padding: '8px 16px', fontSize: '12px', cursor: 'pointer',
                      letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = '#ff3c3c'; e.target.style.color = '#fff' }}
                    onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#555' }}
                  >
                    Export PDF →
                  </button>
                )}
              </div>
            </div>

            {/* Main grid */}
            {report.fullReport && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        // Threat Report
                      </div>
                      <ThreatBadge level={report.fullReport.threatLevel} />
                    </div>

                    <div style={{ fontSize: '32px', fontWeight: 500, color: '#fff', fontFamily: 'monospace', marginBottom: '4px' }}>
                      {report.fullReport.ip || report.fullReport.url}
                    </div>
                    <div style={{ fontSize: '13px', color: '#333', marginBottom: '28px' }}>
                      {report.fullReport.type?.toUpperCase()} · {report.fullReport.virustotal?.owner || ''} · {report.fullReport.virustotal?.country || ''}
                    </div>

                    <ScoreBar label="VirusTotal Score" score={report.fullReport.virustotal?.threatScore || 0} delay={0} />
                    <ScoreBar label="AbuseIPDB Score" score={report.fullReport.abuseipdb?.abuseScore || 0} delay={200} />
                    <ScoreBar label="Final Score" score={report.fullReport.finalScore || 0} delay={400} />

                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#333' }}>
                      Scanned {new Date(report.scannedAt).toLocaleString()}
                    </div>
                  </div>

                  <IPCard virustotal={report.fullReport.virustotal} abuseipdb={report.fullReport.abuseipdb} />
                </div>

                <EngineList engines={report.fullReport.virustotal?.engines} />
              </>
            )}
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

export default Report
