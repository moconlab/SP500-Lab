-- ML Features for stock recommendation model
-- Computes features for machine learning model training

{{ config(
    materialized='table',
    tags=['marts', 'features', 'ml']
) }}

with financial_metrics as (
    select * from {{ ref('financial_metrics') }}
),

price_momentum as (
    select
        symbol,
        close_price,
        lag(close_price, 5) over (partition by symbol order by price_date) as price_5d_ago,
        lag(close_price, 20) over (partition by symbol order by price_date) as price_20d_ago,
        lag(close_price, 60) over (partition by symbol order by price_date) as price_60d_ago,
        avg(close_price) over (partition by symbol order by price_date rows between 20 preceding and current row) as sma_20,
        avg(close_price) over (partition by symbol order by price_date rows between 50 preceding and current row) as sma_50,
        avg(volume) over (partition by symbol order by price_date rows between 20 preceding and current row) as avg_volume_20,
        stddev(close_price) over (partition by symbol order by price_date rows between 20 preceding and current row) as volatility_20,
        row_number() over (partition by symbol order by price_date desc) as rn
    from {{ ref('stg_stock_prices') }}
),

latest_momentum as (
    select
        symbol,
        close_price as current_price,
        case when price_5d_ago > 0 then ((close_price - price_5d_ago) / price_5d_ago) * 100 else null end as return_5d,
        case when price_20d_ago > 0 then ((close_price - price_20d_ago) / price_20d_ago) * 100 else null end as return_20d,
        case when price_60d_ago > 0 then ((close_price - price_60d_ago) / price_60d_ago) * 100 else null end as return_60d,
        sma_20,
        sma_50,
        case when sma_20 > 0 then (close_price / sma_20 - 1) * 100 else null end as price_vs_sma20,
        case when sma_50 > 0 then (close_price / sma_50 - 1) * 100 else null end as price_vs_sma50,
        avg_volume_20,
        volatility_20
    from price_momentum
    where rn = 1
),

features as (
    select
        fm.symbol,
        
        -- Financial features (normalized)
        fm.roe,
        fm.roa,
        fm.gross_margin,
        fm.operating_margin,
        fm.net_margin,
        fm.pe_ratio,
        fm.pb_ratio,
        fm.debt_to_equity,
        fm.current_ratio,
        fm.quick_ratio,
        fm.revenue_growth,
        fm.earnings_growth,
        fm.fcf_margin,
        
        -- Momentum features
        m.return_5d,
        m.return_20d,
        m.return_60d,
        m.price_vs_sma20,
        m.price_vs_sma50,
        m.volatility_20,
        
        -- Composite scores
        case
            when fm.roe > 20 and fm.roa > 10 then 1
            when fm.roe > 15 and fm.roa > 7 then 0.7
            when fm.roe > 10 and fm.roa > 5 then 0.5
            else 0.3
        end as profitability_score,
        
        case
            when fm.revenue_growth > 15 and fm.earnings_growth > 15 then 1
            when fm.revenue_growth > 10 and fm.earnings_growth > 10 then 0.7
            when fm.revenue_growth > 5 and fm.earnings_growth > 5 then 0.5
            else 0.3
        end as growth_score,
        
        case
            when fm.debt_to_equity < 0.5 and fm.current_ratio > 1.5 then 1
            when fm.debt_to_equity < 1.0 and fm.current_ratio > 1.2 then 0.7
            when fm.debt_to_equity < 2.0 and fm.current_ratio > 1.0 then 0.5
            else 0.3
        end as financial_health_score,
        
        case
            when fm.pe_ratio < 20 and fm.pb_ratio < 3 then 1
            when fm.pe_ratio < 30 and fm.pb_ratio < 5 then 0.7
            when fm.pe_ratio < 50 and fm.pb_ratio < 10 then 0.5
            else 0.3
        end as valuation_score,
        
        current_timestamp() as feature_generated_at
        
    from financial_metrics fm
    left join latest_momentum m on fm.symbol = m.symbol
)

select * from features
