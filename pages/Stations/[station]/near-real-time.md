---
title: Near Real-Time Weather Data
hide_title: true
---

```sql station_info
SELECT * FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - Near Real-Time

<LastRefreshed/>

<Details title='About this dashboard'>

This dashboard shows near real-time weather data from **{station_info[0].station_name}**. Data updates every 15 minutes.

**Location:** {station_info[0].latitude}, {station_info[0].longitude} | **Sensor:** {station_info[0].sensor_type} | **Environment:** {station_info[0].station_type}

</Details>

```sql raw_data
SELECT
  timestamp,
  temperature,
  humidity,
  pressure,
  oxidised,
  reducing,
  nh3,
  lux,
  proximity,
  pm1,
  pm25,
  pm10
FROM read_parquet('https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=${params.station}/year=${new Date().getUTCFullYear()}/month=${String(new Date().getUTCMonth() + 1).padStart(2, "0")}/day=${String(new Date().getUTCDate()).padStart(2, "0")}/data_${String(new Date().getUTCHours()).padStart(2, "0")}${String((m => m < 15 ? 0 : Math.floor(m / 15) * 15)(new Date().getUTCMinutes())).padStart(2, "0")}.parquet')
ORDER BY timestamp
```

```sql station_data
SELECT
  max(timestamp) as last_reading_time,
  round(AVG(temperature), 1) as avg_temp,
  round(MIN(temperature), 1) as min_temp,
  round(MAX(temperature), 1) as max_temp,
  round(AVG(humidity), 1) as avg_humidity,
  round(AVG(pressure), 1) as avg_pressure,
  round(AVG(oxidised), 1) as avg_oxidised,
  round(AVG(reducing), 1) as avg_reducing,
  round(AVG(nh3), 1) as avg_nh3,
  round(AVG(lux), 1) as avg_lux,
  round(AVG(proximity), 0) as avg_proximity,
  round(AVG(pm1), 1) as avg_pm1,
  round(AVG(pm25), 1) as avg_pm25,
  round(AVG(pm10), 1) as avg_pm10
FROM ${raw_data}
```

```sql minute_data
SELECT
  date_trunc('minute', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as minute,
  round(AVG(temperature), 1) as temperature,
  round(AVG(humidity), 1) as humidity,
  round(AVG(pressure), 1) as pressure,
  round(AVG(oxidised), 1) as oxidised,
  round(AVG(reducing), 1) as reducing,
  round(AVG(nh3), 1) as nh3,
  round(AVG(lux), 1) as lux,
  round(AVG(proximity), 0) as proximity,
  round(AVG(pm1), 1) as pm1,
  round(AVG(pm25), 1) as pm25,
  round(AVG(pm10), 1) as pm10
FROM ${raw_data}
GROUP BY 1
ORDER BY minute
```

{#if raw_data.length > 0}

<Alert status="info">
  Last reading: <strong>{station_data[0].last_reading_time}</strong>
</Alert>

<Tabs>
  <Tab label="Environment">

  <Grid cols=3>
    <BigValue
      data={raw_data}
      value=temperature
      title="Temperature (°C)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="Optimal indoor: 20-25°C"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=humidity
      title="Humidity (%)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="Optimal indoor: 40-50%"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=pressure
      title="Pressure (hPa)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="Standard: 1013.25 hPa"
      emptySet="pass"
      emptyMessage="No data"
    />
  </Grid>

  <Grid cols=2>
    <BigValue data={station_data} value=min_temp title="Min Temp (°C)" fmt="num1" emptySet="pass" emptyMessage="No data" />
    <BigValue data={station_data} value=max_temp title="Max Temp (°C)" fmt="num1" emptySet="pass" emptyMessage="No data" />
  </Grid>

  <LineChart
    data={minute_data}
    x=minute
    y={['temperature', 'humidity']}
    title="Temperature & Humidity (1-min avg)"
    xFmt="HH:mm"
    chartAreaHeight=200
    emptySet="pass"
    emptyMessage="No data available"
  />

  </Tab>

  <Tab label="Air Quality">

  <Grid cols=3>
    <BigValue
      data={raw_data}
      value=pm25
      title="PM2.5 (μg/m³)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="WHO guideline: under 15 μg/m³"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=pm10
      title="PM10 (μg/m³)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="WHO guideline: under 45 μg/m³"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=pm1
      title="PM1.0 (μg/m³)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="Ultrafine particles"
      emptySet="pass"
      emptyMessage="No data"
    />
  </Grid>

  <LineChart
    data={minute_data}
    x=minute
    y={['pm1', 'pm25', 'pm10']}
    title="Particulate Matter (1-min avg)"
    xFmt="HH:mm"
    chartAreaHeight=200
    emptySet="pass"
    emptyMessage="No data available"
  />

  </Tab>

  <Tab label="Gas Sensors">

  <Grid cols=3>
    <BigValue
      data={raw_data}
      value=oxidised
      title="Oxidised (kΩ)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="NO2, O3 - Lower = higher"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=reducing
      title="Reducing (kΩ)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="CO, VOCs - Lower = higher"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=nh3
      title="Ammonia (kΩ)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="NH3 - Lower = higher"
      emptySet="pass"
      emptyMessage="No data"
    />
  </Grid>

  <LineChart
    data={minute_data}
    x=minute
    y={['oxidised', 'reducing', 'nh3']}
    title="Gas Sensors (1-min avg)"
    xFmt="HH:mm"
    chartAreaHeight=200
    emptySet="pass"
    emptyMessage="No data available"
  />

  </Tab>

  <Tab label="Light">

  <Grid cols=2>
    <BigValue
      data={raw_data}
      value=lux
      title="Light (lux)"
      fmt="num1"
      sparkline=timestamp
      sparklineType=area
      description="Office: 300-500 lux"
      emptySet="pass"
      emptyMessage="No data"
    />
    <BigValue
      data={raw_data}
      value=proximity
      title="Proximity"
      fmt="num0"
      sparkline=timestamp
      sparklineType=area
      description="Lower = closer objects"
      emptySet="pass"
      emptyMessage="No data"
    />
  </Grid>

  <LineChart
    data={minute_data}
    x=minute
    y={['lux', 'proximity']}
    title="Light & Proximity (1-min avg)"
    xFmt="HH:mm"
    chartAreaHeight=200
    emptySet="pass"
    emptyMessage="No data available"
  />

  </Tab>
</Tabs>

<Details title='Understanding Sensor Readings'>

**Air Quality (PM):** PM1.0, PM2.5, PM10 measure particle sizes in μg/m³. WHO guidelines: PM2.5 under 15, PM10 under 45.

**Gas Sensors:** Lower resistance (kΩ) = higher concentration. Oxidised measures NO2/O3, Reducing measures CO/VOCs, NH3 measures ammonia.

</Details>

{:else}

<Alert status="warning">
  No sensor data available for this station in the current time window. Data updates every 15 minutes.
</Alert>

{/if}

## Station Location

```sql station_location
SELECT
  station_name,
  latitude,
  longitude,
  sensor_type as "Sensor Type",
  station_type as Environment,
  description as Description
FROM station_registry
WHERE station_id = '${params.station}'
```

<PointMap
    data={station_location}
    lat=latitude
    long=longitude
    pointName=station_name
    height=300
    startingZoom=13
    tooltip={[
        {id: 'Sensor Type'},
        {id: 'Environment'},
        {id: 'Description'}
    ]}
/>
