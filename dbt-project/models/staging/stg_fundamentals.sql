-- Staging model for company fundamentals
-- This view cleans and standardizes raw fundamental data

{{ config(
    materialized='view',
    tags=['staging', 'fundamentals']
) }}

with source_data as (
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
        cash_and_equivalents,
        current_assets,
        current_liabilities,
        long_term_debt,
        free_cash_flow,
        shares_outstanding,
        _loaded_at
    from {{ source('raw', 'fundamentals') }}
),

cleaned_data as (
    select
        upper(trim(symbol)) as symbol,
        cast(report_date as date) as report_date,
        cast(revenue as numeric(18, 2)) as revenue,
        cast(gross_profit as numeric(18, 2)) as gross_profit,
        cast(operating_income as numeric(18, 2)) as operating_income,
        cast(net_income as numeric(18, 2)) as net_income,
        cast(total_assets as numeric(18, 2)) as total_assets,
        cast(total_liabilities as numeric(18, 2)) as total_liabilities,
        cast(total_equity as numeric(18, 2)) as total_equity,
        cast(cash_and_equivalents as numeric(18, 2)) as cash_and_equivalents,
        cast(current_assets as numeric(18, 2)) as current_assets,
        cast(current_liabilities as numeric(18, 2)) as current_liabilities,
        cast(long_term_debt as numeric(18, 2)) as long_term_debt,
        cast(free_cash_flow as numeric(18, 2)) as free_cash_flow,
        cast(shares_outstanding as bigint) as shares_outstanding,
        _loaded_at as loaded_at
    from source_data
    where symbol is not null
        and report_date is not null
)

select * from cleaned_data
