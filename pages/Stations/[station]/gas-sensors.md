---
title: Gas Sensor Readings
---

```sql station_info
SELECT * FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - Gas Sensors

<LastRefreshed/>

<Details title='About this dashboard'>

This dashboard analyzes gas sensor readings (Oxidised, Reducing, NH3) from **{station_info[0].station_name}**. Units are kΩ (kiloohms), representing MICS-6814 sensor resistance.

**Important interpretation guidelines:**
- Lower resistance values often indicate higher gas concentrations.
- Each gas sensor has different sensitivity characteristics.
- Sudden changes in readings may indicate environmental events.
- MICS-6814 baselines drift per device and per install, so the absolute thresholds on this page are rough guidance only. Comparing a day against this station's own baseline tells you more than any fixed kΩ threshold.

**Station Info:**
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

## Gas Sensor Readings Summary

```sql data_quality
-- Detect damaged MICS-6814 readings in the selected range.
-- Signature: negative resistance (impossible) or above ~10,000 kΩ
-- (open-circuit / saturation; even heavily aged sensors stay well below).
select
  count(*) as total_rows,
  sum(case
    when oxidised < 0 or oxidised > 10000
      or reducing < 0 or reducing > 10000
      or nh3 < 0 or nh3 > 10000
    then 1 else 0 end) as damaged_rows,
  round(100.0 * sum(case
    when oxidised < 0 or oxidised > 10000
      or reducing < 0 or reducing > 10000
      or nh3 < 0 or nh3 > 10000
    then 1 else 0 end) / nullif(count(*), 0), 1) as damaged_pct,
  strftime(min(case
    when oxidised < 0 or oxidised > 10000
      or reducing < 0 or reducing > 10000
      or nh3 < 0 or nh3 > 10000
    then timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp) end)::TIMESTAMP, '%Y-%m-%d %H:%M') as first_damaged,
  strftime(max(case
    when oxidised < 0 or oxidised > 10000
      or reducing < 0 or reducing > 10000
      or nh3 < 0 or nh3 > 10000
    then timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp) end)::TIMESTAMP, '%Y-%m-%d %H:%M') as last_damaged
from all_stations
where station_id = '${params.station}'
  and timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  and (oxidised is not null or reducing is not null or nh3 is not null)
```

{#if data_quality[0].damaged_rows > 0}
<Alert status="warning">

**Gas sensor fault detected.** {data_quality[0].damaged_rows} of {data_quality[0].total_rows} hourly readings in this range ({data_quality[0].damaged_pct}%) look damaged, MICS-6814 resistance came back negative or pegged above the usable range (10,000 kΩ). First flagged reading {data_quality[0].first_damaged}, last {data_quality[0].last_damaged}. These readings are excluded from the charts and averages below.

</Alert>
{/if}

```sql main_data
-- Get all the base gas sensor data we need, filtering out damaged rows.
-- Damaged signature: any MICS-6814 channel below 0 or above 10,000 kΩ.
select
  timestamp,
  oxidised,
  reducing,
  nh3
from all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  AND coalesce(oxidised, 0) between 0 and 10000
  AND coalesce(reducing, 0) between 0 and 10000
  AND coalesce(nh3, 0) between 0 and 10000
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
  -- concat_ws returns '' for NULL args, preventing the tile from going blank
  -- when a sensor stream is missing.
  concat_ws(' ', coalesce(min_oxidised::varchar, '—'), '-', coalesce(max_oxidised::varchar, '—'), 'kΩ') as oxidised_range,
  'Avg: ' || coalesce(avg_oxidised::varchar, '—') || ' kΩ' as oxidised_avg,
  concat_ws(' ', coalesce(min_reducing::varchar, '—'), '-', coalesce(max_reducing::varchar, '—'), 'kΩ') as reducing_range,
  'Avg: ' || coalesce(avg_reducing::varchar, '—') || ' kΩ' as reducing_avg,
  concat_ws(' ', coalesce(min_nh3::varchar, '—'), '-', coalesce(max_nh3::varchar, '—'), 'kΩ') as nh3_range,
  'Avg: ' || coalesce(avg_nh3::varchar, '—') || ' kΩ' as nh3_avg,
  -- Threshold colors below use rough published guidance for MICS-6814.
  -- Sensor baselines drift per device and install, so treat absolute kΩ
  -- thresholds as station-specific hints, not calibrated alerts.
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
  extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour_of_day,
  round(avg(oxidised), 1) as oxidised,
  round(avg(reducing), 1) as reducing,
  round(avg(nh3), 1) as nh3
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  AND coalesce(oxidised, 0) between 0 and 10000
  AND coalesce(reducing, 0) between 0 and 10000
  AND coalesce(nh3, 0) between 0 and 10000
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
- Daily patterns may correlate with human activities (cooking, cleaning), HVAC operation cycles, and outdoor air pollution patterns

