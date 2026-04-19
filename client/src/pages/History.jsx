import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
const History = () => {
  const navigate= useNavigate()
  //setting the necessary states
  const [error, setError] = useState(null)
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)

  //fetching history on mount
  useEffect(() => {
    fetchHistory()
  },[]
  )

  const fetchHistory=async () => {
    try {
      //calling the history from the backend
      const res= await fetch('http://localhost:8080/scan/history')
      const data= await res.json()
      setScans(data)
    } catch (err) {
      setError('Failed to load history')
    }
    finally
    {
      setLoading(false)
    }
  }

  const getThreatColor = (level) => {
    if (level === 'SAFE') return '#00d084'
    if (level === 'SUSPICIOUS') return '#ffaa00'
    if (level === 'DANGEROUS') return '#ff7700'
    return '#ff3c3c'
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
        <div style={{ display: 'flex', gap: '32px' }}>
          {['Dashboard', 'History', 'Bulk'].map((item) => (
            <span key={item}
              onClick={() => navigate(item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`)}
              style={{
                fontSize: '12px', color: item === 'History' ? '#fff' : '#444',
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                borderBottom: item === 'History' ? '1px solid #ff3c3c' : 'none', paddingBottom: '2px'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      <div style={{ padding: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>// Scan History</div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#fff' }}>Recent Scans</div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: '#ff3c3c', color: '#fff', border: 'none', padding: '10px 24px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            New Scan →
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#333', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Loading history...
          </div>
        )}

        {error && (
          <div style={{ border: '1px solid #ff3c3c33', background: '#ff3c3c11', padding: '16px 20px', color: '#ff3c3c', fontSize: '13px' }}>
            ⚠ {error}
          </div>
        )}

        {!loading && scans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#222' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>[ ]</div>
            <div style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No scans yet</div>
          </div>
        )}

        {scans.length > 0 && (
          <div style={{ border: '1px solid #1a1a1a' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 100px 120px 160px',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a', background: '#111'
            }}>
              {['Target', 'Type', 'Score', 'Threat Level', 'Scanned At'].map(h => (
                <div key={h} style={{ fontSize: '11px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>

            {/* Table rows */}
            {scans.map((scan, i) => (
              <div
                key={scan.id}
                onClick={() => navigate(`/dashboard?target=${scan.target}`)}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 80px 100px 120px 160px',
                  padding: '14px 20px', borderBottom: i < scans.length - 1 ? '1px solid #0f0f0f' : 'none',
                  cursor: 'pointer', transition: 'background 0.15s',
                  animation: `fadeUp 0.4s ease ${i * 0.05}s both`
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#111'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: '13px', color: '#fff', fontFamily: 'monospace' }}>{scan.target}</div>
                <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{scan.type}</div>
                <div style={{ fontSize: '13px', color: getThreatColor(scan.threatLevel), fontFamily: 'monospace' }}>{scan.finalScore} / 100</div>
                <div style={{ fontSize: '11px', color: getThreatColor(scan.threatLevel), letterSpacing: '0.08em', textTransform: 'uppercase' }}>{scan.threatLevel}</div>
                <div style={{ fontSize: '12px', color: '#333' }}>{new Date(scan.scannedAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default History
