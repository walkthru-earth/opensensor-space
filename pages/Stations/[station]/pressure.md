---
title: Atmospheric Pressure
---

```sql station_info
SELECT * FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - Atmospheric Pressure

<LastRefreshed/>

<Details title='About this dashboard'>

This dashboard analyzes atmospheric pressure data from **{station_info[0].station_name}**. You can select a date range to view specific data.

- **Location**: {station_info[0].latitude}, {station_info[0].longitude}
- **Sensor Type**: {station_info[0].sensor_type}
- **Environment**: {station_info[0].station_type}

</Details>

```sql date_range_data
select
  strftime(min(timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp))::TIMESTAMP, '%Y-%m-%d') as min_date,
  strftime(max(timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp))::TIMESTAMP, '%Y-%m-%d') as max_date
from all_stations
where station_id = '${params.station}'
```

<DateRange
  name=date_filter
  data={date_range_data}
  dates=min_date
  end={date_range_data[0].max_date}
  title="Select Date Range"
  presetRanges={['Last 7 Days', 'Last 30 Days', 'Month to Date', 'Year to Date', 'All Time']}
  defaultValue={'All Time'}
/>

## Pressure Summary

```sql main_data
-- Get the base pressure data we need
select
  timestamp,
  pressure
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date
```

```sql summary_stats
select
  round(min(pressure), 1) as min_pressure,
  round(max(pressure), 1) as max_pressure,
  round(avg(pressure), 1) as avg_pressure,
  min_pressure || ' - ' || max_pressure || ' hPa' as pressure_range,
  'Avg: ' || avg_pressure || ' hPa' as pressure_avg,
  CASE
    WHEN avg_pressure < 1000 THEN 'bg-blue-50'
    WHEN avg_pressure > 1025 THEN 'bg-orange-50'
    ELSE 'bg-green-50'
  END as pressure_bg_color
from ${main_data}
```

<BigValue
  data={summary_stats}
  value=pressure_range
  title="Pressure Range"
  subtitle=pressure_avg
  backgroundColor=pressure_bg_color
/>

<Details title="Understanding Atmospheric Pressure">

- **Atmospheric Pressure** is the force exerted by the weight of air in the atmosphere.
- Measured in hectopascals (hPa), where 1 hPa = 100 Pascals.
- Standard sea level pressure is 1013.25 hPa.

### Pressure Ranges
- Below 1000 hPa: Low pressure (often associated with storms, rain)
- 1000-1025 hPa: Normal pressure range
- Above 1025 hPa: High pressure (typically clear, stable weather)

Changes in pressure can help forecast weather - falling pressure often indicates approaching storms, while rising pressure suggests improving conditions.

</Details>

## Hourly Pressure Patterns

```sql hourly_patterns
-- Calculate hourly patterns throughout the day
SELECT
  extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour_of_day,
  round(avg(pressure), 1) as avg_pressure
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date
GROUP BY hour_of_day
ORDER BY hour_of_day
```

<LineChart
  data={hourly_patterns}
  x=hour_of_day
  y=avg_pressure
  title="Average Hourly Pressure Pattern"
  subtitle="How atmospheric pressure changes throughout the day"
  yAxisTitle="Pressure (hPa)"
  chartAreaHeight=250
  lineWidth=3
  markers=true
  markerSize=5
  color="#3b82f6"
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
  <ReferenceLine y={1013.25} label="Standard Sea Level Pressure" color="neutral" lineType="dashed"/>
</LineChart>

<Details title='About Pressure Patterns'>

This chart shows the average pressure readings for each hour of the day, calculated from all data within your selected date range.

- It shows hours 0-23 to reveal any daily pressure cycle patterns
- Values are averaged across all days in your selected period
- Use the zoom control at the bottom to focus on specific hours
- Pressure often follows a semi-diurnal pattern with two daily maximums (around 10 AM and 10 PM) and two daily minimums (around 4 AM and 4 PM), known as the atmospheric tide

The reference line at 1013.25 hPa shows standard sea level pressure.

</Details>

## Pressure Time Series

```sql time_series_data
-- Format data for the time series chart (30-minute intervals)
WITH time_buckets AS (
  SELECT
    timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp) as timestamp,
    -- Create 30-minute buckets by flooring to the hour and adding 0 or 30 minutes
    CASE
      WHEN EXTRACT(MINUTE FROM timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) < 30
      THEN date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp))
      ELSE date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) + INTERVAL '30 minutes'
    END AS half_hour_timestamp,
    pressure
  FROM ${main_data}
)

