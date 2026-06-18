import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const card = (tall) => ({
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '22px 24px',
  ...(tall ? { minHeight: 360 } : {}),
})

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
          {p.name}: {p.name === 'orders' ? p.value : `₹${(p.value/1000).toFixed(1)}K`}
        </div>
      ))}
    </div>
  )
}

export default function RevenueChart({ data, tall }) {
  const fmt = (v) => `₹${(v/1000).toFixed(0)}K`
  const label = (v) => v.length > 7 ? v.slice(2) : v

  return (
    <div style={card(tall)}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 2, marginBottom: 4 }}>REVENUE TREND</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Monthly Revenue & Orders</div>
      <ResponsiveContainer width="100%" height={tall ? 280 : 220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e1e2e" strokeDasharray="4 4" />
          <XAxis dataKey="year_month" tickFormatter={label} tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fill: '#6b6b80', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted)' }} />
          <Area type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2} fill="url(#rev)" name="revenue" />
          <Area type="monotone" dataKey="profit" stroke="#00d4aa" strokeWidth={2} fill="url(#prof)" name="profit" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
