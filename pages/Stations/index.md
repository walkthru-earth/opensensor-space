---
title: Stations
description: OpenSensor Network Stations
hide_title: true
---

## OpenSensor Network

```sql stations
-- Station registry from centralized source with dashboard links
SELECT
    station_id,
    station_name,
    sensor_type,
    latitude,
    longitude,
    station_type,
    storage_url,
    '/Stations/' || station_id || '/' AS dashboard_url
FROM station_registry
```

<PointMap
    data={stations}
    lat=latitude
    long=longitude
    pointName=station_name
    height=300
    startingZoom=4
/>

<DataTable
  data={stations}
  title="Registered Stations"
  columns={[
    { key: 'station_name', name: 'Name' },
    { key: 'sensor_type', name: 'Sensor Type' },
    { key: 'station_type', name: 'Environment' },
    { key: 'latitude', name: 'Lat' },
    { key: 'longitude', name: 'Long' },
    { key: 'dashboard_url', name: 'Dashboard', contentType: 'link' }
  ]}
  link=dashboard_url
/>

<Details title='Adding New Stations'>

To add a new station to the network:

1. Edit `sources/stations/station_registry.sql`
2. Add a new station using UNION ALL:

```sql
UNION ALL
SELECT
    'your-station-uuid-v7' AS station_id,
    'Your Station Name' AS station_name,
    'enviroplus' AS sensor_type,
    0.0 AS latitude,
    0.0 AS longitude,
    'Indoor' AS station_type,
    's3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=your-uuid/' AS storage_url
```

The dashboard pages will automatically work for any station in the registry using templated pages.

</Details>
