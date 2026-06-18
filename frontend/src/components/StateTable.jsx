import React from 'react'

const STATE_FULL = {
  SP:'São Paulo', RJ:'Rio de Janeiro', MG:'Minas Gerais', RS:'Rio Grande do Sul',
  PR:'Paraná', SC:'Santa Catarina', BA:'Bahia', GO:'Goiás', PE:'Pernambuco', CE:'Ceará'
}

export default function StateTable({ data }) {
  const max = Math.max(...data.map(d => d.revenue))
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>GEOGRAPHY</div>
      <div style={{ fontSize:18, fontWeight:600, marginBottom:24 }}>State-wise Sales Performance</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {data.map((d, i) => {
          const pct = (d.revenue / max) * 100
          return (
            <div key={d.state} style={{ background:'var(--surface2)', borderRadius:10, padding:'16px 20px', border:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:18, fontWeight:700, color: i === 0 ? 'var(--accent)' : 'var(--text)' }}>{d.state}</span>
                  <span style={{ fontSize:12, color:'var(--muted)', marginLeft:8 }}>{STATE_FULL[d.state]}</span>
                </div>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--accent2)' }}>#{i+1}</span>
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background: i === 0 ? 'var(--accent)' : 'var(--accent3)', borderRadius:2, transition:'width 0.8s ease' }} />
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:13, fontWeight:700 }}>₹{(d.revenue/1000).toFixed(1)}K</span>
                <span style={{ fontSize:12, color:'var(--muted)' }}>{d.orders} orders</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
