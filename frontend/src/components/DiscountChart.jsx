import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#1a1a2e', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', marginBottom:6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontSize:13 }}>
          {p.name === 'avg_revenue' ? `Avg Revenue: ₹${p.value}` : `Avg Review: ${p.value} ★`}
        </div>
      ))}
    </div>
  )
}

export default function DiscountChart({ data }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>DISCOUNT ANALYSIS</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>Discount Impact on Revenue & Satisfaction</div>
      <div style={{ fontSize:12, color:'var(--muted)', marginBottom:20 }}>
        How discount bands affect average order value and customer review scores
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top:4, right:40, left:0, bottom:0 }}>
          <CartesianGrid stroke="#1e1e2e" strokeDasharray="4 4" />
          <XAxis dataKey="discount_band" tick={{ fill:'#6b6b80', fontSize:11, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tickFormatter={v => `₹${v}`} tick={{ fill:'#6b6b80', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} width={56} />
          <YAxis yAxisId="right" orientation="right" domain={[1,5]} tick={{ fill:'#6b6b80', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
          <Legend wrapperStyle={{ fontSize:12, color:'var(--muted)' }} />
          <Bar yAxisId="left" dataKey="avg_revenue" fill="#ff6b35" opacity={0.85} radius={[4,4,0,0]} barSize={48} name="avg_revenue" />
          <Line yAxisId="right" type="monotone" dataKey="avg_review" stroke="#ffcc00" strokeWidth={2.5} dot={{ fill:'#ffcc00', r:5 }} name="avg_review" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
