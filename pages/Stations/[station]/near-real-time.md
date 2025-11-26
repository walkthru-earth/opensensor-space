---
title: Near Real-Time Weather Data
hide_title: true
---

```sql station_info
SELECT
  *,
  -- Build the real-time parquet URL using DuckDB date functions
  replace(replace(storage_url, 's3://', 'https://'), 'opendata.source.coop/', 'opendata.source.coop.s3.amazonaws.com/')
    || 'year=' || year(current_timestamp AT TIME ZONE 'UTC')
    || '/month=' || lpad(month(current_timestamp AT TIME ZONE 'UTC')::varchar, 2, '0')
    || '/day=' || lpad(day(current_timestamp AT TIME ZONE 'UTC')::varchar, 2, '0')
    || '/data_' || lpad(hour(current_timestamp AT TIME ZONE 'UTC')::varchar, 2, '0')
    || lpad((floor((minute(current_timestamp AT TIME ZONE 'UTC') - 1) / 15) * 15)::int::varchar, 2, '0')
    || '.parquet' as realtime_parquet_url
FROM station_registry
WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - Near Real-Time

<LastRefreshed/>

```sql last_reading
SELECT max(timestamp) as last_reading_time
FROM read_parquet('${station_info[0].realtime_parquet_url}')
```

<Alert status="info">
  Last reading: <strong>{last_reading[0].last_reading_time}</strong>
</Alert>

<Details title='About this dashboard'>

This dashboard shows near real-time weather data from **{station_info[0].station_name}**. All metrics represent averages from the last 15 minutes of data collection.

- **Location**: {station_info[0].latitude}, {station_info[0].longitude}
- **Sensor Type**: {station_info[0].sensor_type}
- **Environment**: {station_info[0].station_type}

</Details>

## Real-Time Summary

```sql station_data
SELECT
  -- Temperature metrics
  AVG(temperature) as avg_temp,
  MIN(temperature) as min_temp,
  MAX(temperature) as max_temp,

  -- Humidity metrics
  AVG(humidity) as avg_humidity,
  MIN(humidity) as min_humidity,
  MAX(humidity) as max_humidity,

  -- Pressure metrics
  AVG(pressure) as avg_pressure,
  MIN(pressure) as min_pressure,
  MAX(pressure) as max_pressure,

  -- Air quality metrics
  AVG(oxidised) as avg_oxidised,
  MIN(oxidised) as min_oxidised,
  MAX(oxidised) as max_oxidised,
  AVG(reducing) as avg_reducing,
  MIN(reducing) as min_reducing,
  MAX(reducing) as max_reducing,
  AVG(nh3) as avg_nh3,
  MIN(nh3) as min_nh3,
  MAX(nh3) as max_nh3,

  -- Light metrics
  AVG(lux) as avg_lux,
  MAX(lux) as max_lux,
  AVG(proximity) as avg_proximity,
  MAX(proximity) as max_proximity,

  -- Particulate matter metrics
  AVG(pm1) as avg_pm1,
  AVG(pm25) as avg_pm25,
  AVG(pm10) as avg_pm10,
  MAX(pm25) as max_pm25,

  -- Add calculated fields for color indicators
  CASE
    WHEN AVG(temperature) < 18 THEN 'bg-blue-50'
    WHEN AVG(temperature) > 25 THEN 'bg-red-50'
    ELSE 'bg-green-50'
  END as temp_bg_color,

  CASE
    WHEN AVG(humidity) < 30 THEN 'bg-yellow-50'
    WHEN AVG(humidity) > 60 THEN 'bg-blue-50'
    ELSE 'bg-green-50'
  END as humidity_bg_color,

  CASE
    WHEN AVG(pressure) < 1000 THEN 'bg-purple-50'
    WHEN AVG(pressure) > 1020 THEN 'bg-amber-50'
    ELSE 'bg-green-50'
  END as pressure_bg_color,

  CASE
    WHEN AVG(pm25) <= 12 THEN 'bg-green-50'
    WHEN AVG(pm25) <= 35.4 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm25_bg_color,

  CASE
    WHEN AVG(lux) < 50 THEN 'bg-gray-50'
    WHEN AVG(lux) < 500 THEN 'bg-yellow-50'
    ELSE 'bg-amber-50'
  END as lux_bg_color,

  CASE
    WHEN AVG(oxidised) < 50 THEN 'bg-red-50'
    WHEN AVG(oxidised) < 100 THEN 'bg-yellow-50'
    ELSE 'bg-green-50'
  END as oxidised_bg_color,

  CASE
    WHEN AVG(reducing) < 100 THEN 'bg-red-50'
    WHEN AVG(reducing) < 200 THEN 'bg-yellow-50'
    ELSE 'bg-green-50'
  END as reducing_bg_color,

  CASE
    WHEN AVG(nh3) < 10 THEN 'bg-red-50'
    WHEN AVG(nh3) < 100 THEN 'bg-yellow-50'
    ELSE 'bg-green-50'
  END as nh3_bg_color,

  CASE
    WHEN AVG(pm10) <= 20 THEN 'bg-green-50'
    WHEN AVG(pm10) <= 50 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm10_bg_color,

  CASE
    WHEN AVG(pm1) <= 10 THEN 'bg-green-50'
    WHEN AVG(pm1) <= 25 THEN 'bg-yellow-50'
    ELSE 'bg-red-50'
  END as pm1_bg_color
