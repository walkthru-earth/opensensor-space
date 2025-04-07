---
title: Particulate Matter
---

<LastRefreshed/>

<Details title='About this dashboard'>
  This dashboard shows particulate matter measurements from the PMS5003 sensor, which began collecting data on April 4, 2025.
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
  presetRanges={['Last 7 Days', 'Last 30 Days', 'All Time']}
  defaultValue={'All Time'}
/>

## Particulate Matter Summary

```sql main_data
-- Get the base PM data we need
select
  timestamp,
  pm1,
  pm2_5,
  pm10
from station_01
where 
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  and (pm1 is not null or pm2_5 is not null or pm10 is not null)
```

```sql current_24hr_means
-- Calculate current 24-hour mean values
SELECT
  round(avg(pm1), 1) as pm1_mean,
  round(avg(pm2_5), 1) as pm2_5_mean,
  round(avg(pm10), 1) as pm10_mean,
  pm1_mean || ' μg/m³' as pm1_value,
  pm2_5_mean || ' μg/m³' as pm2_5_value,
  pm10_mean || ' μg/m³' as pm10_value,
  CASE
    WHEN pm2_5_mean <= 12 THEN 'bg-green-50'
    WHEN pm2_5_mean <= 35.4 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm2_5_bg_color,
  CASE
    WHEN pm10_mean <= 20 THEN 'bg-green-50'
    WHEN pm10_mean <= 50 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm10_bg_color,
  CASE
    WHEN pm1_mean <= 10 THEN 'bg-green-50'
    WHEN pm1_mean <= 25 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm1_bg_color,
  CASE
    WHEN pm2_5_mean <= 12 AND pm10_mean <= 20 THEN 'Good'
    WHEN pm2_5_mean <= 35.4 AND pm10_mean <= 50 THEN 'Moderate'
    WHEN pm2_5_mean <= 55.4 AND pm10_mean <= 100 THEN 'Unhealthy for Sensitive Groups'
    WHEN pm2_5_mean <= 150.4 AND pm10_mean <= 200 THEN 'Unhealthy'
    WHEN pm2_5_mean <= 250.4 AND pm10_mean <= 300 THEN 'Very Unhealthy'
    WHEN pm2_5_mean > 250.4 OR pm10_mean > 300 THEN 'Hazardous'
    ELSE 'Insufficient Data'
  END as air_quality_category,
  'Based on 24-hour mean PM2.5 and PM10 values' as aqi_note,
  CASE
    WHEN pm2_5_mean <= 12 AND pm10_mean <= 20 THEN 'bg-green-50'
    WHEN pm2_5_mean <= 35.4 AND pm10_mean <= 50 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as aqi_bg_color
FROM station_01
WHERE 
  timestamp >= (SELECT max(timestamp) - INTERVAL '24 hours' FROM station_01)
```

<BigValue
  data={current_24hr_means}
  value=air_quality_category
  title="Current Air Quality Index (AQI) Category"
  subtitle=aqi_note
  backgroundColor=aqi_bg_color
/>

### 24-Hour Mean Values

<Grid numCols={3}>
  <BigValue
    data={current_24hr_means}
    value=pm1_value
    title="PM1 24hr Mean"
    subtitle="Ultra-fine particles"
    backgroundColor=pm1_bg_color
  />

  <BigValue
    data={current_24hr_means}
    value=pm2_5_value
    title="PM2.5 24hr Mean"
    subtitle="Fine inhalable particles"
    backgroundColor=pm2_5_bg_color
  />

  <BigValue
    data={current_24hr_means}
    value=pm10_value
    title="PM10 24hr Mean"
    subtitle="Coarse inhalable particles"
    backgroundColor=pm10_bg_color
  />
</Grid>

<Details title="Understanding Particulate Matter Readings">
  - **PM1**: Ultra-fine particles (diameter less than 1 micrometer) that can penetrate deep into lungs and potentially enter bloodstream
  - **PM2.5**: Fine inhalable particles (diameter less than 2.5 micrometers) that pose the greatest health risks
  - **PM10**: Coarse inhalable particles (diameter less than 10 micrometers)
  
  ### WHO Guidelines (24-hour mean)
  - PM2.5: 15 μg/m³
  - PM10: 45 μg/m³
  
  Lower values indicate better air quality. The air quality categories follow EPA standards for PM2.5 and PM10.
