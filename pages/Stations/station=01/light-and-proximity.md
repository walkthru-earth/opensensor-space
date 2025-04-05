---
title: Light and Proximity
---
<LastRefreshed/>

<Details title='About this dashboard'>
  This dashboard analyzes light (Lux) and proximity sensor readings from My DIY weather station. You can select a date range to view specific data.
</Details>

```sql date_range_data
select 
  (min(timestamp)) as min_date,
  (max(timestamp)) as max_date
from station_01
```

<DateRange
  name=date_filter
  data={date_range_data}
  dates=min_date
  end={date_range_data[0].max_date}
  title="Select Date Range"
  presetRanges={['Last 7 Days', 'Last 30 Days', 'Month to Date', 'Year to Date', 'All Time']}
  defaultValue={'Last 7 Days'}
/>

## Light and Proximity Summary

```sql main_data
-- Get the base light and proximity data we need
select
  timestamp,
  lux,
  proximity
from station_01
where timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
```

```sql summary_stats
select
  round(min(lux), 1) as min_lux,
  round(max(lux), 1) as max_lux,
  round(avg(lux), 1) as avg_lux,
  round(min(proximity), 1) as min_proximity,
  round(max(proximity), 1) as max_proximity,
  round(avg(proximity), 1) as avg_proximity,
  min_lux || ' - ' || max_lux || ' lux' as lux_range,
  'Avg: ' || avg_lux || ' lux' as lux_avg,
  min_proximity || ' - ' || max_proximity as proximity_range,
  'Avg: ' || avg_proximity as proximity_avg,
  CASE
    WHEN avg_lux < 50 THEN 'bg-gray-50'
    WHEN avg_lux < 500 THEN 'bg-yellow-50'
    WHEN avg_lux < 1000 THEN 'bg-orange-50'
    ELSE 'bg-amber-50'
  END as lux_bg_color,
  CASE
    WHEN avg_proximity < 10 THEN 'bg-green-50'
    WHEN avg_proximity < 50 THEN 'bg-blue-50'
    ELSE 'bg-purple-50'
  END as proximity_bg_color
from ${main_data}
```

<Grid numCols={2}>
  <BigValue 
    data={summary_stats} 
    value=lux_range
    title="Light Range" 
    subtitle=lux_avg
    backgroundColor=lux_bg_color
  />
  <BigValue 
    data={summary_stats} 
    value=proximity_range
    title="Proximity Range" 
    subtitle=proximity_avg
    backgroundColor=proximity_bg_color
  />
</Grid>

<Details title="Understanding Light and Proximity Readings">
  - **Lux**: Measures the intensity of light as perceived by the human eye. One lux equals one lumen per square meter.
  - **Proximity**: Raw proximity sensor value - lower values generally indicate objects are closer to the sensor.
  
  ### Light Levels Reference
  - &lt;10 lux: Very dark (moonlight)
  - 10-50 lux: Dark indoor lighting
  - 100-500 lux: Normal indoor lighting
  - 1,000+ lux: Daylight
  - 10,000+ lux: Direct sunlight
</Details>

## Hourly Patterns

```sql hourly_patterns
-- Calculate hourly patterns throughout the day
SELECT
  extract('hour' from timestamp) as hour_of_day,
  round(avg(lux), 1) as avg_lux,
  round(avg(proximity), 1) as avg_proximity
FROM station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date
  AND timestamp::date <= '${inputs.date_filter.end}'::date
GROUP BY hour_of_day
ORDER BY hour_of_day
```

```sql hourly_patterns_stacked
-- Format data for the line chart with series
SELECT
  hour_of_day,
  avg_lux as value,
  'Light (lux)' as sensor_type
FROM ${hourly_patterns}

UNION ALL

SELECT
  hour_of_day,
  avg_proximity as value,
  'Proximity' as sensor_type
FROM ${hourly_patterns}
ORDER BY hour_of_day, sensor_type
```

<LineChart
  data={hourly_patterns_stacked}
  x=hour_of_day
  y=value
  series=sensor_type
  title="Average Hourly Light and Proximity Patterns"
  subtitle="How sensor readings change throughout the day"
  chartAreaHeight=250
  lineWidth=3
  markers=true
  markerSize=5
  colors={["#f59e0b", "#6366f1"]}
  xFmt="0"
  echartsOptions={{
      dataZoom: {
          show: true,
          bottom: 10
      },
      grid: {
          bottom: 50
      }
  }}
>
</LineChart>

<Details title='About Hourly Patterns'>
    
    This chart shows the average sensor readings for each hour of the day, calculated from all data within your selected date range. 
    
    - It always shows hours 0-23 to reveal the daily light cycle pattern
    - Values are averaged across all days in your selected period  
    - Use the zoom control at the bottom to focus on specific hours
    - The natural light pattern typically shows:
      - Lowest values during night hours (0-5, 20-23)
      - Rising values during morning (6-11)
      - Peak values during midday (11-15)
      - Declining values in evening (16-19)
    
    Proximity sensor values may show different patterns based on its placement and what it's detecting.

</Details>

## Time Series Analysis

```sql time_series_data
-- Format data for the time series chart (30-minute intervals)
WITH time_buckets AS (
  SELECT 
    timestamp,
    -- Create 30-minute buckets by flooring to the hour and adding 0 or 30 minutes
    CASE 
      WHEN EXTRACT(MINUTE FROM timestamp) < 30 
      THEN date_trunc('hour', timestamp)
      ELSE date_trunc('hour', timestamp) + INTERVAL '30 minutes'
    END AS half_hour_timestamp,
    lux,
    proximity
  FROM ${main_data}
)

SELECT
  half_hour_timestamp,
  round(avg(lux), 1) as value,
  'Light (lux)' as sensor_type
FROM time_buckets
GROUP BY half_hour_timestamp

UNION ALL

SELECT
  half_hour_timestamp,
  round(avg(proximity), 1) as value,
  'Proximity' as sensor_type
FROM time_buckets
GROUP BY half_hour_timestamp
ORDER BY half_hour_timestamp, sensor_type
```

```sql lux_extremes
select
  timestamp,
  lux,
  case
    when lux = (select max(lux) from ${main_data})
    then 'Brightest: ' || round(lux, 1) || ' Lux'
    when lux = (select min(lux) from ${main_data})
    then 'Darkest: ' || round(lux, 1) || ' Lux'
  end as label
from ${main_data}
where lux = (select max(lux) from ${main_data})
   or lux = (select min(lux) from ${main_data})
```

<LineChart
  data={time_series_data}
  x=half_hour_timestamp
  y=value
  series=sensor_type
  title="Light and Proximity Readings Over Time"
  subtitle="Average values in 30-minute buckets for smoother visualization"
  chartAreaHeight=250
  lineWidth=3
  colors={["#f59e0b", "#6366f1"]}
  xFmt="MMM dd, HH:mm"
  echartsOptions={{
      dataZoom: {
          show: true,
          bottom: 10
      },
      grid: {
          bottom: 50
      }
  }}
>
</LineChart>

<Details title='About This Chart'>
    
    This chart shows light and proximity readings averaged in 30-minute intervals, providing a smoother view of trends over time.
    
    - Each point represents the average of all readings within a 30-minute period
    - Light levels (lux) show natural daily cycles with sunrise and sunset
    - Proximity values indicate object detection near the sensor
    
    Use the zoom control at the bottom to focus on specific time periods of interest.

</Details>
