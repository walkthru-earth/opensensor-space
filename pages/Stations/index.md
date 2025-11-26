---
title: Stations
description: OpenSensor Network Stations
hide_title: true
---

# OpenSensor Network

```sql stations
SELECT
    station_id,
    station_name,
    sensor_type,
    latitude,
    longitude,
    round(latitude, 4) as lat_display,
    round(longitude, 4) as long_display,
    station_type,
    storage_url,
    '/Stations/' || station_id || '/' AS dashboard_url,
    station_type as environment
FROM station_registry
```

```sql station_count
SELECT COUNT(*) as total FROM station_registry
```

<Grid cols=2>
  <BigValue
    data={station_count}
    value=total
    title="Total Stations"
    fmt="#,##0"
  />
  <BigValue
    data={stations}
    value=station_name
    title="Latest Station"
  />
</Grid>

## Station Map

<PointMap
    data={stations}
    lat=latitude
    long=longitude
    pointName=station_name
    height=500
    size=12
    opacity=0.9
    borderWidth=2
    borderColor=white
    value=environment
    colorPalette={['#93c5fd', '#86efac', '#c4b5fd', '#fcd34d', '#fca5a5']}
    legendType=categorical
    legendPosition=bottomLeft
    tooltip={[
      {id: 'station_name', title: 'Station'},
      {id: 'sensor_type', title: 'Sensor'},
      {id: 'station_type', title: 'Environment'},
      {id: 'latitude', title: 'Lat', fmt: '0.0000'},
      {id: 'longitude', title: 'Long', fmt: '0.0000'}
    ]}
    link=dashboard_url
/>

<Alert status="info">
  <strong>Want to add your station?</strong> Visit the <a href="/join-network">Join the Network</a> page for instructions on contributing your sensor data to OpenSensor.
</Alert>

<Alert status="note">
  Click on any point on the map or row in the table below to view detailed sensor readings.
</Alert>

## Registered Stations

<DataTable
  data={stations}
  rows=10
  link=dashboard_url
>
  <Column id=station_id title="Station ID" />
  <Column id=station_name title="Station" />
  <Column id=sensor_type title="Sensor" />
  <Column id=station_type title="Environment" />
</DataTable>

<Details title='Technical Details'>

Stations are registered in `sources/stations/stations.csv` and queried via `station_registry.sql`. Each station has:

- **UUID v7** - Time-ordered unique identifier
- **Sensor Type** - Hardware (e.g., enviroplus)
- **Storage URL** - S3 path to parquet data
- **Coordinates** - Latitude/Longitude

Data is stored as hive-partitioned Parquet files with the pattern: `station=ID/year=YYYY/month=MM/day=DD/data_HHMM.parquet`

</Details>
