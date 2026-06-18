import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const COLORS = ['#ff6b35','#00d4aa','#7c5cfc','#ffcc00','#ff4444','#22dd88','#4dabf7','#f06595','#74c0fc','#a9e34b']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform:'uppercase' }}>{d.category}</div>
      <div style={{ color: '#ff6b35', fontSize: 13 }}>Revenue: ₹{(d.revenue/1000).toFixed(1)}K</div>
      <div style={{ color: '#00d4aa', fontSize: 13 }}>Orders: {d.orders}</div>
      <div style={{ color: '#ffcc00', fontSize: 13 }}>Share: {d.market_share}%</div>
    </div>
  )
}

export default function CategoryChart({ data, tall }) {
  const sorted = [...data].sort((a,b) => b.revenue - a.revenue)
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px', ...(tall?{minHeight:360}:{}) }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>CATEGORY PERFORMANCE</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Revenue by Product Category</div>
      <ResponsiveContainer width="100%" height={tall ? 290 : 220}>
        <BarChart data={sorted} margin={{ top:4, right:4, left:0, bottom:40 }} barSize={22}>
          <CartesianGrid stroke="#1e1e2e" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="category" tick={{ fill:'#6b6b80', fontSize:9, fontFamily:'Space Mono' }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} interval={0} />
          <YAxis tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} tick={{ fill:'#6b6b80', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="revenue" radius={[4,4,0,0]}>
            {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
