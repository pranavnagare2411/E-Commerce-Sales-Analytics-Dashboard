import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#ff6b35', '#00d4aa', '#7c5cfc', '#ffcc00']
const LABELS = { credit_card: 'Credit Card', boleto: 'Boleto', voucher: 'Voucher', debit_card: 'Debit Card' }

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background:'#1a1a2e', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px' }}>
      <div style={{ color:'var(--text)', fontSize:13, fontWeight:600 }}>{LABELS[d.payment_type] || d.payment_type}</div>
      <div style={{ color:'var(--muted)', fontSize:12 }}>{d.pct}% · {d.count} orders</div>
    </div>
  )
}

export default function PaymentChart({ data }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:2, marginBottom:4 }}>PAYMENT MIX</div>
      <div style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>Payment Methods</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="payment_type" cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.9} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => LABELS[v] || v} wrapperStyle={{ fontSize:11, color:'var(--muted)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
