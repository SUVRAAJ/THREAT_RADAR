import React from 'react'

const ThreatBadge = ({level}) => {
    const config = {
    SAFE:       { color: '#00d084', bg: '#00d08415', border: '#00d08433' },
    SUSPICIOUS: { color: '#ffaa00', bg: '#ffaa0015', border: '#ffaa0033' },
    DANGEROUS:  { color: '#ff7700', bg: '#ff770015', border: '#ff770033' },
    CRITICAL:   { color: '#ff3c3c', bg: '#ff3c3c15', border: '#ff3c3c33' },
  }

  const c = config[level] || config.SAFE
  
    return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: c.color,
        boxShadow: `0 0 8px ${c.color}`,
        animation: level !== 'SAFE' ? 'pulse 1.5s infinite' : 'none'
      }} />
      <span style={{
        fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
        color: c.color, background: c.bg, border: `1px solid ${c.border}`,
        padding: '4px 12px'
      }}>
        {level}
      </span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px ${c.color}; }
          50% { opacity: 0.5; box-shadow: 0 0 16px ${c.color}; }
        }
      `}</style>
    </div>
  )
}

export default ThreatBadge