</Details>

## Particulate Matter Concentrations

```sql pm_hourly
-- Get hourly PM data with adjusted date range
select
  date_trunc('hour', timestamp) as hour,
  round(avg(pm1), 1) as pm1,
  round(avg(pm2_5), 1) as pm2_5,
  round(avg(pm10), 1) as pm10
from station_01
where 
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  and (pm1 is not null or pm2_5 is not null or pm10 is not null)
group by 1
order by 1
```

<LineChart 
  data={pm_hourly}
  x=hour
  y={["pm1", "pm2_5", "pm10"]}
  title="Hourly Particulate Matter Concentrations"
  yAxisTitle="Concentration (micrograms/m³)"
  xFmt="MMM dd, HH:mm"
/>

## Particle Count by Size

```sql particle_counts
-- Get hourly particle counts with adjusted date range
SELECT
  date_trunc('hour', timestamp) as hour,
  round(avg(particles_03um)) as "0.3μm",
  round(avg(particles_05um)) as "0.5μm", 
  round(avg(particles_10um)) as "1.0μm"
FROM station_01
WHERE
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  and (particles_03um is not null or particles_05um is not null or particles_10um is not null)
GROUP BY 1
ORDER BY 1
```

<LineChart
  data={particle_counts}
  x=hour
  y={["0.3μm", "0.5μm", "1.0μm"]}
  title="Particle Counts - Small Particles"
  yAxisTitle="Particles per 0.1L of air"
  xFmt="MMM dd, HH:mm"
/>

```sql large_particle_counts
-- Get hourly large particle counts with adjusted date range
SELECT
  date_trunc('hour', timestamp) as hour,
  round(avg(particles_25um)) as "2.5μm",
  round(avg(particles_50um)) as "5.0μm",
  round(avg(particles_100um)) as "10.0μm"
FROM station_01
WHERE
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  and (particles_25um is not null or particles_50um is not null or particles_100um is not null)
GROUP BY 1
ORDER BY 1
```

<LineChart
  data={large_particle_counts}
  x=hour
  y={["2.5μm", "5.0μm", "10.0μm"]}
  title="Particle Counts - Large Particles"
  yAxisTitle="Particles per 0.1L of air"
  xFmt="MMM dd, HH:mm"
/>

## Daily Average Trends

```sql daily_pm
-- Daily average PM data with adjusted date range
select
  date_trunc('day', timestamp) as day,
  round(avg(pm1), 1) as pm1,
  round(avg(pm2_5), 1) as pm2_5,
  round(avg(pm10), 1) as pm10
from station_01
where 
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  and (pm1 is not null or pm2_5 is not null or pm10 is not null)
group by 1
order by 1
```

<LineChart 
  data={daily_pm}
  x=day
  y={["pm1", "pm2_5", "pm10"]}
  title="Daily Average Particulate Matter"
  yAxisTitle="Concentration (micrograms/m³)"
  xFmt="MMM dd, HH:mm"
/>

## 24-Hour Mean Analysis & Air Quality Insights

```sql pm_24hr_mean
-- Calculate 24-hour rolling mean for PM metrics
SELECT
  date_trunc('hour', timestamp) as hour,
  round(avg(pm1) OVER (
    ORDER BY date_trunc('hour', timestamp)
    ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
  ), 1) as pm1_24hr_mean,
  round(avg(pm2_5) OVER (
    ORDER BY date_trunc('hour', timestamp)
    ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
  ), 1) as pm2_5_24hr_mean,
  round(avg(pm10) OVER (
    ORDER BY date_trunc('hour', timestamp)
    ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
  ), 1) as pm10_24hr_mean
FROM (
  SELECT
    date_trunc('hour', timestamp) as timestamp,
    avg(pm1) as pm1,
    avg(pm2_5) as pm2_5,
    avg(pm10) as pm10
  FROM station_01
  WHERE 
    timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
    and (pm1 is not null or pm2_5 is not null or pm10 is not null)
  GROUP BY date_trunc('hour', timestamp)
) AS hourly_data
WHERE hour >= (SELECT date_trunc('hour', min(timestamp)) + INTERVAL '23 hours' FROM station_01)
ORDER BY hour
```

