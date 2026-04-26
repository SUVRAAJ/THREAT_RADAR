import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import ThreatBadge from '../components/ThreatBadge'
import useIsMobile from '../hooks/useIsMobile'
import {api} from '../utilities/api'

const Bulk = () => {
  const isMobile= useIsMobile()
  const navigate= useNavigate()
  //initialising valid states
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  //handler function for the bulk scan
  const handleScan= async () => {
    //
    const targets= input.split('\n').map(t=> t.trim()).filter(t=>t.length>0)

    //validating the target's results
    if(targets.length===0) return
    if(targets.length>10)
    {
      setError('10 is the maximum limit for the scan')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      //
      const data= await api.post("/scan/bulk", { targets });
      setResults(data)
    } catch (err) {
      setError(err.message)
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
                fontSize: '12px', color: item === 'Bulk' ? '#fff' : '#444',
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                borderBottom: item === 'Bulk' ? '1px solid #ff3c3c' : 'none', paddingBottom: '2px'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      <div style={{ padding: isMobile ? '24px 16px' : '48px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>// Bulk Scanner</div>
          <div style={{ fontSize: '24px', fontWeight: 500, color: '#fff' }}>Scan Multiple Targets</div>
          <div style={{ fontSize: '13px', color: '#333', marginTop: '8px' }}>Enter up to 10 IPs, domains or URLs — one per line</div>
        </div>

        {/* Input */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 200px', gap: '0', marginBottom: '32px', alignItems: 'stretch' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`8.8.8.8\n1.1.1.1\nfacebook.com`}
            rows={6}
            style={{
              background: '#111', border: '1px solid #333', borderRight: 'none',
              color: '#fff', fontSize: '14px', padding: '16px 20px',
              fontFamily: 'monospace', outline: 'none', resize: 'none',
              lineHeight: '1.8'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <button
              onClick={handleScan}
              disabled={loading}
              style={{
                flex: 1, background: loading ? '#333' : '#ff3c3c', color: '#fff',
                border: 'none', fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'background 0.2s'
              }}
            >
              {loading ? 'Scanning...' : 'Analyze All →'}
            </button>
            <div style={{
              background: '#111', border: '1px solid #333', borderTop: 'none',
              padding: '12px 16px', fontSize: '11px', color: '#333',
              letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center'
            }}>
              {input.split('\n').filter(t => t.trim()).length} / 10 targets
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ border: '1px solid #ff3c3c33', background: '#ff3c3c11', padding: '16px 20px', color: '#ff3c3c', fontSize: '13px', marginBottom: '24px' }}>
            ⚠ {error}
          </div>
        )}

        {/* Summary */}
        {results && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: '1px', background: '#1a1a1a', marginBottom: '24px' }}>
              {[
                { label: 'Total', val: results.summary.total, color: '#fff' },
                { label: 'Successful', val: results.summary.successful, color: '#00d084' },
                { label: 'Failed', val: results.summary.failed, color: '#ff3c3c' },
                { label: 'Dangerous+', val: (results.summary.dangerous || 0) + (results.summary.critical || 0), color: '#ff7700' },
                { label: 'Safe', val: results.summary.safe, color: '#00d084' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#0a0a0a', padding: '20px 24px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 500, color: s.color, fontFamily: 'monospace' }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Results table */}
            <div style={{ border: '1px solid #1a1a1a' }}>
              <div style={{
                display: 'grid', gridTemplateColumns: isMobile ? '1fr 120px' : '1fr 80px 100px 140px',
                padding: '12px 20px', borderBottom: '1px solid #1a1a1a', background: '#111'
              }}>
                {['Target', 'Type', 'Score', 'Threat Level'].map(h => (
                  <div key={h} style={{ fontSize: '11px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>

              {results.results.map((result, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '1fr 80px 100px 140px',
                  padding: '14px 20px', borderBottom: i < results.results.length - 1 ? '1px solid #0f0f0f' : 'none',
                  animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                  transition: 'background 0.15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#111'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {result.success ? (
                    <>
                      <div style={{ fontSize: '13px', color: '#fff', fontFamily: 'monospace' }}>{result.data.target}</div>
                      <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase' }}>{result.data.type}</div>
                      <div style={{ fontSize: '13px', color: getThreatColor(result.data.threatLevel), fontFamily: 'monospace' }}>
                        {result.data.finalScore} / 100
                      </div>
                      <ThreatBadge level={result.data.threatLevel} />
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '13px', color: '#ff3c3c', fontFamily: 'monospace' }}>{result.target}</div>
                      <div style={{ fontSize: '11px', color: '#444' }}>—</div>
                      <div style={{ fontSize: '11px', color: '#ff3c3c' }}>Failed</div>
                      <div style={{ fontSize: '11px', color: '#333' }}>{result.error}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
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

export default Bulk
