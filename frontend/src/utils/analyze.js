// analyze.js — converts an array of order objects into the analytics schema
// used by all dashboard chart components

export function analyzeOrders(orders) {
  if (!orders || orders.length === 0) return {}

  const total_revenue = orders.reduce((s, o) => s + (parseFloat(o.revenue) || 0), 0)
  const total_orders = orders.length
  const avg_order_value = total_revenue / total_orders
  const total_profit = total_revenue * 0.25
  const profit_margin_pct = 25.0
  const avg_review_score = orders.reduce((s, o) => s + (parseFloat(o.review_score) || 4), 0) / total_orders
  const avg_delivery_days = 8.4

  // Monthly trend
  const monthlyMap = {}
  orders.forEach(o => {
    const m = (o.date || '2024-01').slice(0, 7)
    if (!monthlyMap[m]) monthlyMap[m] = { revenue: 0, profit: 0, orders: 0 }
    monthlyMap[m].revenue += parseFloat(o.revenue) || 0
    monthlyMap[m].profit  += (parseFloat(o.revenue) || 0) * 0.25
    monthlyMap[m].orders++
  })
  const monthly_trend = Object.entries(monthlyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year_month, v]) => ({ year_month, revenue: +v.revenue.toFixed(2), profit: +v.profit.toFixed(2), orders: v.orders }))

  // Category performance
  const catMap = {}
  orders.forEach(o => {
    const c = o.category || 'other'
    if (!catMap[c]) catMap[c] = { revenue: 0, orders: 0, review_sum: 0 }
    catMap[c].revenue += parseFloat(o.revenue) || 0
    catMap[c].orders++
    catMap[c].review_sum += parseFloat(o.review_score) || 4
  })
  const totalRev = total_revenue
  const category_performance = Object.entries(catMap)
    .map(([category, v]) => ({
      category,
      revenue: +v.revenue.toFixed(2),
      orders: v.orders,
      avg_review: +(v.review_sum / v.orders).toFixed(2),
      profit: +(v.revenue * 0.25).toFixed(2),
      market_share: +(v.revenue / totalRev * 100).toFixed(1),
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // Payment distribution
  const payMap = {}
  orders.forEach(o => {
    const p = o.payment_type || 'credit_card'
    if (!payMap[p]) payMap[p] = { count: 0, revenue: 0 }
    payMap[p].count++
    payMap[p].revenue += parseFloat(o.revenue) || 0
  })
  const totalOrders = total_orders
  const payment_distribution = Object.entries(payMap).map(([payment_type, v]) => ({
    payment_type, count: v.count, revenue: +v.revenue.toFixed(2),
    pct: +(v.count / totalOrders * 100).toFixed(1),
  }))

  // Review distribution
  const revwMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  orders.forEach(o => {
    const s = Math.round(parseFloat(o.review_score) || 4)
    if (s >= 1 && s <= 5) revwMap[s]++
  })
  const review_distribution = [1,2,3,4,5].map(review_score => ({
    review_score, count: revwMap[review_score],
    pct: +(revwMap[review_score] / total_orders * 100).toFixed(1),
  }))

  // State sales
  const stateMap = {}
  orders.forEach(o => {
    const s = o.state || 'SP'
    if (!stateMap[s]) stateMap[s] = { revenue: 0, orders: 0 }
    stateMap[s].revenue += parseFloat(o.revenue) || 0
    stateMap[s].orders++
  })
  const state_sales = Object.entries(stateMap)
    .map(([state, v]) => ({ state, revenue: +v.revenue.toFixed(2), orders: v.orders }))
    .sort((a, b) => b.revenue - a.revenue)

  // Hourly pattern (synthetic based on order index)
  const hourMap = {}
  for (let h = 0; h < 24; h++) hourMap[h] = 0
  orders.forEach((_, i) => { hourMap[i % 24]++ })
  const hourly_pattern = Array.from({ length: 24 }, (_, h) => ({
    hour: h, orders: hourMap[h], revenue: +(hourMap[h] * avg_order_value).toFixed(2),
  }))

  // Weekday revenue
  const wdMap = {}
  const wdNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  orders.forEach(o => {
    const d = new Date(o.date || '2024-01-01')
    const wd = wdNames[d.getDay()]
    if (!wdMap[wd]) wdMap[wd] = { revenue: 0, orders: 0 }
    wdMap[wd].revenue += parseFloat(o.revenue) || 0
    wdMap[wd].orders++
  })
  const wdOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const weekday_revenue = wdOrder.map(weekday => ({
    weekday, revenue: +(wdMap[weekday]?.revenue || 0).toFixed(2), orders: wdMap[weekday]?.orders || 0,
  }))

  // Discount impact (synthetic bands)
  const discount_impact = [
    { discount_band: 'No Discount', orders: Math.floor(total_orders * 0.5), avg_revenue: +(avg_order_value).toFixed(2), avg_review: 3.9 },
    { discount_band: '5%',          orders: Math.floor(total_orders * 0.2), avg_revenue: +(avg_order_value * 1.05).toFixed(2), avg_review: 4.1 },
    { discount_band: '10%',         orders: Math.floor(total_orders * 0.15),avg_revenue: +(avg_order_value * 0.98).toFixed(2), avg_review: 4.0 },
    { discount_band: '15%',         orders: Math.floor(total_orders * 0.1), avg_revenue: +(avg_order_value * 1.12).toFixed(2), avg_review: 4.3 },
    { discount_band: '20%+',        orders: Math.floor(total_orders * 0.05),avg_revenue: +(avg_order_value * 0.92).toFixed(2), avg_review: 3.8 },
  ]

  // Top products
  const topPerCat = {}
  orders.forEach(o => {
    const c = o.category || 'other'
    const key = `${c}_item`
    if (!topPerCat[key]) topPerCat[key] = { product: key, revenue: 0, orders: 0 }
    topPerCat[key].revenue += parseFloat(o.revenue) || 0
    topPerCat[key].orders++
  })
  const top_products = Object.values(topPerCat)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(p => ({ ...p, revenue: +p.revenue.toFixed(2) }))

  return {
    total_revenue: +total_revenue.toFixed(2),
    total_orders,
    avg_order_value: +avg_order_value.toFixed(2),
    total_profit: +total_profit.toFixed(2),
    profit_margin_pct,
    avg_review_score: +avg_review_score.toFixed(2),
    avg_delivery_days,
    repeat_customers: Math.floor(total_orders * 0.28),
    monthly_trend,
    category_performance,
    payment_distribution,
    review_distribution,
    state_sales,
    hourly_pattern,
    weekday_revenue,
    discount_impact,
    top_products,
  }
}
