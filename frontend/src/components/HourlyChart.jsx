import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function HourlyChart({ data }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>ORDER TIMING</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>Hourly Order Pattern</div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }}>
          <defs>
            <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c5cfc" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#7c5cfc" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e1e2e" strokeDasharray="4 4" />
          <XAxis dataKey="hour" tickFormatter={v => `${v}h`} tick={{ fill:'#6b6b80', fontSize:9, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} interval={3} />
          <YAxis hide />
          <Tooltip
            formatter={(v) => [v, 'Orders']}
            labelFormatter={v => `Hour ${v}:00`}
            contentStyle={{ background:'#1a1a2e', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}
            labelStyle={{ color:'var(--muted)' }}
          />
          <Area type="monotone" dataKey="orders" stroke="#7c5cfc" strokeWidth={2} fill="url(#hourGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
