---
title: Atmospheric Pressure
---

<LastRefreshed/>

<Details title='About this dashboard'>
  This dashboard analyzes atmospheric pressure data from My DIY weather station (Cloud Native way). You can select a date range to view specific data.
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

## Pressure Statistics Summary

```sql main_data
-- Get the base pressure data we need
select
  timestamp,
  pressure
from station_01
where timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
```

```sql summary_stats
select
  round(min(pressure), 2) as min_pressure,
  round(max(pressure), 2) as max_pressure,
  round(avg(pressure), 2) as avg_pressure
from ${main_data}
```

<DataTable
  data={summary_stats}
  title="Pressure Statistics Summary (hPa)"
/>

## Pressure Over Time

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
  data={main_data}
  x=timestamp
  y=pressure
  yAxisTitle="Pressure (hPa)"
  title="Atmospheric Pressure Over Time"
  subtitle="Pressure readings from weather station"
  markers=true
  markerSize=4
  lineWidth=2
  chartAreaHeight=250
  xFmt="yyyy-MM-dd HH:mm:ss"
  step=true
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
  <ReferenceLine y={1013.25} label="Standard Pressure" color=neutral lineType=dashed hideValue=true/>
  <ReferencePoint 
    data={pressure_extremes} 
    x=timestamp 
    y=pressure 
    label=label 
    labelPosition=top 
    color=negative 
    symbolSize=8
  />
</LineChart>

## Daily Calendar View

```sql daily_pressure_for_calendar
-- Get daily average pressure values for the calendar heatmap
SELECT
  date_trunc('day', timestamp)::date as day,
  round(avg(pressure), 1) as avg_pressure
FROM station_01
WHERE 
  timestamp::date between '${inputs.date_filter.start}' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
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
    ["rgb(0, 0, 255)", "rgb(173, 216, 230)"],  // Low pressure: Dark blue to light blue
    ["rgb(173, 255, 47)", "rgb(144, 238, 144)"],  // Normal pressure: Light green-yellow to light green
    ["rgb(255, 165, 0)", "rgb(255, 0, 0)"]  // High pressure: Orange to red
  ]}
  min=990
  max=1040
  valueFmt="0.0"
/>

<Details title='About Pressure Calendar Heatmap'>
  This calendar visualization shows daily average atmospheric pressure in hectopascals (hPa):
  
  - **Color Scale**:
    - Blue: Low pressure (typically associated with unsettled weather, clouds, precipitation)
    - Green: Normal pressure (around the standard atmospheric pressure of 1013.25 hPa)
    - Orange/Red: High pressure (typically associated with clear, settled weather)
  
  Standard atmospheric pressure at sea level is 1013.25 hPa. Variations in atmospheric pressure are important for weather forecasting:
  - Rising pressure often indicates improving weather
  - Falling pressure often indicates deteriorating weather
  
  Hover over each day to see the exact values. This visualization helps identify patterns in atmospheric pressure over time.
</Details>
