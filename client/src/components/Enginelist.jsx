import React from 'react'
import { useState } from 'react'

const Enginelist = ({engines}) => {
  const [filter, setFilter] = useState('all')
  if(!engines) return null

  const engineArray= Object.entries(engines).map(([name, data]) => ({
    name,
    category: data.category,
    result: data.result,
    method: data.method
  }))

  const filtered = filter === 'all'
    ? engineArray
    : engineArray.filter(e => e.category === filter)

  const getColor = (category) => {
    if (category === 'malicious') return '#ff3c3c'
    if (category === 'suspicious') return '#ffaa00'
    if (category === 'harmless') return '#00d084'
    return '#333'
  }

  const counts = {
    malicious: engineArray.filter(e => e.category === 'malicious').length,
    suspicious: engineArray.filter(e => e.category === 'suspicious').length,
    harmless: engineArray.filter(e => e.category === 'harmless').length,
    undetected: engineArray.filter(e => e.category === 'undetected').length,
  }

    return (
    <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '24px', marginTop: '16px' }}>
      <div style={{
        fontSize: '11px', color: '#444', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: '16px'
      }}>
        // Engine Breakdown
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${engineArray.length})` },
          { key: 'malicious', label: `Malicious (${counts.malicious})` },
          { key: 'suspicious', label: `Suspicious (${counts.suspicious})` },
          { key: 'harmless', label: `Clean (${counts.harmless})` },
          { key: 'undetected', label: `Unrated (${counts.undetected})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              background: filter === tab.key ? '#ff3c3c' : 'none',
              border: `1px solid ${filter === tab.key ? '#ff3c3c' : '#222'}`,
              color: filter === tab.key ? '#fff' : '#444',
              padding: '4px 12px', fontSize: '11px', cursor: 'pointer',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Engine rows */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filtered.map((engine, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '8px 0', borderBottom: '1px solid #0f0f0f'
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              background: getColor(engine.category)
            }} />
            <span style={{ fontSize: '13px', color: '#666', flex: 1 }}>{engine.name}</span>
            <span style={{
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.06em', color: getColor(engine.category)
            }}>
              {engine.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Enginelist
