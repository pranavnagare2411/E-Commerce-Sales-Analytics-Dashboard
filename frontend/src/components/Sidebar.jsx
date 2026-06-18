import React from 'react'

const NAV = [
  { id:'overview', icon:'⬡', label:'Overview' },
  { id:'sales',    icon:'◈', label:'Sales' },
  { id:'products', icon:'◉', label:'Products' },
  { id:'customers',icon:'◌', label:'Customers' },
  null,
  { id:'upload',   icon:'↑', label:'CSV Upload' },
  { id:'manual',   icon:'✎', label:'Manual Entry' },
]

const SOURCE_LABELS = { sample:'SAMPLE DATA', csv:'CSV DATA', manual:'MANUAL DATA' }
const SOURCE_COLORS = { sample:'#a78bfa', csv:'#00e5b0', manual:'#fbbf24' }

export default function Sidebar({ activeSection, onSelect, dataSource='sample', recordCount=0 }) {
  return (
    <aside style={{ position:'fixed', left:0, top:0, bottom:0, width:200, background:'#0e0e1c', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', zIndex:100, overflowY:'auto' }}>
      <div style={{ padding:'20px 16px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily:'Courier New,monospace', fontSize:9, color:'#ff6b35', letterSpacing:2, marginBottom:4 }}>ECOM_DASH</div>
        <div style={{ fontSize:16, fontWeight:700 }}>NEXUS<span style={{ color:'#ff6b35' }}>_v2</span></div>
      </div>
      <nav style={{ flex:1, padding:'12px 8px', display:'flex', flexDirection:'column', gap:2 }}>
        {NAV.map((item, idx) => item === null
          ? <div key={idx} style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'8px 4px' }} />
          : (
            <div key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
                borderRadius:8, cursor:'pointer', fontSize:12,
                color: activeSection===item.id ? '#ff6b35' : '#6b7280',
                background: activeSection===item.id ? 'rgba(255,107,53,0.1)' : 'transparent',
                border: `1px solid ${activeSection===item.id ? 'rgba(255,107,53,0.2)' : 'transparent'}`,
                transition:'all 0.18s',
              }}
            >
              <span style={{ fontSize:14, width:18, textAlign:'center' }}>{item.icon}</span>
              {item.label}
              {activeSection===item.id && <span style={{ marginLeft:'auto', width:5, height:5, borderRadius:'50%', background:'#ff6b35' }} />}
            </div>
          )
        )}
      </nav>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:10, fontFamily:'Courier New,monospace', color:'#00e5b0', background:'rgba(0,229,176,0.08)', border:'1px solid rgba(0,229,176,0.2)', borderRadius:20, padding:'3px 10px', marginBottom:8 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#00e5b0', animation:'pulse 1.5s infinite' }} />
          LIVE
        </div>
        <div style={{ fontSize:10, fontFamily:'Courier New,monospace', color:'#6b7280', lineHeight:1.8 }}>
          <div style={{ color: SOURCE_COLORS[dataSource], fontWeight:700 }}>{SOURCE_LABELS[dataSource]}</div>
          <div>{recordCount.toLocaleString()} records</div>
        </div>
      </div>
    </aside>
  )
}
