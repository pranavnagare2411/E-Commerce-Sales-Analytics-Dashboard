import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const DAY_SHORT = {
  Monday:'Mon', Tuesday:'Tue', Wednesday:'Wed',
  Thursday:'Thu', Friday:'Fri', Saturday:'Sat', Sunday:'Sun'
}
const WEEKEND = ['Saturday','Sunday']

export default function WeekdayChart({ data }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>WEEKLY PATTERN</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Revenue by Day of Week</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }} barSize={36}>
          <CartesianGrid stroke="#1e1e2e" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="weekday"
            tickFormatter={v => DAY_SHORT[v] || v}
            tick={{ fill:'#6b6b80', fontSize:11, fontFamily:'Space Mono' }}
            axisLine={false} tickLine={false}
          />
          <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fill:'#6b6b80', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip
            formatter={(v) => [`₹${(v/1000).toFixed(1)}K`, 'Revenue']}
            contentStyle={{ background:'#1a1a2e', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}
            labelStyle={{ color:'var(--muted)', fontFamily:'Space Mono', fontSize:11 }}
          />
          <Bar dataKey="revenue" radius={[4,4,0,0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={WEEKEND.includes(d.weekday) ? '#7c5cfc' : '#ff6b35'} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display:'flex', gap:16, marginTop:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--muted)' }}>
          <div style={{ width:10, height:10, borderRadius:2, background:'#ff6b35' }} /> Weekday
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--muted)' }}>
          <div style={{ width:10, height:10, borderRadius:2, background:'#7c5cfc' }} /> Weekend
        </div>
      </div>
    </div>
  )
}
