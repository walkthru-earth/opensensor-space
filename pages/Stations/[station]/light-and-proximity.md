---
title: Light and Proximity
---

```sql station_info
SELECT * FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - Light & Proximity

<LastRefreshed/>

<Details title='About this dashboard'>

This dashboard analyzes light (Lux) and proximity sensor readings from **{station_info[0].station_name}**. You can select a date range to view specific data.

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

## Light and Proximity Summary

```sql main_data
-- Get the base light and proximity data we need
select
  timestamp,
  lux,
  proximity
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date
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
- Below 10 lux: Very dark (moonlight)
- 10-50 lux: Dark indoor lighting
- 100-500 lux: Normal indoor lighting
- 1,000+ lux: Daylight
- 10,000+ lux: Direct sunlight

</Details>

## Hourly Patterns

```sql hourly_patterns
-- Calculate hourly patterns throughout the day
SELECT
  extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour_of_day,
  round(avg(lux), 1) as avg_lux,
  round(avg(proximity), 1) as avg_proximity
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date >= '${inputs.date_filter.start}'::date
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date <= '${inputs.date_filter.end}'::date
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
- The natural light pattern typically shows lowest values during night hours (0-5, 20-23), rising values during morning (6-11), peak values during midday (11-15), and declining values in evening (16-19)

Proximity sensor values may show different patterns based on its placement and what it's detecting.

</Details>

## Time Series Analysis

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

## Daily Calendar Views

```sql daily_values_for_calendar
-- Get daily average light and proximity values for the calendar heatmaps
SELECT
  strftime(date_trunc('day', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)), '%Y-%m-%d') as day,
  round(avg(lux), 1) as avg_lux,
  round(avg(proximity), 1) as avg_proximity
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date >= '${inputs.date_filter.start}'::date
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date <= '${inputs.date_filter.end}'::date
  AND (lux IS NOT NULL OR proximity IS NOT NULL)
GROUP BY day
ORDER BY day
```

<CalendarHeatmap
  data={daily_values_for_calendar}
  date=day
  value=avg_lux
  title="Daily Light Levels"
  subtitle="Calendar view showing daily average light levels in lux"
  colorScale={[
    ["rgb(50, 50, 50)", "rgb(100, 100, 100)"],
    ["rgb(255, 204, 0)", "rgb(255, 255, 0)"],
    ["rgb(255, 165, 0)", "rgb(255, 140, 0)"]
  ]}
  min=0
  max=1000
  valueFmt="0.0"
/>

<CalendarHeatmap
  data={daily_values_for_calendar}
  date=day
  value=avg_proximity
  title="Daily Proximity Readings"
  subtitle="Calendar view showing daily average proximity values"
  colorScale={[
    ["rgb(0, 128, 128)", "rgb(64, 224, 208)"],
    ["rgb(70, 130, 180)", "rgb(100, 149, 237)"],
    ["rgb(106, 90, 205)", "rgb(138, 43, 226)"]
  ]}
  min=0
  max=100
  valueFmt="0.0"
/>

<Details title='About Calendar Views'>

These calendar visualizations show daily average light and proximity levels:

**Light Levels:**
- Gray: Very dark (below 50 lux)
- Yellow: Normal indoor lighting (50-500 lux)
- Orange: Bright light (above 500 lux)

**Proximity:**
- Teal/Turquoise: Objects close to the sensor (low values)
- Blue: Medium distance
- Purple: No objects detected near the sensor (high values)

Hover over each day to see the exact values. These visualizations help identify patterns in light and proximity readings over time.

</Details>
