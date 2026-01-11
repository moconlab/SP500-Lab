-- Financial metrics calculation
-- Computes key financial ratios and metrics for each stock

{{ config(
    materialized='table',
    tags=['marts', 'finance', 'metrics']
) }}

with latest_fundamentals as (
    select
        symbol,
        report_date,
        revenue,
        gross_profit,
        operating_income,
        net_income,
        total_assets,
        total_liabilities,
        total_equity,
        current_assets,
        current_liabilities,
        long_term_debt,
        free_cash_flow,
        shares_outstanding,
        row_number() over (partition by symbol order by report_date desc) as rn
    from {{ ref('stg_fundamentals') }}
),

current_fundamentals as (
    select * from latest_fundamentals where rn = 1
),

previous_fundamentals as (
    select * from latest_fundamentals where rn = 2
),

latest_prices as (
    select
        symbol,
        close_price as current_price,
        row_number() over (partition by symbol order by price_date desc) as rn
    from {{ ref('stg_stock_prices') }}
),

current_prices as (
    select symbol, current_price
    from latest_prices
    where rn = 1
),

metrics as (
    select
        c.symbol,
        c.report_date,
        
        -- Price metrics
        p.current_price,
        c.shares_outstanding,
        p.current_price * c.shares_outstanding as market_cap,
        
        -- Profitability ratios
        case when c.total_equity > 0 then (c.net_income / c.total_equity) * 100 else null end as roe,
        case when c.total_assets > 0 then (c.net_income / c.total_assets) * 100 else null end as roa,
        case when c.revenue > 0 then (c.gross_profit / c.revenue) * 100 else null end as gross_margin,
        case when c.revenue > 0 then (c.operating_income / c.revenue) * 100 else null end as operating_margin,
        case when c.revenue > 0 then (c.net_income / c.revenue) * 100 else null end as net_margin,
        
        -- Valuation ratios
        case when c.net_income > 0 then (p.current_price * c.shares_outstanding) / c.net_income else null end as pe_ratio,
        case when c.total_equity > 0 then (p.current_price * c.shares_outstanding) / c.total_equity else null end as pb_ratio,
        
        -- Financial health ratios
        case when c.total_equity > 0 then c.total_liabilities / c.total_equity else null end as debt_to_equity,
        case when c.current_liabilities > 0 then c.current_assets / c.current_liabilities else null end as current_ratio,
        case when c.current_liabilities > 0 then (c.current_assets - c.current_assets * 0.3) / c.current_liabilities else null end as quick_ratio,
        
        -- Growth metrics
        case 
            when pr.revenue > 0 then ((c.revenue - pr.revenue) / pr.revenue) * 100 
            else null 
        end as revenue_growth,
        case 
            when pr.net_income > 0 then ((c.net_income - pr.net_income) / pr.net_income) * 100 
            else null 
        end as earnings_growth,
        
        -- Cash flow metrics
        c.free_cash_flow,
        case when c.revenue > 0 then (c.free_cash_flow / c.revenue) * 100 else null end as fcf_margin,
        
        current_timestamp() as calculated_at
        
    from current_fundamentals c
    left join previous_fundamentals pr on c.symbol = pr.symbol
    left join current_prices p on c.symbol = p.symbol
)

select * from metrics