Lower resistance values (kΩ) generally indicate higher gas concentrations.

</Details>

## Time Series Analysis

```sql time_series_data
-- all_stations is already hourly-averaged, so select directly.
SELECT timestamp, oxidised as value, 'Oxidised' as gas_type FROM ${main_data}
UNION ALL
SELECT timestamp, reducing as value, 'Reducing' as gas_type FROM ${main_data}
UNION ALL
SELECT timestamp, nh3 as value, 'NH3' as gas_type FROM ${main_data}
ORDER BY timestamp, gas_type
```

<LineChart
  data={time_series_data}
  x=timestamp
  y=value
  series=gas_type
  title="Gas Sensor Readings Over Time"
  subtitle="Hourly averages across the selected date range"
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

This chart plots one point per hour from the aggregated registry.

- Lower resistance values (kΩ) indicate higher gas concentrations.
- Reference lines are rough guidance only; MICS-6814 baselines drift per device and per install, so "concerning" values vary by station. Compare a day to this station's own baseline rather than to absolute thresholds.

Use the zoom control at the bottom to focus on specific time periods of interest.

</Details>

## Gas Correlation Analysis

```sql gas_correlation
-- Get data for the gas correlation scatter plots
SELECT
  date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour,
  extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as hour_of_day,
  round(avg(oxidised), 1) as oxidised,
  round(avg(reducing), 1) as reducing,
  round(avg(nh3), 1) as nh3,
  -- Add time of day categories for better analysis
  CASE
    WHEN extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) >= 6 AND extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) < 12 THEN 'Morning (6-12)'
    WHEN extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) >= 12 AND extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) < 18 THEN 'Afternoon (12-18)'
    WHEN extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) >= 18 AND extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) < 22 THEN 'Evening (18-22)'
    ELSE 'Night (22-6)'
  END as time_of_day
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  AND (oxidised IS NOT NULL OR reducing IS NOT NULL OR nh3 IS NOT NULL)
  AND coalesce(oxidised, 0) between 0 and 10000
  AND coalesce(reducing, 0) between 0 and 10000
  AND coalesce(nh3, 0) between 0 and 10000
GROUP BY
  date_trunc('hour', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)),
  extract('hour' from timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp))
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
- **Interpretation**: Points clustering along a diagonal line suggest gases that rise and fall together. Scattered points with no pattern suggest gases that behave independently. Clusters at different times of day may indicate activities that produce specific gas combinations.

Common patterns:
- Cooking activities: May show correlated rises in reducing gases and NH3
- Traffic pollution: May show rises in oxidised gases (NO2) with some CO (reducing)
- Cleaning products: Can cause spikes in various VOCs (reducing) and sometimes NH3

</Details>

## Daily Calendar Views

```sql daily_gas_for_calendar
-- Get daily average gas sensor readings for the calendar heatmaps
SELECT
  strftime(date_trunc('day', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)), '%Y-%m-%d') as day,
  round(avg(oxidised), 1) as avg_oxidised,
  round(avg(reducing), 1) as avg_reducing,
  round(avg(nh3), 1) as avg_nh3
FROM all_stations
WHERE station_id = '${params.station}'
  AND timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)::date between '${inputs.date_filter.start}'::date and '${inputs.date_filter.end}'::date + INTERVAL '1 day'
  AND (oxidised IS NOT NULL OR reducing IS NOT NULL OR nh3 IS NOT NULL)
  AND coalesce(oxidised, 0) between 0 and 10000
  AND coalesce(reducing, 0) between 0 and 10000
  AND coalesce(nh3, 0) between 0 and 10000
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
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]
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
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]
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
    ["rgb(255, 0, 0)", "rgb(255, 165, 0)"],
    ["rgb(255, 255, 0)", "rgb(173, 255, 47)"],
    ["rgb(0, 128, 0)", "rgb(144, 238, 144)"]
  ]}
  valueFmt="0.0"
  invertColorScale=true
/>

<Details title='About Gas Sensor Calendar Heatmaps'>

These calendar visualizations show daily average gas sensor readings in kiloohms (kΩ). For gas sensors, lower resistance values typically indicate higher gas concentrations:

**Color Scale** (for all gas sensors):
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
