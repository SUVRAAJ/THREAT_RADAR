import React from 'react'

const IPcard = ({virustotal,abuseipdb}) => {
    const rows = [
    { key: 'Owner', val: virustotal?.owner || 'Unknown' },
    { key: 'Network', val: virustotal?.network || 'Unknown' },
    { key: 'Country', val: virustotal?.country || 'Unknown' },
    { key: 'Reputation', val: virustotal?.reputation },
    { key: 'Tor Node', val: abuseipdb?.isTor ? 'YES ⚠' : 'No', danger: abuseipdb?.isTor },
    { key: 'Abuse Reports', val: abuseipdb?.totalReports, danger: abuseipdb?.totalReports > 10 },
    { key: 'Usage Type', val: abuseipdb?.usageType || 'Unknown' },
    { key: 'Domain', val: abuseipdb?.domain || 'Unknown' },
    { key: 'Last Reported', val: abuseipdb?.lastReported ? new Date(abuseipdb.lastReported).toLocaleDateString() : 'Never' },
  ]
    return (
    <div style={{
      background: '#111', border: '1px solid #1a1a1a',
      padding: '24px', animation: 'fadeUp 0.5s ease forwards'
    }}>
      <div style={{
        fontSize: '11px', color: '#444', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: '16px'
      }}>
        // IP Intelligence
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '8px 0', borderBottom: i < rows.length - 1 ? '1px solid #1a1a1a' : 'none',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#444' }}>{row.key}</span>
          <span style={{
            fontSize: '12px', fontFamily: 'monospace',
            color: row.danger ? '#ff3c3c' : '#888'
          }}>
            {row.val}
          </span>
        </div>
      ))}
    </div>
  )
}

export default IPcard
