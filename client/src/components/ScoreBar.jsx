import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
const ScoreBar = ({ label, score, delay = 0 }) => {
    //state for width
    const [width, setWidth] = useState(0)

    
    useEffect(() => {
        const timer= setTimeout(() => {
          setWidth(score)
        }
        ,delay)
        return ()=> clearTimeout(timer)
    }
    ,[score, delay])

    //function to decide colour according to the threat score
    const getColor= (s) => {
    if (s <= 15) return '#00d084'
    if (s <= 40) return '#ffaa00'
    if (s <= 70) return '#ff7700'
    return '#ff3c3c'
}

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontSize: '14px', color: '#fff', fontFamily: 'monospace' }}>
          {score} <span style={{ color: '#333' }}>/ 100</span>
        </span>
      </div>
      <div style={{ height: '3px', background: '#1a1a1a', width: '100%' }}>
        <div style={{
          height: '3px',
          width: `${width}%`,
          background: getColor(score),
          transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </div>
    </div>
  )
}

export default ScoreBar
