import React from 'react'

export default function TopProducts({ data }) {
  const max = Math.max(...data.map(d => d.revenue))
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>TOP SKUs</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Best Performing Products</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {data.map((d, i) => {
          const pct = (d.revenue / max) * 100
          const colors = ['#ff6b35','#00d4aa','#7c5cfc','#ffcc00','#ff4444','#22dd88','#4dabf7','#f06595','#74c0fc','#a9e34b']
          return (
            <div key={d.product} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', width:20, textAlign:'right' }}>
                {i + 1}
              </span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, color:'var(--text)', fontWeight:500 }}>{d.product}</span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color: colors[i] }}>
                    ₹{(d.revenue/1000).toFixed(1)}K
                  </span>
                </div>
                <div style={{ height:3, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background: colors[i], borderRadius:2 }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
