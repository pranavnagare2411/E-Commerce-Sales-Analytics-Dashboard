import React, { useState, useEffect } from 'react'

const PAGES = {
  overview:  ['System Overview','Real-time holistic performance metrics'],
  sales:     ['Sales Trends','Revenue patterns & geographic breakdown'],
  products:  ['Product Intelligence','Category & SKU level analysis'],
  customers: ['Customer Insights','Behaviour & satisfaction analysis'],
  upload:    ['CSV Upload','Ingest your own data file'],
  manual:    ['Manual Entry','Add records individually'],
}

export default function Header({ activeSection, theme, onThemeToggle }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN'))
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  const [title, sub] = PAGES[activeSection] || PAGES.overview
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(14,14,28,0.85)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:50 }}>
      <div>
        <div style={{ fontFamily:'Courier New,monospace', fontSize:9, color:'#ff6b35', letterSpacing:3, marginBottom:2 }}>{activeSection.toUpperCase()}</div>
        <div style={{ fontSize:18, fontWeight:700 }}>{title}</div>
        <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{sub}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ fontFamily:'Courier New,monospace', fontSize:11, color:'#6b7280' }}>{time}</div>
        <button onClick={onThemeToggle} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'var(--text,#f0f0ff)', fontSize:12, padding:'6px 14px', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
          {theme==='dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
    </div>
  )
}
