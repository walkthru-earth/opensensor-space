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

## Hourly Weather Patterns

```sql hourly_patterns
-- Calculate hourly patterns throughout the day with a stacked format for the series
SELECT
  extract('hour' from timestamp) as hour_of_day,
  round(avg(temperature), 1) as temperature,
  round(avg(humidity), 1) as humidity
FROM station_01
where timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
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

```sql main_data
-- Get all the base data we need in a single scan
select
  timestamp,
  temperature,
  humidity
from station_01
where timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
```

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
  FROM ${main_data}
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
  min(temperature) || ' - ' || max(temperature) || '°C' as temp_range,
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
  min(humidity) || ' - ' || max(humidity) || '%' as humidity_range,
  'Avg: ' || round(avg(humidity), 1) || '%' as humidity_avg
from ${main_data}
```

<BigValue
  data={temp_summary}
  title="Temperature Range"
  value=temp_range
  subtitle=temp_avg
  bold=true
  backgroundColor=temp_bg_color
/>

<BigValue
  data={humidity_summary}
  title="Humidity Range"
  value=humidity_range
  subtitle=humidity_avg
  bold=true
  backgroundColor=humidity_bg_color
/>

## Temperature and Humidity Correlation

```sql extremes
select
  timestamp,
  temperature,
  humidity,
  case
    when temperature = (select max(temperature) from ${main_data})
    then 'Highest Temp: ' || round(temperature, 1) || '°C'
    when temperature = (select min(temperature) from ${main_data})
    then 'Lowest Temp: ' || round(temperature, 1) || '°C'
    when humidity = (select max(humidity) from ${main_data})
    then 'Highest Humidity: ' || round(humidity, 1) || '%'
    when humidity = (select min(humidity) from ${main_data})
    then 'Lowest Humidity: ' || round(humidity, 1) || '%'
  end as label
from ${main_data}
where temperature = (select max(temperature) from ${main_data})
   or temperature = (select min(temperature) from ${main_data})
   or humidity = (select max(humidity) from ${main_data})
   or humidity = (select min(humidity) from ${main_data})
```

```sql temp_vs_humidity
-- Temperature vs Humidity correlation data
select 
  date_trunc('hour', timestamp) as hour,
  extract('hour' from timestamp) as hour_of_day,
  date_trunc('day', timestamp)::string as day,
  avg(temperature) as temperature,
  avg(humidity) as humidity
from ${main_data}
group by 
  date_trunc('hour', timestamp),
  extract('hour' from timestamp),
  date_trunc('day', timestamp)::string
order by hour
```

```sql regression
-- Calculate regression line for temperature vs humidity
WITH 
coeffs AS (
    SELECT
        regr_slope(humidity, temperature) AS slope,
        regr_intercept(humidity, temperature) AS intercept,
        regr_r2(humidity, temperature) AS r_squared
    FROM ${temp_vs_humidity}
)

SELECT 
    min(temperature) AS x, 
    max(temperature) AS x2, 
    min(temperature) * slope + intercept AS y, 
    max(temperature) * slope + intercept AS y2, 
    'Trend: ' || ROUND(slope, 2) || 'x + ' || ROUND(intercept, 2) || ' (R² = ' || ROUND(r_squared, 3) || ')' AS label
FROM coeffs, ${temp_vs_humidity}
GROUP BY slope, intercept, r_squared
```

<ScatterPlot
  data={temp_vs_humidity}
  x=temperature
  y=humidity
  series=day
  tooltipTitle=hour
  xAxisTitle="Temperature (°C)"
  yAxisTitle="Humidity (%)"
  title="Temperature vs Humidity Correlation"
  subtitle="Each point represents hourly averages, colored by day"
  pointSize=12
  shape="circle"
>
  <ReferenceArea xMin={18} xMax={25} yMin={30} yMax={60} label="Comfort Zone" color=positive opacity=0.1 border=true/>
  <ReferenceLine data={regression} x=x y=y x2=x2 y2=y2 label=label color=base-content-muted lineType=solid/>
  <Callout x={22} y={75} labelPosition=top labelWidth=150>
    High humidity with moderate temperature
    indicates potential discomfort
  </Callout>
  <Callout x={15} y={20} labelPosition=bottom labelWidth=150>
    Low humidity with low temperature
    can cause dry skin and respiratory issues
  </Callout>
</ScatterPlot>

## Daily Calendar Views

```sql daily_weather_for_calendar
-- Get daily average temperature and humidity values for the calendar heatmaps
SELECT
  date_trunc('day', timestamp)::date as day,
  round(avg(temperature), 1) as avg_temp,
  round(avg(humidity), 1) as avg_humidity
FROM station_01
WHERE 
  timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
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

<Details title='About Weather Calendar Heatmaps'>
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