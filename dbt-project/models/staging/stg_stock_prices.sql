-- Staging model for raw stock prices
-- This view cleans and standardizes raw stock price data

{{ config(
    materialized='view',
    tags=['staging', 'stock_prices']
) }}

with source_data as (
    select
        symbol,
        date,
        open,
        high,
        low,
        close,
        volume,
        adjusted_close,
        _loaded_at
    from {{ source('raw', 'stock_prices') }}
),

cleaned_data as (
    select
        upper(trim(symbol)) as symbol,
        cast(date as date) as price_date,
        cast(open as numeric(18, 2)) as open_price,
        cast(high as numeric(18, 2)) as high_price,
        cast(low as numeric(18, 2)) as low_price,
        cast(close as numeric(18, 2)) as close_price,
        cast(volume as bigint) as volume,
        cast(adjusted_close as numeric(18, 2)) as adjusted_close_price,
        _loaded_at as loaded_at
    from source_data
    where symbol is not null
        and date is not null
        and close > 0
        and volume > 0
)

select * from cleaned_data
