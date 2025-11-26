---
title: Station Dashboard
hide_title: true
---

```sql station_info
SELECT * FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name}

<LastRefreshed/>

<Details title='Station Information'>

| Property | Value |
|----------|-------|
| **Station ID** | {station_info[0].station_id} |
| **Sensor Type** | {station_info[0].sensor_type} |
| **Environment** | {station_info[0].station_type} |
| **Location** | {station_info[0].latitude}, {station_info[0].longitude} |
| **Storage URL** | {station_info[0].storage_url} |

</Details>

## Quick Access

<div class="border rounded-lg p-5 my-3 mx-1 hover:shadow-lg transition bg-blue-50 dark:bg-blue-900/30">
    <a href="/Stations/{params.station}/near-real-time" class="flex items-center justify-between">
        <div>
            <h3 class="text-xl font-bold mb-2">Near Real-Time Dashboard</h3>
            <p class="text-sm">View the latest 15-minute weather readings</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
          <path d="M 272.8 51.2 L 275.2 61.6 L 272.8 51.2 L 275.2 61.6 L 334.4 346.4 L 334.4 346.4 L 372 239.2 L 372 239.2 L 375.2 230.4 L 375.2 230.4 L 384 230.4 L 512 230.4 L 512 256 L 512 256 L 499.2 256 L 392.8 256 L 351.2 375.2 L 351.2 375.2 L 348 384 L 348 384 L 339.2 384 L 316 384 L 313.6 373.6 L 313.6 373.6 L 256.8 99.2 L 256.8 99.2 L 198.4 450.4 L 198.4 450.4 L 196.8 460.8 L 196.8 460.8 L 185.6 460.8 L 162.4 460.8 L 160 450.4 L 160 450.4 L 117.6 256 L 117.6 256 L 12.8 256 L 0 256 L 0 230.4 L 0 230.4 L 12.8 230.4 L 138.4 230.4 L 140.8 240.8 L 140.8 240.8 L 178.4 413.6 L 178.4 413.6 L 236.8 61.6 L 236.8 61.6 L 238.4 51.2 L 238.4 51.2 L 249.6 51.2 L 272.8 51.2 Z"/>
        </svg>
    </a>
</div>

## Environmental Dashboards

<Grid cols=2>
    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-green-50 dark:bg-green-900/30">
        <a href="/Stations/{params.station}/temperature-and-humidity" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Temperature and Humidity</h3>
                <p class="text-xs mt-1">Temperature trends and humidity analysis</p>
            </div>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-amber-50 dark:bg-amber-900/30">
        <a href="/Stations/{params.station}/gas-sensors" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Gas Sensors</h3>
                <p class="text-xs mt-1">Oxidised, reducing, and NH3 measurements</p>
            </div>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-yellow-50 dark:bg-yellow-900/30">
        <a href="/Stations/{params.station}/light-and-proximity" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Light and Proximity</h3>
                <p class="text-xs mt-1">Ambient light levels and proximity detection</p>
            </div>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-purple-50 dark:bg-purple-900/30">
        <a href="/Stations/{params.station}/pressure" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Atmospheric Pressure</h3>
                <p class="text-xs mt-1">Barometric pressure trends and analysis</p>
            </div>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-red-50 dark:bg-red-900/30">
        <a href="/Stations/{params.station}/particulate-matter" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Particulate Matter</h3>
                <p class="text-xs mt-1">PM1.0, PM2.5, and PM10 air quality analysis</p>
            </div>
        </a>
    </div>
</Grid>

## Station Location

```sql station_location
SELECT
  station_name,
  latitude,
  longitude
FROM station_registry
WHERE station_id = '${params.station}'
```

<PointMap
    data={station_location}
    lat=latitude
    long=longitude
    pointName=station_name
    height=300
    startingZoom=10
/>
