---
title: Particulate Matter
---

```sql station_info
SELECT * FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - Particulate Matter

<LastRefreshed/>

<Details title='About this dashboard'>

This dashboard shows particulate matter measurements from **{station_info[0].station_name}** using the PMS5003 sensor.

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
  presetRanges={['Last 7 Days', 'Last 30 Days', 'All Time']}
  defaultValue={'All Time'}
/>

## Particulate Matter Summary

```sql data_quality
-- Detect damaged PMS5003 readings in the selected range.
-- Signature: pm1 = pm25 = pm10 exactly (impossible, larger bins are supersets)
-- with nonzero value, or any channel above sensor rated range (1000 ug/m3).
select
  count(*) as total_rows,
  sum(case
    when (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
      or coalesce(pm25, 0) > 1000
      or coalesce(pm10, 0) > 1000
    then 1 else 0 end) as damaged_rows,
  round(100.0 * sum(case
    when (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
      or coalesce(pm25, 0) > 1000
      or coalesce(pm10, 0) > 1000
    then 1 else 0 end) / nullif(count(*), 0), 1) as damaged_pct,
  strftime(min(case
    when (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
      or coalesce(pm25, 0) > 1000
      or coalesce(pm10, 0) > 1000
    then timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp) end)::TIMESTAMP, '%Y-%m-%d %H:%M') as first_damaged,
  strftime(max(case
    when (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
      or coalesce(pm25, 0) > 1000
      or coalesce(pm10, 0) > 1000
    then timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp) end)::TIMESTAMP, '%Y-%m-%d %H:%M') as last_damaged
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (pm1 is not null or pm25 is not null or pm10 is not null)
```

{#if data_quality[0].damaged_rows > 0}
<Alert status="warning">

**Sensor fault detected.** {data_quality[0].damaged_rows} of {data_quality[0].total_rows} hourly readings in this range ({data_quality[0].damaged_pct}%) look damaged, PM1, PM2.5, and PM10 reporting identical values or pegged above the PMS5003 rated range of 1000 μg/m³. First flagged reading {data_quality[0].first_damaged}, last {data_quality[0].last_damaged}. These readings are excluded from the charts and averages below.

</Alert>
{/if}

```sql main_data
-- Get the base PM data we need, excluding damaged-sensor rows.
-- Damaged signature: pm1 = pm25 = pm10 exactly with nonzero value,
-- or any channel above PMS5003 rated range.
select
  timestamp,
  pm1,
  pm25,
  pm10
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (pm1 is not null or pm25 is not null or pm10 is not null)
  and not (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
  and coalesce(pm25, 0) <= 1000
  and coalesce(pm10, 0) <= 1000
```

```sql current_24hr_means
-- 24h mean tile: uses the last 24 hours of data actually present for this
-- station, independent of the page's date filter. AQI category is the WORST
-- sub-index across PM2.5 and PM10 (EPA 2024 breakpoints), matching how AQI
-- is officially reported.
WITH clean AS (
  SELECT timestamp, pm1, pm25, pm10
  FROM all_stations
  WHERE station_id = '${params.station}'
    AND NOT (pm1 = pm25 AND pm25 = pm10 AND pm25 > 0)
    AND coalesce(pm25, 0) <= 1000
    AND coalesce(pm10, 0) <= 1000
),
last24 AS (
  SELECT
    round(avg(pm1), 1) as pm1_mean,
    round(avg(pm25), 1) as pm25_mean,
    round(avg(pm10), 1) as pm10_mean
  FROM clean
  WHERE timestamp >= (SELECT max(timestamp) - INTERVAL '24 hours' FROM clean)
),
categories AS (
  SELECT
    *,
    CASE
      WHEN pm25_mean IS NULL THEN 0
      WHEN pm25_mean <= 9.0 THEN 1
      WHEN pm25_mean <= 35.4 THEN 2
      WHEN pm25_mean <= 55.4 THEN 3
      WHEN pm25_mean <= 125.4 THEN 4
      WHEN pm25_mean <= 225.4 THEN 5
      ELSE 6
    END as pm25_rank,
    CASE
      WHEN pm10_mean IS NULL THEN 0
      WHEN pm10_mean <= 54 THEN 1
      WHEN pm10_mean <= 154 THEN 2
      WHEN pm10_mean <= 254 THEN 3
      WHEN pm10_mean <= 354 THEN 4
      WHEN pm10_mean <= 424 THEN 5
      ELSE 6
    END as pm10_rank
  FROM last24
)
SELECT
  pm1_mean, pm25_mean, pm10_mean,
  coalesce(pm1_mean::varchar, '—') || ' μg/m³' as pm1_value,
  coalesce(pm25_mean::varchar, '—') || ' μg/m³' as pm25_value,
  coalesce(pm10_mean::varchar, '—') || ' μg/m³' as pm10_value,
  CASE
    WHEN pm25_mean <= 9.0 THEN 'bg-green-50'
    WHEN pm25_mean <= 35.4 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm25_bg_color,
  CASE
    WHEN pm10_mean <= 54 THEN 'bg-green-50'
    WHEN pm10_mean <= 154 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm10_bg_color,
  CASE
    WHEN pm1_mean <= 10 THEN 'bg-green-50'
    WHEN pm1_mean <= 25 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm1_bg_color,
  CASE greatest(pm25_rank, pm10_rank)
    WHEN 0 THEN 'Insufficient Data'
    WHEN 1 THEN 'Good'
    WHEN 2 THEN 'Moderate'
    WHEN 3 THEN 'Unhealthy for Sensitive Groups'
    WHEN 4 THEN 'Unhealthy'
    WHEN 5 THEN 'Very Unhealthy'
    ELSE 'Hazardous'
  END as air_quality_category,
  'Worst-of PM2.5 and PM10 over the last 24 h of data (EPA 2024 AQI)' as aqi_note,
  CASE greatest(pm25_rank, pm10_rank)
    WHEN 1 THEN 'bg-green-50'
    WHEN 2 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as aqi_bg_color
FROM categories
```

<BigValue
  data={current_24hr_means}
  value=air_quality_category
  title="Current Air Quality Index"
  subtitle=aqi_note
  backgroundColor=aqi_bg_color
/>

### Last 24 h of Data (Mean)

<Grid numCols={3}>
  <BigValue
    data={current_24hr_means}
    value=pm1_value
    title="PM1 mean"
    subtitle="Ultra-fine particles"
    backgroundColor=pm1_bg_color
  />

  <BigValue
    data={current_24hr_means}
    value=pm25_value
    title="PM2.5 mean"
    subtitle="Fine inhalable particles"
    backgroundColor=pm25_bg_color
  />

  <BigValue
    data={current_24hr_means}
    value=pm10_value
    title="PM10 mean"
    subtitle="Coarse inhalable particles"
    backgroundColor=pm10_bg_color
  />
</Grid>

<Details title="Understanding Particulate Matter Readings">

- **PM1**: ultra-fine particles (diameter less than 1 micrometer), can penetrate deep into lungs and potentially enter bloodstream.
- **PM2.5**: fine inhalable particles (under 2.5 micrometers), most relevant to health.
- **PM10**: coarse inhalable particles (under 10 micrometers).

### WHO 2021 Guidelines (24-hour mean)
- PM2.5: 15 μg/m³
- PM10: 45 μg/m³

### EPA 2024 AQI breakpoints (24-hour mean)
- PM2.5 Good 0 to 9.0, Moderate 9.1 to 35.4, USG 35.5 to 55.4, Unhealthy 55.5 to 125.4, Very Unhealthy 125.5 to 225.4, Hazardous above 225.4.
- PM10 Good 0 to 54, Moderate 55 to 154, USG 155 to 254, Unhealthy 255 to 354, Very Unhealthy 355 to 424, Hazardous above 424.

Lower values mean better air quality. The AQI tile above reports the worst sub-index across PM2.5 and PM10.

</Details>

## Particulate Matter Concentrations

```sql pm_hourly
-- Get hourly PM data with adjusted date range
select
  date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour,
  round(avg(pm1), 1) as pm1,
  round(avg(pm25), 1) as pm25,
  round(avg(pm10), 1) as pm10
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (pm1 is not null or pm25 is not null or pm10 is not null)
  and not (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
  and coalesce(pm25, 0) <= 1000
  and coalesce(pm10, 0) <= 1000
group by 1
order by 1
```

<LineChart
  data={pm_hourly}
  x=hour
  y={["pm1", "pm25", "pm10"]}
  title="Hourly Particulate Matter Concentrations"
  yAxisTitle="Concentration (micrograms/m³)"
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
  <ReferenceArea yMin=0 yMax=9 color="positive" label="Good (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=9 yMax=35.4 color="warning" label="Moderate (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=35.4 yMax=55.4 color="negative" label="USG (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=55.4 yMax=125.4 color="negative" label="Unhealthy (PM2.5)" opacity=0.15 labelPosition="right"/>
</LineChart>

## PM2.5 Distribution

<Histogram
  data={main_data}
  value=pm25
  title="Frequency of PM2.5 Levels"
  subtitle="Distribution of PM2.5 readings"
  binCount=25
  xAxisTitle="PM2.5 (μg/m³)"
/>

## Hourly Distribution Analysis

```sql pm_hourly_distribution
select
  extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour_of_day,
  min(pm25) as min,
  quantile_cont(pm25, 0.25) as first_quartile,
  median(pm25) as median,
  quantile_cont(pm25, 0.75) as third_quartile,
  max(pm25) as max
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and pm25 is not null
  and not (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
  and pm25 <= 1000
  and coalesce(pm10, 0) <= 1000
group by 1
order by 1
```

<BoxPlot
  data={pm_hourly_distribution}
  name=hour_of_day
  min=min
  intervalBottom=first_quartile
  midpoint=median
  intervalTop=third_quartile
  max=max
  title="Daily PM2.5 spread by hour of day"
  subtitle="Distribution is across days in the selected range, not within a single hour (all_stations is hourly-averaged)"
  xAxisTitle="Hour of day"
  yAxisTitle="PM2.5 (μg/m³)"
/>

## Particle Count by Size

```sql particle_counts
-- Get hourly particle counts with adjusted date range
SELECT
  date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour,
  round(avg(particles_03um)) as "0.3μm",
  round(avg(particles_05um)) as "0.5μm",
  round(avg(particles_10um)) as "1.0μm"
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (particles_03um is not null or particles_05um is not null or particles_10um is not null)
  and not (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
  and coalesce(pm25, 0) <= 1000
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
  echartsOptions={{
      dataZoom: {
          show: true,
          bottom: 10
      },
      grid: {
          bottom: 50
      }
  }}
/>

```sql large_particle_counts
-- Get hourly large particle counts with adjusted date range
SELECT
  date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour,
  round(avg(particles_25um)) as "2.5μm",
  round(avg(particles_50um)) as "5.0μm",
  round(avg(particles_100um)) as "10.0μm"
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (particles_25um is not null or particles_50um is not null or particles_100um is not null)
  and not (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
  and coalesce(pm25, 0) <= 1000
  and coalesce(pm10, 0) <= 1000
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
  echartsOptions={{
      dataZoom: {
          show: true,
          bottom: 10
      },
      grid: {
          bottom: 50
      }
  }}
/>

## Daily Average Trends

```sql daily_pm
-- Daily average PM data with adjusted date range
select
  date_trunc('day', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as day,
  round(avg(pm1), 1) as pm1,
  round(avg(pm25), 1) as pm25,
  round(avg(pm10), 1) as pm10
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (pm1 is not null or pm25 is not null or pm10 is not null)
  and not (pm1 = pm25 and pm25 = pm10 and pm25 > 0)
  and coalesce(pm25, 0) <= 1000
  and coalesce(pm10, 0) <= 1000
group by 1
order by 1
```

<LineChart
  data={daily_pm}
  x=day
  y={["pm1", "pm25", "pm10"]}
  title="Daily Average Particulate Matter"
  yAxisTitle="Concentration (micrograms/m³)"
  xFmt="MMM dd"
  echartsOptions={{
      dataZoom: {
          show: true,
          bottom: 10
      },
      grid: {
          bottom: 50
      }
  }}
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
  round(avg(pm25) OVER (
    ORDER BY date_trunc('hour', timestamp)
    ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
  ), 1) as pm25_24hr_mean,
  round(avg(pm10) OVER (
    ORDER BY date_trunc('hour', timestamp)
    ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
  ), 1) as pm10_24hr_mean
FROM (
  SELECT
    date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as timestamp,
    avg(pm1) as pm1,
    avg(pm25) as pm25,
    avg(pm10) as pm10
  FROM all_stations
  WHERE station_id = '${params.station}'
    AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
    and (pm1 is not null or pm25 is not null or pm10 is not null)
  GROUP BY date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp))
) AS hourly_data
WHERE hour >= (SELECT date_trunc('hour', min(timestamp)) + INTERVAL '23 hours' FROM all_stations WHERE station_id = '${params.station}')
ORDER BY hour
```

<LineChart
  data={pm_24hr_mean}
  x=hour
  y={["pm1_24hr_mean", "pm25_24hr_mean", "pm10_24hr_mean"]}
  title="24-Hour Rolling Mean of Particulate Matter"
  subtitle="Each point represents the average over the preceding 24 hours"
  yAxisTitle="Concentration (micrograms/m³)"
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
  <ReferenceArea yMin={0} yMax={9} color="positive" label="Good (PM2.5)" opacity={0.1} labelPosition="right"/>
  <ReferenceArea yMin={9} yMax={35.4} color="warning" label="Moderate (PM2.5)" opacity={0.1} labelPosition="right"/>
  <ReferenceArea yMin={35.4} yMax={55.4} color="negative" label="USG (PM2.5)" opacity={0.1} labelPosition="right"/>

  <ReferenceLine y={15} label="WHO PM2.5 guideline" color="warning" lineType="dashed"/>
  <ReferenceLine y={45} label="WHO PM10 guideline" color="negative" lineType="dashed"/>
</LineChart>

```sql hourly_pattern
-- Calculate average PM levels by hour of day
SELECT
  date_part('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour_of_day,
  round(avg(pm1), 1) as avg_pm1,
  round(avg(pm25), 1) as avg_pm25,
  round(avg(pm10), 1) as avg_pm10
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  AND (pm1 IS NOT NULL OR pm25 IS NOT NULL OR pm10 IS NOT NULL)
  AND NOT (pm1 = pm25 AND pm25 = pm10 AND pm25 > 0)
  AND coalesce(pm25, 0) <= 1000
  AND coalesce(pm10, 0) <= 1000
GROUP BY hour_of_day
ORDER BY hour_of_day
```

<LineChart
  data={hourly_pattern}
  x=hour_of_day
  y={["avg_pm1", "avg_pm25", "avg_pm10"]}
  title="Average PM Levels by Hour of Day"
  subtitle="Shows when particulate matter tends to be highest and lowest"
  yAxisTitle="Concentration (micrograms/m³)"
  xAxisTitle="Hour of Day (24h)"
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
  <ReferenceArea yMin=0 yMax=9 color="positive" label="Good (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=9 yMax=35.4 color="warning" label="Moderate (PM2.5)" opacity=0.1 labelPosition="right"/>
  <ReferenceArea yMin=35.4 yMax=55.4 color="negative" label="USG (PM2.5)" opacity=0.1 labelPosition="right"/>
</LineChart>

<Details title='Understanding Particulate Matter and Air Quality'>

## Particulate Matter Explained

- **PM1**: Ultra-fine particles (diameter less than 1 micrometer) that can penetrate deep into lungs and potentially enter bloodstream
- **PM2.5**: Fine inhalable particles (diameter less than 2.5 micrometers) that pose the greatest health risks
- **PM10**: Coarse inhalable particles (diameter less than 10 micrometers)

## Air Quality Guidelines

WHO 2021 24-hour mean guidelines:
- **PM2.5**: 15 μg/m³
- **PM10**: 45 μg/m³

## Health Impacts (EPA 2024 AQI, PM2.5)

- **Good** (0 to 9 μg/m³): little to no risk.
- **Moderate** (9.1 to 35.4): unusually sensitive individuals may notice symptoms.
- **Unhealthy for Sensitive Groups** (35.5 to 55.4): people with respiratory or heart conditions, elderly, and children should limit prolonged outdoor exertion.
- **Unhealthy** (55.5 to 125.4): everyone may experience health effects; sensitive groups should avoid outdoor activity.
- **Very Unhealthy** (125.5 to 225.4) and **Hazardous** (above 225.4): emergency conditions for the entire population.

</Details>

## Daily Particulate Matter Calendar Views

```sql pm_daily_for_calendar
-- Get daily average PM values for the calendar heatmaps
SELECT
  strftime(date_trunc('day', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)), '%Y-%m-%d') as day,
  round(avg(pm1), 1) as avg_pm1,
  round(avg(pm25), 1) as avg_pm25,
  round(avg(pm10), 1) as avg_pm10
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  AND (pm1 IS NOT NULL OR pm25 IS NOT NULL OR pm10 IS NOT NULL)
  AND NOT (pm1 = pm25 AND pm25 = pm10 AND pm25 > 0)
  AND coalesce(pm25, 0) <= 1000
  AND coalesce(pm10, 0) <= 1000
GROUP BY day
ORDER BY day
```

### PM1 Daily Levels

<CalendarHeatmap
  data={pm_daily_for_calendar}
  date=day
  value=avg_pm1
  title="Daily PM1 Levels"
  subtitle="Daily average PM1 concentrations (no official AQI, uses PM2.5-style thresholds)"
  colorScale={[
    ["rgb(0, 228, 0)", "rgb(144, 238, 144)"],
    ["rgb(255, 255, 0)", "rgb(255, 220, 0)"],
    ["rgb(255, 126, 0)", "rgb(255, 90, 0)"],
    ["rgb(255, 0, 0)", "rgb(180, 0, 0)"]
  ]}
  min=0
  max=55
  valueFmt="0.0"
/>

### PM2.5 Daily Levels

<CalendarHeatmap
  data={pm_daily_for_calendar}
  date=day
  value=avg_pm25
  title="Daily PM2.5 Levels"
  subtitle="Calendar view showing daily average PM2.5 concentrations"
  colorScale={[
    ["rgb(0, 228, 0)", "rgb(144, 238, 144)"],
    ["rgb(255, 255, 0)", "rgb(255, 220, 0)"],
    ["rgb(255, 126, 0)", "rgb(255, 90, 0)"],
    ["rgb(255, 0, 0)", "rgb(180, 0, 0)"],
    ["rgb(143, 63, 151)", "rgb(100, 30, 120)"]
  ]}
  min=0
  max=125
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
    ["rgb(0, 228, 0)", "rgb(144, 238, 144)"],
    ["rgb(255, 255, 0)", "rgb(255, 220, 0)"],
    ["rgb(255, 126, 0)", "rgb(255, 90, 0)"],
    ["rgb(255, 0, 0)", "rgb(180, 0, 0)"],
    ["rgb(143, 63, 151)", "rgb(100, 30, 120)"]
  ]}
  min=0
  max=354
  valueFmt="0.0"
/>

<Details title='About PM Calendar Heatmaps'>

These calendar visualizations show daily average particulate matter levels. Color intensity represents concentration levels according to established health guidelines:

**PM1** (no official AQI, uses PM2.5-style thresholds):
- Green: Good (0 to 10 μg/m³)
- Yellow: Moderate (10 to 25)
- Orange: Concerning (25 to 35)
- Red: High (above 35)

**PM2.5** (EPA 2024 AQI breaks, 24-hour mean):
- Green: Good (0 to 9 μg/m³)
- Yellow: Moderate (9.1 to 35.4)
- Orange: Unhealthy for Sensitive Groups (35.5 to 55.4)
- Red: Unhealthy (55.5 to 125.4)
- Purple: Very Unhealthy and Hazardous (above 125.4)

**PM10** (EPA 2024 AQI breaks, 24-hour mean):
- Green: Good (0 to 54)
- Yellow: Moderate (55 to 154)
- Orange: Unhealthy for Sensitive Groups (155 to 254)
- Red: Unhealthy (255 to 354)
- Purple: Very Unhealthy and Hazardous (above 354)

Hover over each day to see the exact values. These visualizations help identify patterns and problematic days over time.

</Details>
