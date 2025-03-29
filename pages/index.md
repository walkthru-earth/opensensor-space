---
title: My Weather Station Dashboard
---

<Details title='About this dashboard'>
  This dashboard analyzes weather station data using Evidence.dev. You can select a date range to view specific data points from station 01.
</Details>

```sql date_range_data
select 
  (min(timestamp)::date + interval '1 day')::date as min_date,
  (max(timestamp)::date + interval '1 day')::date as max_date
from stations
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

# Weather Station Data: {inputs.date_filter.start} to {inputs.date_filter.end}

## Weather Station Information

Weather station is located at coordinates: 30.0626, 31.4916

## Weather Statistics Summary

```sql summary_stats
  select
    round(min(temperature), 2) as min_temp,
    round(max(temperature), 2) as max_temp,
    round(avg(temperature), 2) as avg_temp,
    round(min(humidity), 2) as min_humidity,
    round(max(humidity), 2) as max_humidity,
    round(avg(humidity), 2) as avg_humidity,
    round(min(pressure), 2) as min_pressure,
    round(max(pressure), 2) as max_pressure,
    round(avg(pressure), 2) as avg_pressure
  from stations
  where timestamp BETWEEN '${inputs.date_filter.start}'::timestamp 
    and '${inputs.date_filter.end}'::timestamp + interval '23 hours 59 minutes 59 seconds'
```

<DataTable
  data={summary_stats}
  title="Weather Statistics Summary"
/>

## Temperature and Humidity Over Time

```sql weather_data
  select
    timestamp,
    temperature,
    humidity
  from stations
  where timestamp BETWEEN '${inputs.date_filter.start}'::timestamp 
    and '${inputs.date_filter.end}'::timestamp + interval '23 hours 59 minutes 59 seconds'
  order by timestamp
```

<LineChart
  data={weather_data}
  x=timestamp
  y=temperature
  y2=humidity
  yAxisTitle="Temperature (°C)"
  y2AxisTitle="Humidity (%)"
  title="Temperature and Humidity Over Time"
  subtitle="Temperature shown as line, humidity as secondary axis"
  markers=true
  markerSize=4
  lineWidth=2
  chartAreaHeight=300
  xFmt="yyyy-MM-dd HH:mm:ss"
/>

## Temperature vs Humidity

```sql temp_vs_humidity
  select 
    date_trunc('hour', timestamp) as hour,
    extract('hour' from timestamp) as hour_of_day,
    date_trunc('day', timestamp)::string as day,
    avg(temperature) as temperature,
    avg(humidity) as humidity
  from stations
  where timestamp BETWEEN '${inputs.date_filter.start}'::timestamp 
    and '${inputs.date_filter.end}'::timestamp + interval '23 hours 59 minutes 59 seconds'
  group by 
    date_trunc('hour', timestamp),
    extract('hour' from timestamp),
    date_trunc('day', timestamp)::string
  order by hour
```

<ScatterPlot
  data={temp_vs_humidity}
  x=temperature
  y=humidity
  series=day
  tooltipTitle=hour
  xAxisTitle="Temperature (°C)"
  yAxisTitle="Humidity (%)"
  title="Temperature vs Humidity Correlation by Day"
  pointSize=12
  shape="circle"
/>

## Raw Data Sample

```sql raw_data
  select
    timestamp::string as timestamp,
    temperature,
    humidity,
    pressure
  from stations
  where timestamp BETWEEN '${inputs.date_filter.start}'::timestamp 
    and '${inputs.date_filter.end}'::timestamp + interval '23 hours 59 minutes 59 seconds'
  limit 1000
```

<DataTable 
  data={raw_data} 
  title="Sample Weather Data"
  search=true
  pagination=true
/>

<Details title='About The Measurements'>

## Measurement Explanations
- **Temperature**: Ambient temperature in degrees Celsius
- **Humidity**: Relative humidity as a percentage
- **Pressure**: Atmospheric pressure in hectopascals (hPa)

</Details>
