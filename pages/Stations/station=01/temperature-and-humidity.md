---
title: Temperature and Humidity
---

<LastRefreshed/>

<Details title='About this dashboard'>
  This dashboard analyzes My DIY weather station data (Cloud Native way). You can select a date range to view specific data.
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

## Temperature and Humidity Summary

```sql main_data
-- Get all the base data we need in a single scan
select
  timestamp,
  temperature,
  humidity
from station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date
  AND timestamp::date <= '${inputs.date_filter.end}'::date
```

```sql temp_summary
select 
  round(min(temperature), 1) as min_temp,
  round(max(temperature), 1) as max_temp,
  round(avg(temperature), 1) as avg_temp,
  case
    when avg(temperature) < 18 then 'bg-blue-50'
    when avg(temperature) > 25 then 'bg-red-50'
    else 'bg-green-50'
  end as temp_bg_color,
  round(min(temperature), 1) || ' - ' || round(max(temperature), 1) || '°C' as temp_range,
  'Avg: ' || round(avg(temperature), 1) || '°C' as temp_avg
from ${main_data}
```

```sql humidity_summary
select 
  round(min(humidity), 1) as min_humidity,
  round(max(humidity), 1) as max_humidity,
  round(avg(humidity), 1) as avg_humidity,
  case
    when avg(humidity) < 30 then 'bg-yellow-50'
    when avg(humidity) > 60 then 'bg-blue-50'
    else 'bg-green-50'
  end as humidity_bg_color,
  round(min(humidity), 1) || ' - ' || round(max(humidity), 1) || '%' as humidity_range,
  'Avg: ' || round(avg(humidity), 1) || '%' as humidity_avg
from ${main_data}
```

<Grid numCols={2}>
  <BigValue 
    data={temp_summary} 
    value=temp_range 
    title="Temperature Range" 
    subtitle=temp_avg
    backgroundColor=temp_bg_color
  />
  <BigValue 
    data={humidity_summary} 
    value=humidity_range 
    title="Humidity Range" 
    subtitle=humidity_avg
    backgroundColor=humidity_bg_color
  />
</Grid>

<Details title="Understanding Temperature and Humidity">
  - **Temperature** is measured in degrees Celsius (°C)
  - **Humidity** is measured as relative humidity (%)
  
  ### Comfort Ranges
  - Temperature: 18-25°C is generally considered comfortable
  - Humidity: 30-60% is ideal for comfort and health
  
  Values outside these ranges may affect comfort and potentially indoor air quality.
</Details>

## Hourly Weather Patterns

```sql hourly_patterns
-- Calculate hourly patterns throughout the day with a stacked format for the series
SELECT
  extract('hour' from timestamp) as hour_of_day,
  round(avg(temperature), 1) as temperature,
  round(avg(humidity), 1) as humidity
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
  temperature as value,
  'Temperature' as metric_type
FROM ${hourly_patterns}

UNION ALL

SELECT
  hour_of_day,
  humidity as value,
  'Humidity' as metric_type
FROM ${hourly_patterns}
ORDER BY hour_of_day, metric_type
```

<LineChart
  data={hourly_patterns_stacked}
  x=hour_of_day
  y=value
  series=metric_type
  title="Average Hourly Patterns"
  subtitle="How temperature and humidity change throughout the day"
  chartAreaHeight=250
  lineWidth=3
  markers=true
  markerSize=5
  colors={["#e41a1c", "#377eb8"]}
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
  <ReferenceLine y={25} label="Temp Comfort Upper" color=warning lineType=dashed hideValue=true/>
  <ReferenceLine y={18} label="Temp Comfort Lower" color=info lineType=dashed hideValue=true/>
  <ReferenceLine y={60} label="Humidity Upper" color=negative lineType=dotted hideValue=true/>
  <ReferenceLine y={30} label="Humidity Lower" color=warning lineType=dotted hideValue=true/>
</LineChart>

