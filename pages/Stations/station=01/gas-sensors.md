---
title: Gas Sensor Readings
---

<LastRefreshed/>

<Details title='About this dashboard'>
    
    This dashboard analyzes gas sensor readings (Oxidised, Reducing, NH3) from My DIY weather station. Units are typically kΩ (kiloohms), representing sensor resistance. 
    
    **Important Interpretation Guidelines**:
    - Lower resistance values often indicate higher gas concentrations
    - Each gas sensor has different sensitivity characteristics
    - Sudden changes in readings may indicate environmental events
    
    The dashboard includes time series analysis, daily patterns, and calendar views for long-term trend identification.

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
  defaultValue={'All Time'}
/>

## Gas Sensor Readings Summary

```sql main_data
-- Get all the base gas sensor data we need
select
  timestamp,
  oxidised,
  reducing,
  nh3
from station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date + interval '1 day'
  AND timestamp::date <= '${inputs.date_filter.end}'::date + interval '1 day'
```

```sql summary_stats
select
  round(min(oxidised), 1) as min_oxidised,
  round(max(oxidised), 1) as max_oxidised,
  round(avg(oxidised), 1) as avg_oxidised,
  round(min(reducing), 1) as min_reducing,
  round(max(reducing), 1) as max_reducing,
  round(avg(reducing), 1) as avg_reducing,
  round(min(nh3), 1) as min_nh3,
  round(max(nh3), 1) as max_nh3,
  round(avg(nh3), 1) as avg_nh3,
  min_oxidised || ' - ' || max_oxidised || ' kΩ' as oxidised_range,
  'Avg: ' || avg_oxidised || ' kΩ' as oxidised_avg,
  min_reducing || ' - ' || max_reducing || ' kΩ' as reducing_range,
  'Avg: ' || avg_reducing || ' kΩ' as reducing_avg,
  min_nh3 || ' - ' || max_nh3 || ' kΩ' as nh3_range,
  'Avg: ' || avg_nh3 || ' kΩ' as nh3_avg,
  CASE
    WHEN avg_oxidised < 10 THEN 'bg-red-50'
    WHEN avg_oxidised < 15 THEN 'bg-yellow-50'
    ELSE 'bg-green-50'
  END as oxidised_bg_color,
  CASE
    WHEN avg_reducing < 750 THEN 'bg-red-50'
    WHEN avg_reducing < 1000 THEN 'bg-yellow-50'
    ELSE 'bg-green-50'
  END as reducing_bg_color,
  CASE
    WHEN avg_nh3 < 25 THEN 'bg-red-50'
    WHEN avg_nh3 < 50 THEN 'bg-yellow-50'
    ELSE 'bg-green-50'
  END as nh3_bg_color
from ${main_data}
```

<Grid numCols={3}>
  <BigValue 
    data={summary_stats} 
    value=oxidised_range
    title="Oxidised Gas Range" 
    subtitle=oxidised_avg
    backgroundColor=oxidised_bg_color
  />
  <BigValue 
    data={summary_stats} 
    value=reducing_range
    title="Reducing Gas Range" 
    subtitle=reducing_avg
    backgroundColor=reducing_bg_color
  />
  <BigValue 
    data={summary_stats} 
    value=nh3_range
    title="NH3 Range" 
    subtitle=nh3_avg
    backgroundColor=nh3_bg_color
  />
</Grid>

```sql hourly_patterns
-- Calculate hourly patterns throughout the day
SELECT
  extract('hour' from timestamp) as hour_of_day,
  round(avg(oxidised), 1) as oxidised,
  round(avg(reducing), 1) as reducing,
  round(avg(nh3), 1) as nh3
FROM station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date + interval '1 day'
  AND timestamp::date <= '${inputs.date_filter.end}'::date + interval '1 day'
GROUP BY hour_of_day
ORDER BY hour_of_day
```

```sql hourly_patterns_stacked
-- Format data for the line chart with series
SELECT
  hour_of_day,
  oxidised as value,
  'Oxidised' as gas_type
FROM ${hourly_patterns}

UNION ALL

SELECT
  hour_of_day,
  reducing as value,
  'Reducing' as gas_type
FROM ${hourly_patterns}

UNION ALL

SELECT
  hour_of_day,
  nh3 as value,
  'NH3' as gas_type
FROM ${hourly_patterns}
ORDER BY hour_of_day, gas_type
```

