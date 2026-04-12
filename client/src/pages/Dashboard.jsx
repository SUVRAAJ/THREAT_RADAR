import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const Dashboard = () => {
  const navigate= useNavigate()
  const [target, setTarget] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  
  //handler functions
  const handleScan= async () => {
    if(!target.trim()) return
    setLoading(true)
    setError(null)
    setReport(null)

    try {
      //calling the api for scan
      const res= await fetch(`http://localhost:8080/scan/analyze?target=${target.trim()}`)
      const data= await res.json()
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
      <div style={{ padding: '48px 48px 0' }}>
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

        {/* Empty state */}
        {!report && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#222' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', fontFamily: 'monospace' }}>[ ]</div>
            <div style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Enter a target to begin scanning
            </div>
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

        {/* Report — placeholder for now */}
        {report && (
          <div style={{ color: '#fff', fontSize: '13px' }}>
            <pre>{JSON.stringify(report, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
