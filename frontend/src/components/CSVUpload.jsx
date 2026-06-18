import React, { useState, useRef } from 'react'
import { analyzeOrders } from '../utils/analyze.js'

const card = { background:'var(--s1)', border:'1px solid var(--border)', borderRadius:12, padding:'22px 24px' }
const btn = (color='#ff6b35') => ({
  display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px',
  borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
  border:'none', background:color, color:'#fff', fontFamily:'inherit', transition:'all 0.15s',
})

export default function CSVUpload({ onData }) {
  const [drag, setDrag] = useState(false)
  const [preview, setPreview] = useState(null)
  const [parsedOrders, setParsedOrders] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const parseCSV = (text) => {
    const lines = text.trim().split('\n').filter(Boolean)
    if (lines.length < 2) { setError('CSV needs at least a header and one data row.'); return }
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
    const rows = lines.slice(1).map(l => {
      const cols = l.split(',').map(c => c.trim().replace(/['"]/g, ''))
      const obj = {}
      headers.forEach((h, i) => obj[h] = cols[i] || '')
      return obj
    })
    const revCol = headers.find(x => ['revenue','sales','amount','price','total','value'].includes(x))
    if (!revCol) { setError('Could not find a revenue/sales/amount column. Check your CSV headers.'); return }
    const catCol = headers.find(x => ['category','cat','type','product_category','dept'].includes(x))
    const dateCol = headers.find(x => ['date','order_date','created_at','timestamp','day'].includes(x))
    const payCol  = headers.find(x => ['payment_type','payment','pay_method','method'].includes(x))
    const revwCol = headers.find(x => ['review_score','rating','score','stars','review'].includes(x))
    const stateCol= headers.find(x => ['state','region','location','city','province'].includes(x))
    const orders = rows.filter(r => r[revCol] && !isNaN(parseFloat(r[revCol]))).map((r, i) => ({
      order_id: r['order_id'] || r['id'] || `CSV${i}`,
      date: r[dateCol] || '2024-01-01',
      category: r[catCol] || 'other',
      revenue: parseFloat(r[revCol]) || 0,
      quantity: parseInt(r['quantity'] || r['qty'] || 1) || 1,
      payment_type: r[payCol] || 'credit_card',
      review_score: parseInt(r[revwCol]) || 4,
      state: r[stateCol] || 'SP',
    }))
    if (orders.length === 0) { setError('No valid numeric revenue data found.'); return }
    setError('')
    setPreview({ headers, sampleRows: rows.slice(0, 5), total: orders.length })
    setParsedOrders(orders)
  }

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) { setError('Please upload a .csv file'); return }
    const reader = new FileReader()
    reader.onload = e => parseCSV(e.target.result)
    reader.readAsText(file)
  }

  const apply = () => {
    if (!parsedOrders) return
    const analytics = analyzeOrders(parsedOrders)
    onData(analytics, 'csv')
  }

  const mono = { fontFamily:'Courier New, monospace' }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={card}>
        <div style={{ fontFamily:'Courier New,monospace', fontSize:10, color:'#6b7280', letterSpacing:2, marginBottom:4 }}>DATA INGESTION</div>
        <div style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Upload CSV File</div>

        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
          style={{
            border:`2px dashed ${drag ? '#ff6b35' : 'rgba(255,255,255,0.15)'}`,
            borderRadius:12, padding:'40px', textAlign:'center', cursor:'pointer',
            background: drag ? 'rgba(255,107,53,0.05)' : 'transparent',
            transition:'all 0.2s',
          }}
        >
          <input ref={inputRef} type="file" accept=".csv" style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Drop your CSV here or click to browse</div>
          <div style={{ fontSize:12, color:'#6b7280' }}>Accepts any CSV with sales / order data</div>
          <div style={{ fontSize:12, color:'#ff6b35', marginTop:10 }}>Required: a column named revenue, sales, amount, price, or total</div>
        </div>

        {error && <div style={{ marginTop:14, padding:'12px 16px', background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:8, fontSize:13, color:'#f87171' }}>⚠ {error}</div>}

        <div style={{ marginTop:20, background:'var(--s2)', borderRadius:10, padding:16, border:'1px solid var(--border)' }}>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:10, color:'#00e5b0' }}>📋 Expected CSV Format</div>
          <div style={{ ...mono, fontSize:11, color:'#6b7280', lineHeight:2.2 }}>
            order_id, date, category, revenue, quantity, payment_type, review_score, state<br />
            ORD001, 2024-01-15, electronics, 1200.50, 2, credit_card, 5, SP<br />
            ORD002, 2024-01-16, fashion, 350.00, 1, boleto, 4, RJ
          </div>
        </div>
      </div>

      {preview && (
        <div style={card}>
          <div style={{ fontFamily:'Courier New,monospace', fontSize:10, color:'#6b7280', letterSpacing:2, marginBottom:4 }}>PREVIEW</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:600 }}>First 5 rows · {preview.total.toLocaleString()} valid records found</div>
            <span style={{ fontSize:12, color:'#00e5b0', background:'rgba(0,229,176,0.1)', border:'1px solid rgba(0,229,176,0.25)', padding:'3px 12px', borderRadius:20 }}>✓ Parsed</span>
          </div>
          <div style={{ overflowX:'auto', marginBottom:20 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr>{preview.headers.map(h => <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontFamily:'Courier New,monospace', fontSize:9, letterSpacing:1.5, color:'#6b7280', borderBottom:'1px solid var(--border)', textTransform:'uppercase' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.sampleRows.map((row, i) => (
                  <tr key={i} style={{ background: i%2===0?'transparent':'rgba(255,255,255,0.02)' }}>
                    {preview.headers.map(h => <td key={h} style={{ padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.03)', color:'var(--text)' }}>{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button style={btn()} onClick={apply}>✓ Apply & Analyze Dashboard</button>
            <button style={{ ...btn('transparent'), border:'1px solid var(--border2)', color:'var(--text)' }} onClick={() => { setPreview(null); setParsedOrders(null) }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
