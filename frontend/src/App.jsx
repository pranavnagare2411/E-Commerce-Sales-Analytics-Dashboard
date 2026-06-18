import React, { useState, useEffect } from 'react'
import sampleAnalytics from './data/analytics.json'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import KPIRow from './components/KPIRow.jsx'
import RevenueChart from './components/RevenueChart.jsx'
import CategoryChart from './components/CategoryChart.jsx'
import PaymentChart from './components/PaymentChart.jsx'
import ReviewChart from './components/ReviewChart.jsx'
import HourlyChart from './components/HourlyChart.jsx'
import StateTable from './components/StateTable.jsx'
import TopProducts from './components/TopProducts.jsx'
import DiscountChart from './components/DiscountChart.jsx'
import WeekdayChart from './components/WeekdayChart.jsx'
import CSVUpload from './components/CSVUpload.jsx'
import ManualEntry from './components/ManualEntry.jsx'

export default function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [data, setData] = useState(sampleAnalytics)
  const [dataSource, setDataSource] = useState('sample')
  const [loaded, setLoaded] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  const handleNewData = (analytics, source) => {
    setData(analytics)
    setDataSource(source)
    setActiveSection('overview')
  }

  const themeVars = theme === 'dark' ? {
    '--bg':'#070711','--s1':'#0e0e1c','--s2':'#151524','--s3':'#1c1c30',
    '--border':'rgba(255,255,255,0.07)','--border2':'rgba(255,255,255,0.12)',
    '--text':'#f0f0ff','--muted':'#6b7280'
  } : {
    '--bg':'#f4f4f8','--s1':'#ffffff','--s2':'#f0f0f5','--s3':'#e8e8ef',
    '--border':'rgba(0,0,0,0.08)','--border2':'rgba(0,0,0,0.15)',
    '--text':'#1a1a2e','--muted':'#6b7280'
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', opacity: loaded?1:0, transition:'opacity 0.4s', ...themeVars, background:'var(--bg)', color:'var(--text)', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} dataSource={dataSource} recordCount={data.total_orders || 0} />
      <main style={{ flex:1, marginLeft:200, overflowY:'auto', minHeight:'100vh' }}>
        <Header activeSection={activeSection} theme={theme} onThemeToggle={()=>setTheme(t=>t==='dark'?'light':'dark')} />
        <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:20 }}>
          {activeSection==='overview' && <>
            <KPIRow kpis={data} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <RevenueChart data={data.monthly_trend||[]} />
              <CategoryChart data={data.category_performance||[]} />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
              <PaymentChart data={data.payment_distribution||[]} />
              <ReviewChart data={data.review_distribution||[]} />
              <HourlyChart data={data.hourly_pattern||[]} />
            </div>
          </>}
          {activeSection==='sales' && <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <WeekdayChart data={data.weekday_revenue||[]} />
              <DiscountChart data={data.discount_impact||[]} />
            </div>
            <StateTable data={data.state_sales||[]} />
          </>}
          {activeSection==='products' && <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <TopProducts data={data.top_products||[]} />
              <CategoryChart data={data.category_performance||[]} tall />
            </div>
          </>}
          {activeSection==='customers' && <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <ReviewChart data={data.review_distribution||[]} />
              <PaymentChart data={data.payment_distribution||[]} />
            </div>
            <WeekdayChart data={data.weekday_revenue||[]} />
          </>}
          {activeSection==='upload' && <CSVUpload onData={handleNewData} />}
          {activeSection==='manual' && <ManualEntry onData={handleNewData} />}
        </div>
      </main>
    </div>
  )
}