<Details title='About Hourly Patterns'>
    
    This chart shows the average temperature and humidity for each hour of the day, calculated from all data within your selected date range. 
    
    - It always shows hours 0-23 because it's designed to reveal the daily cycle pattern
    - Values are averaged across all days in your selected period
    - Use the zoom control at the bottom to focus on specific hours
    - Temperature and humidity often follow predictable daily patterns that this visualization reveals

</Details>

## Key Weather Metrics

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
    temperature,
    humidity
  FROM station_01
  WHERE timestamp::date >= '${inputs.date_filter.start}'::date
    AND timestamp::date <= '${inputs.date_filter.end}'::date
)

SELECT
  half_hour_timestamp,
  round(avg(temperature), 1) as value,
  'Temperature' as metric_type
FROM time_buckets
GROUP BY half_hour_timestamp

UNION ALL

SELECT
  half_hour_timestamp,
  round(avg(humidity), 1) as value,
  'Humidity' as metric_type
FROM time_buckets
GROUP BY half_hour_timestamp
ORDER BY half_hour_timestamp, metric_type
```

<LineChart
  data={time_series_data}
  x=half_hour_timestamp
  y=value
  series=metric_type
  title="Temperature and Humidity Over Time"
  subtitle="30-minute average readings over the selected date range"
  chartAreaHeight=250
  lineWidth=2
  markers=true
  markerSize=4
  colors={["#e41a1c", "#377eb8"]}
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
  <ReferenceLine y={25} label="Temp Comfort Upper" color=warning lineType=dashed hideValue=true/>
  <ReferenceLine y={18} label="Temp Comfort Lower" color=info lineType=dashed hideValue=true/>
  <ReferenceLine y={60} label="Humidity Upper" color=negative lineType=dotted hideValue=true/>
  <ReferenceLine y={30} label="Humidity Lower" color=warning lineType=dotted hideValue=true/>
</LineChart>

## Temperature and Humidity Correlation

```sql temp_vs_humidity
-- Get hourly temperature and humidity for the scatter plot
SELECT 
  date_trunc('hour', timestamp) as hour,
  extract('hour' from timestamp) as hour_of_day,
  round(avg(temperature), 1) as temperature,
  round(avg(humidity), 1) as humidity,
  -- Add time of day categories for better analysis
  CASE
    WHEN extract('hour' from timestamp) >= 6 AND extract('hour' from timestamp) < 12 THEN 'Morning (6-12)'
    WHEN extract('hour' from timestamp) >= 12 AND extract('hour' from timestamp) < 18 THEN 'Afternoon (12-18)'
    WHEN extract('hour' from timestamp) >= 18 AND extract('hour' from timestamp) < 22 THEN 'Evening (18-22)'
    ELSE 'Night (22-6)'
  END as time_of_day
FROM station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date
  AND timestamp::date <= '${inputs.date_filter.end}'::date
GROUP BY 
  date_trunc('hour', timestamp),
  extract('hour' from timestamp)