SELECT
  half_hour_timestamp,
  round(avg(pressure), 1) as avg_pressure
FROM time_buckets
GROUP BY half_hour_timestamp
ORDER BY half_hour_timestamp
```

```sql pressure_extremes
select
  timestamp,
  pressure,
  case
    when pressure = (select max(pressure) from ${main_data})
    then 'Highest: ' || round(pressure, 1) || ' hPa'
    when pressure = (select min(pressure) from ${main_data})
    then 'Lowest: ' || round(pressure, 1) || ' hPa'
  end as label
from ${main_data}
where pressure = (select max(pressure) from ${main_data})
   or pressure = (select min(pressure) from ${main_data})
```

<LineChart
  data={time_series_data}
  x=half_hour_timestamp
  y=avg_pressure
  yAxisTitle="Pressure (hPa)"
  title="Atmospheric Pressure Over Time (30-min intervals)"
  subtitle="Average values in 30-minute buckets for smoother visualization"
  lineWidth=2
  chartAreaHeight=250
  color="#3b82f6"
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
  <ReferenceLine y={1013.25} label="Standard Pressure" color="neutral" lineType="dashed"/>
</LineChart>

<Details title='About This Chart'>

This chart shows atmospheric pressure averaged in 30-minute intervals, providing a smoother view of pressure trends over time.

- Each point represents the average of all readings within a 30-minute period
- The reference line shows standard sea level pressure (1013.25 hPa)
- Rising pressure generally indicates improving weather
- Falling pressure often signals deteriorating weather conditions

Use the zoom control at the bottom to focus on specific time periods of interest.

</Details>

## Daily Calendar View

```sql daily_pressure_for_calendar
-- Get daily average pressure values for the calendar heatmap
SELECT
  strftime(date_trunc('day', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)), '%Y-%m-%d') as day,
  round(avg(pressure), 1) as avg_pressure
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date
  AND pressure IS NOT NULL
GROUP BY day
ORDER BY day
```

### Daily Atmospheric Pressure

<CalendarHeatmap
  data={daily_pressure_for_calendar}
  date=day
  value=avg_pressure
  title="Daily Atmospheric Pressure"
  subtitle="Calendar view showing daily average atmospheric pressure (hPa)"
  colorScale={[
    ["rgb(0, 0, 255)", "rgb(173, 216, 230)"],
    ["rgb(173, 255, 47)", "rgb(144, 238, 144)"],
    ["rgb(255, 165, 0)", "rgb(255, 0, 0)"]
  ]}
  min=990
  max=1040
  valueFmt="0.0"
/>

<Details title='About Pressure Calendar Heatmap'>

This calendar visualization shows daily average atmospheric pressure in hectopascals (hPa):

**Color Scale:**
- Blue: Low pressure (typically associated with unsettled weather, clouds, precipitation)
- Green: Normal pressure (around the standard atmospheric pressure of 1013.25 hPa)
- Orange/Red: High pressure (typically associated with clear, settled weather)

Standard atmospheric pressure at sea level is 1013.25 hPa. Variations in atmospheric pressure are important for weather forecasting:
- Rising pressure often indicates improving weather
- Falling pressure often indicates deteriorating weather

Hover over each day to see the exact values. This visualization helps identify patterns in atmospheric pressure over time.

</Details>