<LineChart 
  data={pm_24hr_mean}
  x=hour
  y={["pm1_24hr_mean", "pm2_5_24hr_mean", "pm10_24hr_mean"]}
  title="24-Hour Rolling Mean of Particulate Matter"
  subtitle="Each point represents the average over the preceding 24 hours"
  yAxisTitle="Concentration (micrograms/m³)"
  xFmt="MMM dd, HH:mm"
>
  <ReferenceArea yMin={0} yMax={12} color="positive" label="Good (PM2.5)" opacity={0.1} labelPosition="right"/>
  <ReferenceArea yMin={12} yMax={35.4} color="warning" label="Moderate (PM2.5)" opacity={0.1} labelPosition="right"/>
  <ReferenceArea yMin={35.4} yMax={55.4} color="negative" label="Unhealthy for Sensitive Groups (PM2.5)" opacity={0.1} labelPosition="right"/>
  
  <ReferenceLine y={15} label="WHO PM2.5 Guideline (15 micrograms/m³)" color="warning" lineType="dashed"/>
  <ReferenceLine y={45} label="WHO PM10 Guideline (45 micrograms/m³)" color="negative" lineType="dashed"/>
</LineChart>

```sql hourly_pattern
-- Calculate average PM levels by hour of day
SELECT
  date_part('hour', timestamp) as hour_of_day,
  round(avg(pm1), 1) as avg_pm1,
  round(avg(pm2_5), 1) as avg_pm2_5,
  round(avg(pm10), 1) as avg_pm10
FROM station_01
WHERE
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  AND (pm1 IS NOT NULL OR pm2_5 IS NOT NULL OR pm10 IS NOT NULL)
GROUP BY hour_of_day
ORDER BY hour_of_day
```

<LineChart
  data={hourly_pattern}
  x=hour_of_day
  y={["avg_pm1", "avg_pm2_5", "avg_pm10"]}
  title="Average PM Levels by Hour of Day"
  subtitle="Shows when particulate matter tends to be highest and lowest"
  yAxisTitle="Concentration (micrograms/m³)"
  xAxisTitle="Hour of Day (24h)"
  xFmt="MMM dd, HH:mm"