<LineChart
  data={hourly_patterns_stacked}
  x=hour_of_day
  y=value
  series=gas_type
  title="Average Hourly Gas Sensor Patterns"
  subtitle="How gas sensor readings change throughout the day"
  chartAreaHeight=250
  lineWidth=3
  markers=true
  markerSize=5
  colors={["#e41a1c", "#377eb8", "#4daf4a"]}
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

<Details title='About Hourly Gas Patterns'>
    
    This chart shows the average gas sensor readings for each hour of the day, calculated from all data within your selected date range. 
    
    - It always shows hours 0-23 to reveal the daily cycle pattern
    - Values are averaged across all days in your selected period  
    - Use the zoom control at the bottom to focus on specific hours
    - Daily patterns may correlate with:
      - Human activities (cooking, cleaning)
      - HVAC operation cycles
      - Outdoor air pollution patterns
    
    Lower resistance values (kΩ) generally indicate higher gas concentrations.

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
    oxidised,
    reducing,
    nh3
  FROM ${main_data}
)

SELECT
  half_hour_timestamp,
  round(avg(oxidised), 1) as value,
  'Oxidised' as gas_type
FROM time_buckets
GROUP BY half_hour_timestamp

UNION ALL

SELECT
  half_hour_timestamp,
  round(avg(reducing), 1) as value,
  'Reducing' as gas_type
FROM time_buckets
GROUP BY half_hour_timestamp

UNION ALL

SELECT
  half_hour_timestamp,
  round(avg(nh3), 1) as value,
  'NH3' as gas_type
FROM time_buckets
GROUP BY half_hour_timestamp
ORDER BY half_hour_timestamp, gas_type
```

<LineChart
  data={time_series_data}
  x=half_hour_timestamp
  y=value
  series=gas_type
  title="Gas Sensor Readings Over Time (30-min intervals)"
  subtitle="Average values in 30-minute buckets for smoother visualization"
  yAxisTitle="Resistance (kΩ)"
  chartAreaHeight=250
  lineWidth=3
  colors={["#e41a1c", "#377eb8", "#4daf4a"]}
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
  <ReferenceLine y={10} label="Oxidised alert threshold (10kΩ)" color="warning" lineType="dashed"/>
  <ReferenceLine y={750} label="Reducing alert threshold (750kΩ)" color="warning" lineType="dashed"/>
  <ReferenceLine y={25} label="NH3 alert threshold (25kΩ)" color="warning" lineType="dashed"/>
</LineChart>

<Details title='About This Chart'>
    
    This chart shows gas sensor readings averaged in 30-minute intervals, providing a smoother view of gas level trends over time.
    
    - Each point represents the average of all readings within a 30-minute period
    - Lower resistance values (kΩ) indicate higher gas concentrations
    - Reference lines show thresholds where gas levels may be of concern:
      - Oxidised gases (NO2/O3): Below 10 kΩ indicates elevated levels
      - Reducing gases (CO/VOCs): Below 750 kΩ indicates elevated levels
      - NH3 (ammonia): Below 25 kΩ indicates elevated levels
    
    Use the zoom control at the bottom to focus on specific time periods of interest.

</Details>

## Gas Correlation Analysis

```sql gas_correlation
-- Get data for the gas correlation scatter plots
SELECT 
  date_trunc('hour', timestamp) as hour,
  extract('hour' from timestamp) as hour_of_day,
  round(avg(oxidised), 1) as oxidised,
  round(avg(reducing), 1) as reducing,
  round(avg(nh3), 1) as nh3,
  -- Add time of day categories for better analysis
  CASE
    WHEN extract('hour' from timestamp) >= 6 AND extract('hour' from timestamp) < 12 THEN 'Morning (6-12)'
    WHEN extract('hour' from timestamp) >= 12 AND extract('hour' from timestamp) < 18 THEN 'Afternoon (12-18)'
    WHEN extract('hour' from timestamp) >= 18 AND extract('hour' from timestamp) < 22 THEN 'Evening (18-22)'
    ELSE 'Night (22-6)'
  END as time_of_day
FROM station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date + interval '1 day'
  AND timestamp::date <= '${inputs.date_filter.end}'::date + interval '1 day'
  AND (oxidised IS NOT NULL OR reducing IS NOT NULL OR nh3 IS NOT NULL)
GROUP BY 
  date_trunc('hour', timestamp),
  extract('hour' from timestamp)
