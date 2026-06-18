import React, { useState, useEffect } from 'react'

function KPICard({ label, value, color='#ff6b35', prefix='', suffix='' }) {
  const [disp, setDisp] = useState(0)
  const isNum = typeof value === 'number'
  useEffect(() => {
    if (!isNum) return
    const target=value,dur=1100,start=performance.now()
    const raf=ts=>{const p=Math.min((ts-start)/dur,1);const e=1-Math.pow(1-p,3);setDisp(target*e);if(p<1)requestAnimationFrame(raf)}
    requestAnimationFrame(raf)
  }, [value])
  const fmt = n => { if(n>=1e6)return(n/1e6).toFixed(2)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return n.toFixed(suffix.includes('/')||suffix.includes('%')?1:0) }
  return (
    <div style={{ background:'#0e0e1c', border:'1px solid rgba(255,255,255,0.07)', borderTop:`2px solid ${color}`, borderRadius:12, padding:'18px 20px', transition:'border-color 0.2s', cursor:'default' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=color}
      onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}>
      <div style={{ fontFamily:'Courier New,monospace', fontSize:9, color:'#6b7280', letterSpacing:2, marginBottom:10, textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontFamily:'Courier New,monospace', fontSize:26, fontWeight:700, color, lineHeight:1 }}>{prefix}{isNum?fmt(disp):value}{suffix}</div>
    </div>
  )
}

export default function KPIRow({ kpis }) {
  const r = kpis || {}
  const totalRev = r.total_revenue || r.kpis?.total_revenue || 0
  const totalOrders = r.total_orders || r.kpis?.total_orders || 0
  const avgOrder = r.avg_order_value || r.kpis?.avg_order_value || 0
  const margin = r.profit_margin_pct || r.kpis?.profit_margin_pct || 0
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
      <KPICard label="Total Revenue" value={totalRev} prefix="₹" color="#ff6b35" />
      <KPICard label="Total Orders"  value={totalOrders} color="#00e5b0" />
      <KPICard label="Avg Order Value" value={avgOrder} prefix="₹" color="#a78bfa" />
      <KPICard label="Profit Margin"  value={margin} suffix="%" color="#fbbf24" />
    </div>
  )
}