>
  <ReferenceArea yMin=0 yMax=12 color="positive" label="Good (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=12 yMax=35.4 color="warning" label="Moderate (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=35.4 yMax=55.4 color="negative" label="Unhealthy for Sensitive Groups (PM2.5)" opacity=0.1 labelPosition="right"/>
</LineChart>

<Details title='Understanding Particulate Matter and Air Quality'>
  ## Particulate Matter Explained
  
  - **PM1**: Ultra-fine particles (diameter less than 1 micrometer) that can penetrate deep into lungs and potentially enter bloodstream
  - **PM2.5**: Fine inhalable particles (diameter less than 2.5 micrometers) that pose the greatest health risks
  - **PM10**: Coarse inhalable particles (diameter less than 10 micrometers)
  
  ## Air Quality Guidelines
  
  The World Health Organization (WHO) guidelines for 24-hour mean concentrations:
  - **PM2.5**: 15 micrograms/m³ (2021 updated guideline)
  - **PM10**: 45 micrograms/m³ (2021 updated guideline)
  
  ## Health Impacts
  
  - **Good** (PM2.5 &le; 12 micrograms/m³): Little to no risk
  - **Moderate** (PM2.5 12-35.4 micrograms/m³): Unusually sensitive individuals may experience respiratory symptoms
  - **Unhealthy for Sensitive Groups** (PM2.5 35.5-55.4 micrograms/m³): People with respiratory or heart conditions, the elderly and children should limit prolonged outdoor exertion
  - **Unhealthy** (PM2.5 55.5-150.4 micrograms/m³): Everyone may begin to experience health effects; sensitive groups should avoid outdoor activity
  - **Very Unhealthy** and **Hazardous**: Health warnings of emergency conditions for the entire population
</Details>

## Daily Particulate Matter Calendar Views

```sql pm_daily_for_calendar
-- Get daily average PM values for the calendar heatmaps
SELECT
  date_trunc('day', timestamp)::date as day,
  round(avg(pm1), 1) as avg_pm1,
  round(avg(pm2_5), 1) as avg_pm2_5,
  round(avg(pm10), 1) as avg_pm10
FROM station_01
WHERE 
  timestamp::date between '${inputs.date_filter.start}'::date + interval '1 day' and ('${inputs.date_filter.end}'::date + INTERVAL '1 day')
  AND (pm1 IS NOT NULL OR pm2_5 IS NOT NULL OR pm10 IS NOT NULL)
GROUP BY day
ORDER BY day
```

### PM1 Daily Levels

<CalendarHeatmap 
  data={pm_daily_for_calendar}
  date=day
  value=avg_pm1
  title="Daily PM1 Levels"
  subtitle="Calendar view showing daily average PM1 concentrations"
  colorScale={[
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"],  // Good: Dark green to light green (0-10)
    ["rgb(255, 255, 0)", "rgb(255, 126, 0)"],  // Moderate to concerning: Yellow to orange (10-25)
    ["rgb(255, 0, 0)", "rgb(143, 63, 151)"]    // High to very high: Red to purple (25+)
  ]}
  min=0
  max=25
  valueFmt="0.0"
/>

### PM2.5 Daily Levels

<CalendarHeatmap 
  data={pm_daily_for_calendar}
  date=day
  value=avg_pm2_5
  title="Daily PM2.5 Levels"
  subtitle="Calendar view showing daily average PM2.5 concentrations"
  colorScale={[
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"],  // Good: Dark green to light green (0-12)
    ["rgb(255, 255, 0)", "rgb(255, 165, 0)"],  // Moderate: Yellow to orange (12-35.4)
    ["rgb(255, 0, 0)", "rgb(143, 63, 151)"]    // Unhealthy to Hazardous: Red to purple (35.4+)
  ]}
  min=0
  max=55.4
  valueFmt="0.0"
/>

### PM10 Daily Levels

<CalendarHeatmap 
  data={pm_daily_for_calendar}
  date=day
  value=avg_pm10
  title="Daily PM10 Levels"
  subtitle="Calendar view showing daily average PM10 concentrations"
  colorScale={[
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"],  // Good: Dark green to light green (0-54)
    ["rgb(255, 255, 0)", "rgb(255, 165, 0)"],  // Moderate: Yellow to orange (54-154)
    ["rgb(255, 0, 0)", "rgb(143, 63, 151)"]    // Unhealthy to Hazardous: Red to purple (154+)
  ]}
  min=0
  max=154
  valueFmt="0.0"
/>

<Details title='About PM Calendar Heatmaps'>
  These calendar visualizations show daily average particulate matter levels. Color intensity represents concentration levels according to established health guidelines:
  
  - **PM1**: 
    - Green: Good (0-10 micrograms/m³)
    - Yellow/Orange: Moderate to concerning (10-25 micrograms/m³)
    - Red/Purple: High to very high (above 25 micrograms/m³)
  
  - **PM2.5**: Based on EPA Air Quality Index categories
    - Green: Good (0-12 micrograms/m³)
    - Yellow/Orange: Moderate to Unhealthy for Sensitive Groups (12-35.4 micrograms/m³)
    - Red/Purple: Unhealthy and worse (above 35.4 micrograms/m³)
  
  - **PM10**: Based on EPA Air Quality Index categories
    - Green: Good (0-54 micrograms/m³)
    - Yellow/Orange: Moderate to Unhealthy for Sensitive Groups (54-154 micrograms/m³)
    - Red/Purple: Unhealthy and worse (above 154 micrograms/m³)
  
  Hover over each day to see the exact values. These visualizations help identify patterns and problematic days over time.
</Details>