"""
E-Commerce Sales Analytics — Data Analysis Pipeline
Dataset: Brazilian E-Commerce Public Dataset by Olist (Kaggle)
https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

Run: pip install pandas numpy matplotlib seaborn scikit-learn
     python analyze.py
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime

# ── 1. SYNTHETIC DATA GENERATOR (mirrors Olist schema) ──────────────────────
# In a real project, replace this with:
#   df = pd.read_csv("olist_orders_dataset.csv")
# and merge with olist_order_items_dataset.csv, olist_products_dataset.csv, etc.

np.random.seed(42)
N = 5000

categories = [
    "electronics", "fashion", "home_appliances", "beauty", "sports",
    "books", "toys", "food", "furniture", "auto_parts"
]
states = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "PE", "CE"]
payment_types = ["credit_card", "boleto", "voucher", "debit_card"]

dates = pd.date_range("2022-01-01", "2023-12-31", periods=N)
revenue = np.random.lognormal(mean=4.5, sigma=0.8, size=N).clip(10, 5000)
quantity = np.random.randint(1, 8, size=N)
discount = np.random.choice([0, 0.05, 0.10, 0.15, 0.20], size=N,
                             p=[0.5, 0.2, 0.15, 0.1, 0.05])
review_scores = np.random.choice([1, 2, 3, 4, 5], size=N,
                                  p=[0.05, 0.08, 0.15, 0.32, 0.40])

raw_df = pd.DataFrame({
    "order_id":        [f"ORD{i:06d}" for i in range(N)],
    "order_date":      dates,
    "category":        np.random.choice(categories, N),
    "state":           np.random.choice(states, N),
    "payment_type":    np.random.choice(payment_types, N,
                                         p=[0.65, 0.20, 0.10, 0.05]),
    "price":           revenue.round(2),
    "quantity":        quantity,
    "discount_pct":    discount,
    "review_score":    review_scores,
    "freight_value":   np.random.uniform(5, 80, N).round(2),
    "delivery_days":   np.random.randint(1, 30, N),
})

raw_df["revenue"]     = (raw_df["price"] * raw_df["quantity"] *
                          (1 - raw_df["discount_pct"])).round(2)
raw_df["profit"]      = (raw_df["revenue"] * np.random.uniform(0.10, 0.40, N)).round(2)
raw_df["year_month"]  = raw_df["order_date"].dt.to_period("M").astype(str)
raw_df["weekday"]     = raw_df["order_date"].dt.day_name()
raw_df["hour"]        = np.random.randint(0, 24, N)


# ── 2. KPI SUMMARY ───────────────────────────────────────────────────────────
def compute_kpis(df):
    total_rev    = df["revenue"].sum()
    total_orders = len(df)
    avg_order    = df["revenue"].mean()
    total_profit = df["profit"].sum()
    profit_margin = (total_profit / total_rev * 100)
    avg_review   = df["review_score"].mean()
    avg_delivery = df["delivery_days"].mean()
    repeat_customers = int(total_orders * 0.28)   # simulated
    return {
        "total_revenue":    round(total_rev, 2),
        "total_orders":     total_orders,
        "avg_order_value":  round(avg_order, 2),
        "total_profit":     round(total_profit, 2),
        "profit_margin_pct":round(profit_margin, 2),
        "avg_review_score": round(avg_review, 2),
        "avg_delivery_days":round(avg_delivery, 1),
        "repeat_customers": repeat_customers,
    }


# ── 3. MONTHLY REVENUE TREND ─────────────────────────────────────────────────
def monthly_trend(df):
    m = (df.groupby("year_month")
           .agg(revenue=("revenue", "sum"),
                orders=("order_id", "count"),
                profit=("profit", "sum"))
           .reset_index()
           .sort_values("year_month"))
    m["revenue"] = m["revenue"].round(2)
    m["profit"]  = m["profit"].round(2)
    return m.to_dict(orient="records")


# ── 4. CATEGORY PERFORMANCE ──────────────────────────────────────────────────
def category_performance(df):
    c = (df.groupby("category")
           .agg(revenue=("revenue", "sum"),
                orders=("order_id", "count"),
                avg_review=("review_score", "mean"),
                profit=("profit", "sum"))
           .reset_index()
           .sort_values("revenue", ascending=False))
    c["revenue"]    = c["revenue"].round(2)
    c["profit"]     = c["profit"].round(2)
    c["avg_review"] = c["avg_review"].round(2)
    c["market_share"] = (c["revenue"] / c["revenue"].sum() * 100).round(1)
    return c.to_dict(orient="records")


# ── 5. GEO — STATE WISE SALES ────────────────────────────────────────────────
def state_sales(df):
    s = (df.groupby("state")
           .agg(revenue=("revenue", "sum"),
                orders=("order_id", "count"))
           .reset_index()
           .sort_values("revenue", ascending=False))
    s["revenue"] = s["revenue"].round(2)
    return s.to_dict(orient="records")


# ── 6. PAYMENT DISTRIBUTION ──────────────────────────────────────────────────
def payment_distribution(df):
    p = (df.groupby("payment_type")
           .agg(count=("order_id", "count"),
                revenue=("revenue", "sum"))
           .reset_index())
    p["revenue"] = p["revenue"].round(2)
    p["pct"]     = (p["count"] / p["count"].sum() * 100).round(1)
    return p.to_dict(orient="records")


# ── 7. REVIEW SCORE DISTRIBUTION ─────────────────────────────────────────────
def review_distribution(df):
    r = (df.groupby("review_score")
           .agg(count=("order_id", "count"))
           .reset_index())
    r["pct"] = (r["count"] / r["count"].sum() * 100).round(1)
    return r.to_dict(orient="records")


# ── 8. HOURLY ORDER PATTERN ──────────────────────────────────────────────────
def hourly_pattern(df):
    h = (df.groupby("hour")
           .agg(orders=("order_id", "count"),
                revenue=("revenue", "sum"))
           .reset_index()
           .sort_values("hour"))
    h["revenue"] = h["revenue"].round(2)
    return h.to_dict(orient="records")


# ── 9. TOP PRODUCTS (simulated) ───────────────────────────────────────────────
def top_products(df, n=10):
    cat_df = df.copy()
    cat_df["product"] = cat_df["category"] + "_item_" + (
        np.random.randint(1, 20, len(cat_df)).astype(str))
    p = (cat_df.groupby("product")
               .agg(revenue=("revenue", "sum"),
                    orders=("order_id", "count"))
               .reset_index()
               .sort_values("revenue", ascending=False)
               .head(n))
    p["revenue"] = p["revenue"].round(2)
    return p.to_dict(orient="records")


# ── 10. COHORT / WEEKDAY HEATMAP ─────────────────────────────────────────────
def weekday_revenue(df):
    order = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    w = (df.groupby("weekday")
           .agg(revenue=("revenue", "sum"),
                orders=("order_id", "count"))
           .reindex(order)
           .reset_index())
    w["revenue"] = w["revenue"].round(2)
    return w.to_dict(orient="records")


# ── 11. DISCOUNT IMPACT ───────────────────────────────────────────────────────
def discount_impact(df):
    df2 = df.copy()
    df2["discount_band"] = pd.cut(
        df2["discount_pct"],
        bins=[-0.01, 0, 0.05, 0.10, 0.15, 0.25],
        labels=["No Discount", "5%", "10%", "15%", "20%+"]
    )
    d = (df2.groupby("discount_band", observed=True)
            .agg(orders=("order_id", "count"),
                 avg_revenue=("revenue", "mean"),
                 avg_review=("review_score", "mean"))
            .reset_index())
    d["avg_revenue"] = d["avg_revenue"].round(2)
    d["avg_review"]  = d["avg_review"].round(2)
    return d.to_dict(orient="records")


# ── MAIN ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("🔍  Running E-Commerce Sales Analytics Pipeline...")

    output = {
        "generated_at":        datetime.now().isoformat(),
        "kpis":                compute_kpis(raw_df),
        "monthly_trend":       monthly_trend(raw_df),
        "category_performance":category_performance(raw_df),
        "state_sales":         state_sales(raw_df),
        "payment_distribution":payment_distribution(raw_df),
        "review_distribution": review_distribution(raw_df),
        "hourly_pattern":      hourly_pattern(raw_df),
        "top_products":        top_products(raw_df),
        "weekday_revenue":     weekday_revenue(raw_df),
        "discount_impact":     discount_impact(raw_df),
    }

    out_path = os.path.join(os.path.dirname(__file__), "..", "dashboard", "src", "data", "analytics.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"✅  analytics.json written → {os.path.abspath(out_path)}")
    print(f"\n📊  Quick Stats:")
    kpis = output["kpis"]
    print(f"    Total Revenue  : ${kpis['total_revenue']:,.2f}")
    print(f"    Total Orders   : {kpis['total_orders']:,}")
    print(f"    Avg Order Value: ${kpis['avg_order_value']:.2f}")
    print(f"    Profit Margin  : {kpis['profit_margin_pct']}%")
    print(f"    Avg Review     : {kpis['avg_review_score']} / 5")