ORDER BY hour
```

<Grid numCols={2}>
  <ScatterPlot
    data={gas_correlation}
    x=oxidised
    y=reducing
    series=time_of_day
    tooltipTitle=hour
    xAxisTitle="Oxidised Gas (kΩ)"
    yAxisTitle="Reducing Gas (kΩ)"
    title="Oxidised vs Reducing Gas"
    subtitle="Each point represents an hourly average, colored by time of day"
    pointSize=10
    shape="circle"
    xFmt="0.0"
    yFmt="0.0"
  />
  
  <ScatterPlot
    data={gas_correlation}
    x=nh3
    y=reducing
    series=time_of_day
    tooltipTitle=hour
    xAxisTitle="NH3 (kΩ)"
    yAxisTitle="Reducing Gas (kΩ)"
    title="NH3 vs Reducing Gas"
    subtitle="Each point represents an hourly average, colored by time of day"
    pointSize=10
    shape="circle"
    xFmt="0.0"
    yFmt="0.0"
  />
</Grid>

<Details title='Understanding Gas Correlation Patterns'>
    
    These scatter plots reveal correlations between different gas sensor readings:
    
    - **Color Coding**: Points are colored by time of day to help identify patterns
    - **Interpretation**:
      - Points clustering along a diagonal line suggest gases that rise and fall together
      - Scattered points with no pattern suggest gases that behave independently
      - Clusters at different times of day may indicate activities that produce specific gas combinations
    
    Common patterns:
    - Cooking activities: May show correlated rises in reducing gases and NH3
    - Traffic pollution: May show rises in oxidised gases (NO2) with some CO (reducing)
    - Cleaning products: Can cause spikes in various VOCs (reducing) and sometimes NH3

</Details>

## Daily Calendar Views

```sql daily_gas_for_calendar
-- Get daily average gas sensor readings for the calendar heatmaps
SELECT
  date_trunc('day', timestamp)::date as day,
  round(avg(oxidised), 1) as avg_oxidised,
  round(avg(reducing), 1) as avg_reducing,
  round(avg(nh3), 1) as avg_nh3
FROM station_01
WHERE timestamp::date >= '${inputs.date_filter.start}'::date + interval '1 day'
  AND timestamp::date <= '${inputs.date_filter.end}'::date + interval '1 day'
  AND (oxidised IS NOT NULL OR reducing IS NOT NULL OR nh3 IS NOT NULL)
GROUP BY day
ORDER BY day
```

<CalendarHeatmap 
  data={daily_gas_for_calendar}
  date=day
  value=avg_oxidised
  title="Daily Oxidised Gas Levels"
  subtitle="Daily average oxidised gas readings"
  colorScale={[
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],  // High concentration (low resistance): Red to orange
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],  // Medium concentration: Yellow to green-yellow
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]  // Low concentration (high resistance): Dark green to light green
  ]}
  valueFmt="0.0"
  invertColorScale=true
/>

<CalendarHeatmap 
  data={daily_gas_for_calendar}
  date=day
  value=avg_reducing
  title="Daily Reducing Gas Levels"
  subtitle="Daily average reducing gas readings"
  colorScale={[
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],  // High concentration (low resistance): Red to orange
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],  // Medium concentration: Yellow to green-yellow
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]  // Low concentration (high resistance): Dark green to light green
  ]}
  valueFmt="0.0"
  invertColorScale=true
/>

<CalendarHeatmap 
  data={daily_gas_for_calendar}
  date=day
  value=avg_nh3
  title="Daily NH3 Levels"
  subtitle="Daily average NH3 readings"
  colorScale={[
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],  // High concentration (low resistance): Red to orange
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],  // Medium concentration: Yellow to green-yellow
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]  // Low concentration (high resistance): Dark green to light green
  ]}
  valueFmt="0.0"
  invertColorScale=true
/>

<Details title='About Gas Sensor Calendar Heatmaps'>
    
    These calendar visualizations show daily average gas sensor readings in kiloohms (kΩ). For gas sensors, lower resistance values typically indicate higher gas concentrations:
    
    - **Color Scale** (for all gas sensors):
      - Red/Orange: Higher gas concentration (lower sensor resistance)
      - Yellow: Moderate gas concentration
      - Green: Lower gas concentration (higher sensor resistance)
    
    *Note*: The color scale is inverted because sensor resistance (kΩ) is inversely related to gas concentration.
    
    Typical interpretation thresholds:
    - **Oxidised gases**: Readings below 10 kΩ may indicate elevated NO2 or O3
    - **Reducing gases**: Readings below 750 kΩ may indicate elevated CO or VOCs
    - **NH3**: Readings below 25 kΩ may indicate elevated ammonia levels
    
    Hover over each day to see the exact values. These visualizations help identify patterns in gas levels over time.

</Details>