ORDER BY hour
```

```sql comfort_zones
-- Define comfort zones for the scatter plot
SELECT * FROM (
  VALUES 
  (18, 30, 'Too Cold & Dry'),
  (18, 60, 'Comfortable Temperature, Optimal Humidity'),
  (18, 100, 'Too Cold & Humid'),
  (25, 30, 'Optimal Temperature, Too Dry'),
  (25, 60, 'Ideal Comfort Zone'),
  (25, 100, 'Optimal Temperature, Too Humid'),
  (35, 30, 'Too Hot & Dry'),
  (35, 60, 'Too Hot, Optimal Humidity'),
  (35, 100, 'Too Hot & Humid')
) AS t(temp, humidity, zone)
```

<ScatterPlot
  data={temp_vs_humidity}
  x=temperature
  y=humidity
  series=time_of_day
  tooltipTitle=hour
  xAxisTitle="Temperature (°C)"
  yAxisTitle="Humidity (%)"
  title="Temperature and Humidity Relationship"
  subtitle="Each point represents an hourly average, colored by time of day"
  pointSize=12
  shape="circle"
  xFmt="0.0"
  yFmt="0.0"
>
  <ReferenceLine x={18} label="Min Comfort Temp" color=info lineType=dashed />
  <ReferenceLine x={25} label="Max Comfort Temp" color=warning lineType=dashed />
  <ReferenceLine y={30} label="Min Comfort Humidity" color=warning lineType=dotted />
  <ReferenceLine y={60} label="Max Comfort Humidity" color=negative lineType=dotted />
</ScatterPlot>

<Details title='Understanding the Temperature-Humidity Relationship'>
    
    This scatter plot reveals important patterns in how temperature and humidity interact in your environment:
    
    - **Color Coding**: Points are colored by time of day to help identify patterns in daily cycles
    - **Comfort Zones**: 
      - Ideal comfort zone: 18-25°C temperature and 30-60% humidity
      - Reference lines mark the boundaries of these comfort zones
    - **Interpretation**:
      - Points in the top-right are hot and humid (can feel muggy)
      - Points in the bottom-right are hot and dry (can feel uncomfortable)
      - Points in the top-left are cool and humid (can feel clammy)
      - Points in the bottom-left are cool and dry (can feel comfortable or chilly)
    - **Correlation**: If points trend from bottom-left to top-right, this indicates that temperature and humidity rise together
      
    Understanding this relationship helps optimize ventilation and climate control for better comfort.

</Details>

## Daily Calendar Views

```sql daily_weather_for_calendar
-- Get daily average temperature and humidity values for the calendar heatmaps
SELECT
  date_trunc('day', timestamp)::date as day,
  round(avg(temperature), 1) as avg_temp,
  round(avg(humidity), 1) as avg_humidity
FROM station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date
  AND timestamp::date <= '${inputs.date_filter.end}'::date
  AND (temperature IS NOT NULL OR humidity IS NOT NULL)
GROUP BY day
ORDER BY day
```

<Grid cols=2>
  <CalendarHeatmap 
    data={daily_weather_for_calendar}
    date=day
    value=avg_temp
    title="Daily Temperature Levels"
    subtitle="Calendar view showing daily average temperature"
    colorScale={[
      ["rgb(0, 0, 255)", "rgb(173, 216, 230)"],  // Cold: Dark blue to light blue (below 18°C)
      ["rgb(0, 128, 0)", "rgb(144, 238, 144)"],  // Comfort zone: Dark green to light green (18-25°C)
      ["rgb(255, 165, 0)", "rgb(255, 0, 0)"]     // Hot: Orange to red (above 25°C)
    ]}
    min=10
    max=30
    valueFmt="0.0"
  />

  <CalendarHeatmap 
    data={daily_weather_for_calendar}
    date=day
    value=avg_humidity
    title="Daily Humidity Levels"
    subtitle="Calendar view showing daily average humidity"
    colorScale={[
      ["rgb(255, 165, 0)", "rgb(255, 255, 0)"],  // Too dry: Orange to yellow (below 30%)
      ["rgb(0, 128, 0)", "rgb(144, 238, 144)"],  // Comfort zone: Dark green to light green (30-60%)
      ["rgb(0, 0, 255)", "rgb(138, 43, 226)"]    // Too humid: Blue to purple (above 60%)
    ]}
    min=0
    max=100
    valueFmt="0.0"
  />
</Grid>

<Details title='About Calendar Views'>
    
    These calendar visualizations show daily average temperature and humidity levels. Color intensity represents values according to indoor comfort standards:
    
    - **Temperature**: 
      - Blue: Too cold (below 18°C)
      - Green: Comfort zone (18-25°C)
      - Orange/Red: Too hot (above 25°C)
    
    - **Humidity**: 
      - Yellow/Orange: Too dry (below 30%)
      - Green: Comfort zone (30-60%)
      - Blue/Purple: Too humid (above 60%)
    
    Hover over each day to see the exact values. These visualizations help identify patterns and seasonal changes over time.

</Details>