FROM read_parquet('${station_info[0].realtime_parquet_url}')

```

### Key Environmental Metrics

<Grid numCols={3}>
  <BigValue
    data={station_data}
    value=avg_temp
    title="Temperature (°C)"
    fmt="num1"
    subtitle="Optimal indoor: 20-25°C"
    backgroundColor=temp_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_humidity
    title="Humidity (%)"
    fmt="num1"
    subtitle="Optimal indoor: 40-50%"
    backgroundColor=humidity_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_pressure
    title="Pressure (hPa)"
    fmt="num1"
    subtitle="Standard: 1013.25 hPa"
    backgroundColor=pressure_bg_color
  />
</Grid>

### Air Quality Metrics

<Grid numCols={3}>
  <BigValue
    data={station_data}
    value=avg_pm25
    title="PM2.5 (μg/m³)"
    fmt="num1"
    subtitle="WHO guideline: <15 μg/m³"
    backgroundColor=pm25_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_pm10
    title="PM10 (μg/m³)"
    fmt="num1"
    subtitle="WHO guideline: <45 μg/m³"
    backgroundColor=pm10_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_pm1
    title="PM1.0 (μg/m³)"
    fmt="num1"
    subtitle="Ultrafine particles"
    backgroundColor=pm1_bg_color
  />
</Grid>

### Gas Sensor Readings

<Grid numCols={3}>
  <BigValue
    data={station_data}
    value=avg_oxidised
    title="Oxidised Gas (kΩ)"
    fmt="num1"
    subtitle="Lower = higher concentration"
    backgroundColor=oxidised_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_reducing
    title="Reducing Gas (kΩ)"
    fmt="num1"
    subtitle="Lower = higher concentration"
    backgroundColor=reducing_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_nh3
    title="Ammonia (kΩ)"
    fmt="num1"
    subtitle="Lower = higher concentration"
    backgroundColor=nh3_bg_color
  />
</Grid>

### Light and Proximity

<Grid numCols={2}>
  <BigValue
    data={station_data}
    value=avg_lux
    title="Light Level (lux)"
    fmt="num1"
    subtitle="Office: 300-500 lux"
    backgroundColor=lux_bg_color
  />
  <BigValue
    data={station_data}
    value=avg_proximity
    title="Proximity"
    fmt="num0"
    subtitle="Lower = closer objects"
  />
</Grid>

## Detailed Metrics

### Temperature Range

<Grid numCols={2}>
  <BigValue
    data={station_data}
    value=min_temp
    title="Minimum Temperature (°C)"
    fmt="num1"
    description="Lowest recorded temperature in the last 5 minutes"
  />
  <BigValue
    data={station_data}
    value=max_temp
    title="Maximum Temperature (°C)"
    fmt="num1"
    description="Highest recorded temperature in the last 5 minutes"
  />
</Grid>

### Particulate Matter Notes

<Details title='Understanding Air Quality Readings'>

- **PM1.0**: Ultrafine particles (diameter less than 1 micrometer) that can penetrate deep into lungs and potentially enter bloodstream
- **PM2.5**: Fine inhalable particles (diameter less than 2.5 micrometers) that pose the greatest health risks
- **PM10**: Coarse inhalable particles (diameter less than 10 micrometers)

### WHO Guidelines (24-hour mean)
- PM2.5: 15 μg/m³
- PM10: 45 μg/m³

Lower values indicate better air quality.

</Details>

### Gas Sensor Notes

<Details title='Understanding Gas Sensor Readings'>

For gas sensors, lower resistance values (kΩ) typically indicate higher gas concentrations:

- **Oxidised gases**: Primarily measures nitrogen dioxide (NO2) and ozone (O3)
- **Reducing gases**: Primarily measures carbon monoxide (CO) and volatile organic compounds (VOCs)
- **NH3**: Measures ammonia concentration

Typical alert thresholds:
- Oxidised gases: Below 50 kΩ may indicate elevated NO2 or O3
- Reducing gases: Below 100 kΩ may indicate elevated CO or VOCs
- NH3: Below 10 kΩ may indicate elevated ammonia levels

</Details>
