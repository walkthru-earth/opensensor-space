---
title: Gas Sensor Readings
---

<LastRefreshed/>

<Details title='About this dashboard'>
  This dashboard analyzes gas sensor readings (Oxidised, Reducing, NH3) from My DIY weather station. Units are typically kΩ (kiloohms), representing sensor resistance. Lower values often indicate higher gas concentrations, but refer to sensor datasheets for specific interpretations. You can select a date range to view specific data.
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

## Gas Sensor Statistics Summary

```sql main_data
-- Get the base gas sensor data we need
select
  timestamp,
  oxidised,
  reducing,
  nh3
from station_01
where timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
```

```sql summary_stats
select
  round(min(oxidised), 2) as min_oxidised,
  round(max(oxidised), 2) as max_oxidised,
  round(avg(oxidised), 2) as avg_oxidised,
  round(min(reducing), 2) as min_reducing,
  round(max(reducing), 2) as max_reducing,
  round(avg(reducing), 2) as avg_reducing,
  round(min(nh3), 2) as min_nh3,
  round(max(nh3), 2) as max_nh3,
  round(avg(nh3), 2) as avg_nh3
from ${main_data}
```

<DataTable
  data={summary_stats}
  title="Gas Sensor Statistics Summary (kΩ)"
/>

## Oxidised Gas Levels Over Time

```sql oxidised_extremes
select
  timestamp,
  oxidised,
  case
    when oxidised = (select max(oxidised) from ${main_data})
    then 'Highest Resistance: ' || round(oxidised, 1) || ' kΩ'
    when oxidised = (select min(oxidised) from ${main_data})
    then 'Lowest Resistance: ' || round(oxidised, 1) || ' kΩ'
  end as label
from ${main_data}
where oxidised = (select max(oxidised) from ${main_data})
   or oxidised = (select min(oxidised) from ${main_data})
```

<LineChart
  data={main_data}
  x=timestamp
  y=oxidised
  yAxisTitle="Oxidised Gases (kΩ)"
  title="Oxidised Gas Sensor Readings Over Time"
  subtitle="Sensor resistance readings (lower value often means higher concentration)"
  markers=true
  markerSize=4
  lineWidth=2
  chartAreaHeight=250
  xFmt="yyyy-MM-dd HH:mm:ss"
  step=true
  color=warning
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
  <ReferencePoint 
    data={oxidised_extremes} 
    x=timestamp 
    y=oxidised 
    label=label 
    labelPosition=top 
    color=negative 
    symbolSize=8
  />
</LineChart>

## Reducing Gas Levels Over Time

```sql reducing_extremes
select
  timestamp,
  reducing,
  case
    when reducing = (select max(reducing) from ${main_data})
    then 'Highest Resistance: ' || round(reducing, 1) || ' kΩ'
    when reducing = (select min(reducing) from ${main_data})
    then 'Lowest Resistance: ' || round(reducing, 1) || ' kΩ'
  end as label
from ${main_data}
where reducing = (select max(reducing) from ${main_data})
   or reducing = (select min(reducing) from ${main_data})
```

<LineChart
  data={main_data}
  x=timestamp
  y=reducing
  yAxisTitle="Reducing Gases (kΩ)"
  title="Reducing Gas Sensor Readings Over Time"
  subtitle="Sensor resistance readings (lower value often means higher concentration)"
  markers=true
  markerSize=4
  lineWidth=2
  chartAreaHeight=250
  xFmt="yyyy-MM-dd HH:mm:ss"
  step=true
  color=info
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
  <ReferencePoint 
    data={reducing_extremes} 
    x=timestamp 
    y=reducing 
    label=label 
    labelPosition=top 
    color=negative 
    symbolSize=8
  />
</LineChart>

## NH3 (Ammonia) Levels Over Time

```sql nh3_extremes
select
  timestamp,
  nh3,
  case
    when nh3 = (select max(nh3) from ${main_data})
    then 'Highest Resistance: ' || round(nh3, 1) || ' kΩ'
    when nh3 = (select min(nh3) from ${main_data})
    then 'Lowest Resistance: ' || round(nh3, 1) || ' kΩ'
  end as label
from ${main_data}
where nh3 = (select max(nh3) from ${main_data})
   or nh3 = (select min(nh3) from ${main_data})
```

<LineChart
  data={main_data}
  x=timestamp
  y=nh3
  yAxisTitle="NH3 (kΩ)"
  title="NH3 (Ammonia) Sensor Readings Over Time"
  subtitle="Sensor resistance readings (lower value often means higher concentration)"
  markers=true
  markerSize=4
  lineWidth=2
  chartAreaHeight=250
  xFmt="yyyy-MM-dd HH:mm:ss"
  step=true
  color=success
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
  <ReferencePoint 
    data={nh3_extremes} 
    x=timestamp 
    y=nh3 
    label=label 
    labelPosition=top 
    color=negative 
    symbolSize=8
  />
</LineChart>

## Daily Calendar Views

```sql daily_gas_for_calendar
-- Get daily average gas sensor readings for the calendar heatmaps
SELECT
  date_trunc('day', timestamp)::date as day,
  round(avg(oxidised), 1) as avg_oxidised,
  round(avg(reducing), 1) as avg_reducing,
  round(avg(nh3), 1) as avg_nh3
FROM station_01
WHERE 
  timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  AND (oxidised IS NOT NULL OR reducing IS NOT NULL OR nh3 IS NOT NULL)
GROUP BY day
ORDER BY day
```

### Daily Oxidised Gas Levels

<CalendarHeatmap 
  data={daily_gas_for_calendar}
  date=day
  value=avg_oxidised
  title="Daily Oxidised Gas Levels"
  subtitle="Calendar view showing daily average oxidised gas sensor readings (kΩ)"
  colorScale={[
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],  // High concentration (low resistance): Red to orange
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],  // Medium concentration: Yellow to green-yellow
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]  // Low concentration (high resistance): Dark green to light green
  ]}
  valueFmt="0.0"
  invertColorScale=true
/>

### Daily Reducing Gas Levels

<CalendarHeatmap 
  data={daily_gas_for_calendar}
  date=day
  value=avg_reducing
  title="Daily Reducing Gas Levels"
  subtitle="Calendar view showing daily average reducing gas sensor readings (kΩ)"
  colorScale={[
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],  // High concentration (low resistance): Red to orange
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],  // Medium concentration: Yellow to green-yellow
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]  // Low concentration (high resistance): Dark green to light green
  ]}
  valueFmt="0.0"
  invertColorScale=true
/>

### Daily NH3 (Ammonia) Levels

<CalendarHeatmap 
  data={daily_gas_for_calendar}
  date=day
  value=avg_nh3
  title="Daily NH3 (Ammonia) Levels"
  subtitle="Calendar view showing daily average NH3 sensor readings (kΩ)"
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
  
  *Note*: The color scale is inverted because sensor resistance (kΩ) is inversely related to gas concentration. Interpretation should be done with reference to sensor datasheets for exact thresholds.
  
  Hover over each day to see the exact values. These visualizations help identify patterns in gas levels over time.
</Details>
