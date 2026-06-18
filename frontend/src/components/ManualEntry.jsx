import React, { useState } from 'react'
import { analyzeOrders } from '../utils/analyze.js'

const CATS = ['electronics','fashion','home_appliances','beauty','sports','books','toys','food','furniture','auto_parts']
const STATES = ['SP','RJ','MG','RS','PR','SC','BA','GO','PE','CE']
const PAYS = ['credit_card','boleto','voucher','debit_card']

const card = { background:'var(--s1)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }
const mono = { fontFamily:'Courier New, monospace' }
const inputStyle = {
  width:'100%', background:'var(--s2)', border:'1px solid rgba(255,255,255,0.12)',
  borderRadius:8, color:'var(--text)', fontSize:13, padding:'8px 12px', fontFamily:'inherit', outline:'none',
}
const labelStyle = { display:'block', ...mono, fontSize:9, color:'#6b7280', letterSpacing:2, marginBottom:5, textTransform:'uppercase' }
const btn = (bg='#ff6b35', color='#fff') => ({
  display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px',
  borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
  border:'none', background:bg, color, fontFamily:'inherit', transition:'all 0.15s',
})

let counter = 0

const defaultForm = () => ({
  order_id: '',
  date: new Date().toISOString().slice(0,10),
  category: '',
  revenue: '',
  quantity: '1',
  payment_type: '',
  review_score: '',
  state: '',
})

export default function ManualEntry({ onData }) {
  const [form, setForm] = useState(defaultForm())
  const [entries, setEntries] = useState([])
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.date) e.date = true
    if (!form.category) e.category = true
    if (!form.revenue || isNaN(parseFloat(form.revenue))) e.revenue = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const add = () => {
    if (!validate()) return
    const entry = {
      order_id: form.order_id || `MAN${String(++counter).padStart(3,'0')}`,
      date: form.date,
      category: form.category,
      revenue: parseFloat(form.revenue),
      quantity: parseInt(form.quantity) || 1,
      payment_type: form.payment_type || 'credit_card',
      review_score: parseInt(form.review_score) || 4,
      state: form.state || 'SP',
    }
    setEntries(prev => [...prev, entry])
    setForm(defaultForm())
    setErrors({})
  }

  const remove = (i) => setEntries(prev => prev.filter((_, idx) => idx !== i))

  const analyze = () => {
    if (entries.length === 0) return
    const analytics = analyzeOrders(entries)
    onData(analytics, 'manual')
  }

  const fmt = (n) => n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n.toFixed(0)}`
  const fieldBorder = (k) => ({ ...inputStyle, border:`1px solid ${errors[k] ? '#f87171' : 'rgba(255,255,255,0.12)'}` })
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5-n)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={card}>
        <div style={{ ...mono, fontSize:10, color:'#6b7280', letterSpacing:2, marginBottom:4 }}>MANUAL INPUT</div>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Add Transaction Record</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div><label style={labelStyle}>Order ID (optional)</label><input style={inputStyle} value={form.order_id} onChange={e=>set('order_id',e.target.value)} placeholder="Auto-generated if blank" /></div>
          <div><label style={labelStyle}>Date *</label><input type="date" style={fieldBorder('date')} value={form.date} onChange={e=>set('date',e.target.value)} /></div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select style={fieldBorder('category')} value={form.category} onChange={e=>set('category',e.target.value)}>
              <option value="">Select category</option>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Revenue ₹ *</label><input type="number" style={fieldBorder('revenue')} value={form.revenue} onChange={e=>set('revenue',e.target.value)} placeholder="1200.50" min="0" /></div>
          <div><label style={labelStyle}>Quantity</label><input type="number" style={inputStyle} value={form.quantity} onChange={e=>set('quantity',e.target.value)} min="1" /></div>
          <div>
            <label style={labelStyle}>Payment Type</label>
            <select style={inputStyle} value={form.payment_type} onChange={e=>set('payment_type',e.target.value)}>
              <option value="">Select (defaults to credit_card)</option>
              {PAYS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Review Score (1–5)</label>
            <select style={inputStyle} value={form.review_score} onChange={e=>set('review_score',e.target.value)}>
              <option value="">Select (defaults to 4)</option>
              {[5,4,3,2,1].map(s => <option key={s} value={s}>{stars(s)} ({s}/5)</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>State</label>
            <select style={inputStyle} value={form.state} onChange={e=>set('state',e.target.value)}>
              <option value="">Select (defaults to SP)</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:8, fontSize:12, color:'#f87171' }}>
            ⚠ Please fill in: {Object.keys(errors).join(', ')}
          </div>
        )}

        <div style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' }}>
          <button style={btn()} onClick={add}>+ Add Record</button>
          {entries.length > 0 && <button style={btn('#00e5b0','#0a1a14')} onClick={analyze}>⚡ Analyze {entries.length} Record{entries.length!==1?'s':''}</button>}
          {entries.length > 0 && <button style={btn('transparent','var(--muted)', '1px solid var(--border2)')} onClick={()=>setEntries([])}>Clear All</button>}
        </div>
      </div>

      {entries.length > 0 && (
        <div style={card}>
          <div style={{ ...mono, fontSize:10, color:'#6b7280', letterSpacing:2, marginBottom:4 }}>ENTERED RECORDS</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:600 }}>{entries.length} record{entries.length!==1?'s':''} · Total: <span style={{ color:'#ff6b35' }}>{fmt(entries.reduce((s,e)=>s+e.revenue,0))}</span></div>
          </div>
          <div style={{ maxHeight:300, overflowY:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr>{['#','Date','Category','Revenue','Qty','Payment','Score','State',''].map(h=>(
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', ...mono, fontSize:9, letterSpacing:1.5, color:'#6b7280', borderBottom:'1px solid var(--border)', textTransform:'uppercase' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i} style={{ transition:'background 0.15s' }}
                    onMouseEnter={ev=>ev.currentTarget.style.background='rgba(255,255,255,0.03)'}
                    onMouseLeave={ev=>ev.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'9px 12px', color:'#6b7280', ...mono }}>{i+1}</td>
                    <td style={{ padding:'9px 12px' }}>{e.date}</td>
                    <td style={{ padding:'9px 12px' }}><span style={{ background:'rgba(255,107,53,0.15)', color:'#ff6b35', padding:'2px 8px', borderRadius:12, fontSize:10, fontWeight:600 }}>{e.category}</span></td>
                    <td style={{ padding:'9px 12px', ...mono, fontWeight:700, color:'#00e5b0' }}>{fmt(e.revenue)}</td>
                    <td style={{ padding:'9px 12px' }}>{e.quantity}</td>
                    <td style={{ padding:'9px 12px', color:'#6b7280', fontSize:11 }}>{e.payment_type}</td>
                    <td style={{ padding:'9px 12px' }}>{'★'.repeat(e.review_score)}</td>
                    <td style={{ padding:'9px 12px' }}><span style={{ background:'rgba(167,139,250,0.15)', color:'#a78bfa', padding:'2px 8px', borderRadius:12, fontSize:10, fontWeight:600 }}>{e.state}</span></td>
                    <td style={{ padding:'9px 12px' }}><button onClick={()=>remove(i)} style={{ background:'none', border:'none', color:'#f87171', cursor:'pointer', fontSize:14, padding:2 }}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
