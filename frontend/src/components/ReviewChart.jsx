import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STAR_COLORS = ['#ff4444','#ff8c42','#ffcc00','#90ee90','#22dd88']
const STARS = ['★','★★','★★★','★★★★','★★★★★']

export default function ReviewChart({ data }) {
  const sorted = [...data].sort((a,b) => a.review_score - b.review_score)
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>SATISFACTION</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>Review Scores</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sorted} margin={{ top:4, right:4, left:0, bottom:0 }} barSize={32}>
          <XAxis dataKey="review_score" tickFormatter={v => STARS[v-1]} tick={{ fill:'#6b6b80', fontSize:12 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            formatter={(v, n, p) => [`${p.payload.pct}% (${v} orders)`, 'Count']}
            contentStyle={{ background:'#1a1a2e', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}
            labelStyle={{ color:'var(--muted)' }}
          />
          <Bar dataKey="count" radius={[4,4,0,0]}>
            {sorted.map((_, i) => <Cell key={i} fill={STAR_COLORS[i]} opacity={0.9} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
