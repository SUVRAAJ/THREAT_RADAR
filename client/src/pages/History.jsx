import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, Legend
} from 'recharts'
import useIsMobile from '../hooks/useIsMobile'


/////
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#111', border: '1px solid #222',
        padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px'
      }}>
        <div style={{ color: '#555', marginBottom: '4px' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? Math.round(p.value) : p.value}
          </div>
        ))}
      </div>
    )
  }
  return null
}

const THREAT_COLORS = {
  SAFE: '#00d084',
  SUSPICIOUS: '#ffaa00',
  DANGEROUS: '#ff7700',
  CRITICAL: '#ff3c3c'
}


const History = () => {
  const navigate= useNavigate()
  const isMobile=useIsMobile()
  //setting the necessary states
  const [error, setError] = useState(null)
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState(null)

  //fetching history on mount
  useEffect(() => {
    fetchAll()
  },[]
  )

  const fetchAll=async () => {
    try {
      //calling the history from the backend and the scan stats
      const [histRes, statsRes] = await Promise.all([
        fetch('http://localhost:8080/scan/history'),
        fetch('http://localhost:8080/scan/stats')
      ])
      const histData = await histRes.json()
      const statsData = await statsRes.json()
      setScans(histData)
      setStats(statsData)
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

  const filteredScans = filter === 'all'
    ? scans
    : scans.filter(s => s.threatLevel === filter)

  const pieData = stats?.threatDistribution?.map(t => ({
    name: t.threatLevel,
    value: t.count,
    color: THREAT_COLORS[t.threatLevel] || '#555'
  })) || []

  const lineData = stats?.dailyScans?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    scans: d.total,
    avgScore: Math.round(d.avgScore)
  })) || []
  
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'monospace' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '16px 20px' : '20px 48px', borderBottom: '1px solid #1a1a1a'
      }}>
        <div onClick={() => navigate('/')} style={{ fontSize: '16px', fontWeight: 500, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
          Threat<span style={{ color: '#ff3c3c' }}>Radar</span>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '16px' : '32px' }}>
          {['Dashboard', 'History', 'Bulk'].map((item) => (
            <span key={item}
              onClick={() => navigate(item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase()}`)}
              style={{
                fontSize: '12px', color: item === 'History' ? '#fff' : '#444',
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                borderBottom: item === 'History' ? '1px solid #ff3c3c' : 'none', paddingBottom: '2px'
              }}
            >{item}</span>
          ))}
        </div>
      </nav>

      <div style={{ padding: isMobile ? '24px 16px' : '48px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '32px'
        }}>
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

        {/* Overall Stats Row */}
        {stats?.overall && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '1px', background: '#1a1a1a', marginBottom: '24px'
          }}>
            {[
              { label: 'Total Scans', val: stats.overall.totalScans, color: '#fff' },
              { label: 'Avg Score', val: Math.round(stats.overall.avgScore), color: '#fff' },
              { label: 'Highest Threat', val: stats.overall.highestThreat, color: '#ff3c3c' },
              { label: 'Critical Found', val: stats.overall.critical, color: stats.overall.critical > 0 ? '#ff3c3c' : '#00d084' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#0a0a0a', padding: isMobile ? '16px' : '20px 24px' }}>
                <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 500, color: s.color, fontFamily: 'monospace' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Row */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px', marginBottom: '32px'
          }}>

            {/* Line Chart */}
            <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '24px' }}>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
                // Scans Last 7 Days
              </div>
              {lineData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#333', fontSize: '13px' }}>Not enough data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="date" stroke="#333" tick={{ fill: '#444', fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis stroke="#333" tick={{ fill: '#444', fontSize: 11, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="scans" stroke="#ff3c3c" strokeWidth={2} dot={{ fill: '#ff3c3c', r: 3 }} name="Scans" />
                    <Line type="monotone" dataKey="avgScore" stroke="#ffaa00" strokeWidth={2} dot={{ fill: '#ffaa00', r: 3 }} name="Avg Score" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar Chart */}
            <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '24px' }}>
              <div style={{ fontSize: '11px', color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
                // Threat Level Distribution
              </div>
              {pieData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#333', fontSize: '13px' }}>Not enough data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={pieData}>
                    <XAxis dataKey="name" stroke="#333" tick={{ fill: '#444', fontSize: 11, fontFamily: 'monospace' }} />
                    <YAxis stroke="#333" tick={{ fill: '#444', fontSize: 11, fontFamily: 'monospace' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Count" radius={[2, 2, 0, 0]}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['all', 'SAFE', 'SUSPICIOUS', 'DANGEROUS', 'CRITICAL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#ff3c3c' : 'none',
                border: `1px solid ${filter === f ? '#ff3c3c' : '#222'}`,
                color: filter === f ? '#fff' : '#444',
                padding: '4px 14px', fontSize: '11px', cursor: 'pointer',
                letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s'
              }}
            >
              {f === 'all' ? `All (${scans.length})` : f}
            </button>
          ))}
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

        {!loading && filteredScans.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#222' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>[ ]</div>
            <div style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>No scans found</div>
          </div>
        )}

        {/* Table */}
        {filteredScans.length > 0 && (
          <div style={{ border: '1px solid #1a1a1a' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 100px' : '1fr 80px 100px 120px 160px',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a', background: '#111'
            }}>
              {(isMobile ? ['Target', 'Level'] : ['Target', 'Type', 'Score', 'Threat Level', 'Scanned At']).map(h => (
                <div key={h} style={{ fontSize: '11px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>

            {filteredScans.map((scan, i) => (
              <div
                key={scan.id}
                onClick={() => navigate(`/report/${scan.id}`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 100px' : '1fr 80px 100px 120px 160px',
                  padding: '14px 20px',
                  borderBottom: i < filteredScans.length - 1 ? '1px solid #0f0f0f' : 'none',
                  cursor: 'pointer', transition: 'background 0.15s',
                  animation: `fadeUp 0.4s ease ${i * 0.03}s both`
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#111'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: '13px', color: '#fff', fontFamily: 'monospace' }}>{scan.target}</div>
                {!isMobile && <div style={{ fontSize: '11px', color: '#444', textTransform: 'uppercase' }}>{scan.type}</div>}
                {!isMobile && <div style={{ fontSize: '13px', color: getThreatColor(scan.threatLevel), fontFamily: 'monospace' }}>{scan.finalScore} / 100</div>}
                <div style={{ fontSize: '11px', color: getThreatColor(scan.threatLevel), letterSpacing: '0.08em', textTransform: 'uppercase' }}>{scan.threatLevel}</div>
                {!isMobile && <div style={{ fontSize: '12px', color: '#333' }}>{new Date(scan.scannedAt).toLocaleString()}</div>}
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
