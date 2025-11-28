---
sidebar_position: 1
title: opensensor.space
description: Cloud-native sensor data platform using Parquet and object storage - scalable from edge to dashboard for any IoT sensor
hide_title: false
---

<LastRefreshed/>

<Details title='About this platform'>
  Cloud-native sensor data platform. Edge devices stream data directly to object storage in Parquet format, visualized with Evidence.dev and DuckDB-wasm. No databases or backend servers required.
</Details>

<Image
    url="/icon-512.png"
    description="opensensor.space cloud-native architecture"
    width="300"
    height="300"
/>

## Quick Station Access

<div class="border rounded-lg p-5 my-3 mx-1 hover:shadow-lg transition bg-blue-50 dark:bg-blue-900/30">
    <a href="/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/near-real-time" class="flex items-center justify-between">
        <div>
            <h3 class="text-xl font-bold mb-2">Near Real-Time Dashboard</h3>
            <p class="text-sm">View the latest 15-minute weather readings</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
          <path d="M 272.8 51.2 L 275.2 61.6 L 272.8 51.2 L 275.2 61.6 L 334.4 346.4 L 334.4 346.4 L 372 239.2 L 372 239.2 L 375.2 230.4 L 375.2 230.4 L 384 230.4 L 512 230.4 L 512 256 L 512 256 L 499.2 256 L 392.8 256 L 351.2 375.2 L 351.2 375.2 L 348 384 L 348 384 L 339.2 384 L 316 384 L 313.6 373.6 L 313.6 373.6 L 256.8 99.2 L 256.8 99.2 L 198.4 450.4 L 198.4 450.4 L 196.8 460.8 L 196.8 460.8 L 185.6 460.8 L 162.4 460.8 L 160 450.4 L 160 450.4 L 117.6 256 L 117.6 256 L 12.8 256 L 0 256 L 0 230.4 L 0 230.4 L 12.8 230.4 L 138.4 230.4 L 140.8 240.8 L 140.8 240.8 L 178.4 413.6 L 178.4 413.6 L 236.8 61.6 L 236.8 61.6 L 238.4 51.2 L 238.4 51.2 L 249.6 51.2 L 272.8 51.2 Z"/>
        </svg>
    </a>
</div>

## Environmental Monitoring Dashboards

<Grid cols=2>
    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-green-50 dark:bg-green-900/30">
        <a href="/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/temperature-and-humidity" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Temperature and Humidity</h3>
                <p class="text-xs mt-1">Temperature trends and humidity analysis</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
                <path d="M 256 16 Q 229 17 211 35 L 211 35 L 211 35 Q 193 53 192 80 L 192 244 L 192 244 Q 191 257 181 264 Q 157 282 143 309 Q 128 336 128 368 Q 129 422 165 459 Q 202 495 256 496 Q 310 495 347 459 Q 383 422 384 368 Q 384 336 369 309 Q 355 282 331 264 Q 321 257 320 244 L 320 80 L 320 80 Q 319 53 301 35 Q 283 17 256 16 L 256 16 Z M 105 269 Q 96 294 96 320 Q 98 388 143 433 Q 189 478 256 480 Q 323 478 369 433 Q 414 388 416 320 Q 416 294 407 269 Q 359 138 256 43 Q 153 138 105 269 L 105 269 Z M 286 144 L 286 156 L 286 144 L 286 156 Q 286 169 295 179 L 346 231 L 346 231 Q 383 270 384 323 Q 383 376 347 411 Q 312 447 259 448 L 253 448 L 253 448 Q 200 447 165 411 Q 129 376 128 323 Q 129 272 171 243 L 184 235 L 184 235 L 209 219 L 209 219 L 209 248 L 209 248 L 209 294 L 209 294 Q 211 318 235 320 L 237 320 L 237 320 Q 259 318 261 297 Q 260 287 254 281 L 245 271 L 245 271 Q 220 245 220 208 Q 220 165 253 138 L 260 132 L 260 132 L 286 110 L 286 110 L 286 144 L 286 144 Z M 251 208 Q 252 232 268 249 L 277 258 L 277 258 Q 292 275 293 297 Q 292 320 276 336 Q 261 352 237 352 L 235 352 L 235 352 Q 210 351 194 335 Q 178 319 177 294 L 177 280 L 177 280 Q 160 298 160 323 Q 161 362 187 389 Q 214 415 253 416 L 259 416 L 259 416 Q 299 415 325 389 Q 351 363 352 323 Q 351 283 323 253 L 272 201 L 272 201 Q 263 192 258 180 Q 251 193 251 208 L 251 208 Z"/>
            </svg>
        </a>
    </div>
    
    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-amber-50 dark:bg-amber-900/30">
        <a href="/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/gas-sensors" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Gas Sensors</h3>
                <p class="text-xs mt-1">Oxidised, reducing, and NH3 measurements</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
              <path d="M 245 10 L 256 0 L 245 10 L 256 0 L 267 10 L 267 10 Q 384 112 437 258 Q 448 288 448 320 Q 446 401 391 456 Q 337 510 256 512 Q 175 510 121 456 Q 66 401 64 320 Q 64 288 75 258 Q 128 112 245 10 L 245 10 Z M 105 269 Q 96 294 96 320 Q 98 388 143 433 Q 189 478 256 480 Q 323 478 369 433 Q 414 388 416 320 Q 416 294 407 269 Q 359 138 256 43 Q 153 138 105 269 L 105 269 Z M 286 144 L 286 156 L 286 144 L 286 156 Q 286 169 295 179 L 346 231 L 346 231 Q 383 270 384 323 Q 383 376 347 411 Q 312 447 259 448 L 253 448 L 253 448 Q 200 447 165 411 Q 129 376 128 323 Q 129 272 171 243 L 184 235 L 184 235 L 209 219 L 209 219 L 209 248 L 209 248 L 209 294 L 209 294 Q 211 318 235 320 L 237 320 L 237 320 Q 259 318 261 297 Q 260 287 254 281 L 245 271 L 245 271 Q 220 245 220 208 Q 220 165 253 138 L 260 132 L 260 132 L 286 110 L 286 110 L 286 144 L 286 144 Z M 251 208 Q 252 232 268 249 L 277 258 L 277 258 Q 292 275 293 297 Q 292 320 276 336 Q 261 352 237 352 L 235 352 L 235 352 Q 210 351 194 335 Q 178 319 177 294 L 177 280 L 177 280 Q 160 298 160 323 Q 161 362 187 389 Q 214 415 253 416 L 259 416 L 259 416 Q 299 415 325 389 Q 351 363 352 323 Q 351 283 323 253 L 272 201 L 272 201 Q 263 192 258 180 Q 251 193 251 208 L 251 208 Z"/>
            </svg>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-yellow-50 dark:bg-yellow-900/30">
        <a href="/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/light-and-proximity" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Light and Proximity</h3>
                <p class="text-xs mt-1">Ambient light levels and proximity detection</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
              <path d="M 272 0 L 272 16 L 272 0 L 272 16 L 272 96 L 272 96 L 272 112 L 272 112 L 240 112 L 240 112 L 240 96 L 240 96 L 240 16 L 240 16 L 240 0 L 240 0 L 272 0 L 272 0 Z M 0 240 L 16 240 L 0 240 L 112 240 L 112 272 L 112 272 L 96 272 L 0 272 L 0 240 L 0 240 Z M 400 240 L 416 240 L 400 240 L 512 240 L 512 272 L 512 272 L 496 272 L 400 272 L 400 240 L 400 240 Z M 272 400 L 272 416 L 272 400 L 272 416 L 272 496 L 272 496 L 272 512 L 272 512 L 240 512 L 240 512 L 240 496 L 240 496 L 240 416 L 240 416 L 240 400 L 240 400 L 272 400 L 272 400 Z M 86 64 L 98 75 L 86 64 L 98 75 L 154 132 L 154 132 L 166 143 L 166 143 L 143 166 L 143 166 L 132 154 L 132 154 L 75 98 L 75 98 L 64 86 L 64 86 L 86 64 L 86 64 Z M 64 426 L 75 414 L 64 426 L 75 414 L 132 358 L 132 358 L 143 347 L 143 347 L 166 369 L 166 369 L 154 380 L 154 380 L 98 437 L 98 437 L 86 448 L 86 448 L 64 426 L 64 426 Z M 347 143 L 358 132 L 347 143 L 358 132 L 414 75 L 414 75 L 426 64 L 426 64 L 448 86 L 448 86 L 437 98 L 437 98 L 380 154 L 380 154 L 369 166 L 369 166 L 347 143 L 347 143 Z M 369 347 L 380 358 L 369 347 L 380 358 L 437 414 L 437 414 L 448 426 L 448 426 L 426 448 L 426 448 L 414 437 L 414 437 L 358 380 L 358 380 L 347 369 L 347 369 L 369 347 L 369 347 Z M 336 256 Q 335 211 296 187 Q 256 165 216 187 Q 177 211 176 256 Q 177 301 216 325 Q 256 347 296 325 Q 335 301 336 256 L 336 256 Z M 144 256 Q 144 226 159 200 L 159 200 L 159 200 Q 174 174 200 159 Q 226 144 256 144 Q 286 144 312 159 Q 338 174 353 200 Q 368 226 368 256 Q 368 286 353 312 Q 338 338 312 353 Q 286 368 256 368 Q 226 368 200 353 Q 174 338 159 312 Q 144 286 144 256 L 144 256 Z"/>
            </svg>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-purple-50 dark:bg-purple-900/30">
        <a href="/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/pressure" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Atmospheric Pressure</h3>
                <p class="text-xs mt-1">Barometric pressure trends and analysis</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 512 512">
              <path d="M 311.8545454545455 167.56363636363636 L 311.8545454545455 204.8 L 311.8545454545455 167.56363636363636 L 311.8545454545455 204.8 L 349.09090909090907 204.8 L 404.94545454545454 204.8 L 404.94545454545454 225.74545454545455 L 404.94545454545454 225.74545454545455 L 256 359.56363636363636 L 256 359.56363636363636 L 107.05454545454545 225.74545454545455 L 107.05454545454545 225.74545454545455 L 107.05454545454545 204.8 L 107.05454545454545 204.8 L 162.9090909090909 204.8 L 200.14545454545456 204.8 L 200.14545454545456 167.56363636363636 L 200.14545454545456 167.56363636363636 L 200.14545454545456 37.236363636363635 L 200.14545454545456 37.236363636363635 L 311.8545454545455 37.236363636363635 L 311.8545454545455 37.236363636363635 L 311.8545454545455 167.56363636363636 L 311.8545454545455 167.56363636363636 Z M 442.1818181818182 167.56363636363636 L 404.94545454545454 167.56363636363636 L 442.1818181818182 167.56363636363636 L 349.09090909090907 167.56363636363636 L 349.09090909090907 130.3272727272727 L 349.09090909090907 130.3272727272727 L 349.09090909090907 37.236363636363635 L 349.09090909090907 37.236363636363635 L 349.09090909090907 0 L 349.09090909090907 0 L 311.8545454545455 0 L 162.9090909090909 0 L 162.9090909090909 37.236363636363635 L 162.9090909090909 37.236363636363635 L 162.9090909090909 130.3272727272727 L 162.9090909090909 130.3272727272727 L 162.9090909090909 167.56363636363636 L 162.9090909090909 167.56363636363636 L 125.67272727272727 167.56363636363636 L 69.81818181818181 167.56363636363636 L 69.81818181818181 204.8 L 69.81818181818181 204.8 L 69.81818181818181 242.03636363636363 L 69.81818181818181 242.03636363636363 L 256 409.6 L 256 409.6 L 442.1818181818182 242.03636363636363 L 442.1818181818182 242.03636363636363 L 442.1818181818182 204.8 L 442.1818181818182 204.8 L 442.1818181818182 167.56363636363636 L 442.1818181818182 167.56363636363636 Z M 60.50909090909091 456.1454545454545 L 4.654545454545454 456.1454545454545 L 60.50909090909091 456.1454545454545 L 4.654545454545454 456.1454545454545 L 4.654545454545454 512 L 4.654545454545454 512 L 60.50909090909091 512 L 60.50909090909091 512 L 60.50909090909091 456.1454545454545 L 60.50909090909091 456.1454545454545 Z M 172.21818181818182 456.1454545454545 L 116.36363636363636 456.1454545454545 L 172.21818181818182 456.1454545454545 L 116.36363636363636 456.1454545454545 L 116.36363636363636 512 L 116.36363636363636 512 L 172.21818181818182 512 L 172.21818181818182 512 L 172.21818181818182 456.1454545454545 L 172.21818181818182 456.1454545454545 Z M 228.07272727272726 512 L 283.92727272727274 512 L 228.07272727272726 512 L 283.92727272727274 512 L 283.92727272727274 456.1454545454545 L 283.92727272727274 456.1454545454545 L 228.07272727272726 456.1454545454545 L 228.07272727272726 456.1454545454545 L 228.07272727272726 512 L 228.07272727272726 512 Z M 395.6363636363636 456.1454545454545 L 339.7818181818182 456.1454545454545 L 395.6363636363636 456.1454545454545 L 339.7818181818182 456.1454545454545 L 339.7818181818182 512 L 339.7818181818182 512 L 395.6363636363636 512 L 395.6363636363636 512 L 395.6363636363636 456.1454545454545 L 395.6363636363636 456.1454545454545 Z M 451.4909090909091 456.1454545454545 L 451.4909090909091 512 L 451.4909090909091 456.1454545454545 L 451.4909090909091 512 L 507.3454545454546 512 L 507.3454545454546 512 L 507.3454545454546 456.1454545454545 L 507.3454545454546 456.1454545454545 L 451.4909090909091 456.1454545454545 L 451.4909090909091 456.1454545454545 Z"/>
            </svg>
        </a>
    </div>

    <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition bg-red-50 dark:bg-red-900/30">
        <a href="/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/particulate-matter" class="flex items-center justify-between">
            <div>
                <h3 class="font-bold">Particulate Matter</h3>
                <p class="text-xs mt-1">PM1.0, PM2.5, and PM10 air quality analysis</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" fill="currentColor" viewBox="0 0 640 512">
              <path d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"/>
            </svg>
        </a>
    </div>
</Grid>

## From Traditional IoT to Cloud-Native

Traditional IoT relies on local hubs - sensors sending data via MQTT to central servers running databases like InfluxDB. This introduces complexity and potential data loss during outages.

### Our First Trial

In early 2024, we built our first environmental monitoring station - a Raspberry Pi Zero W with an Enviro+ sensor connected to an Intel NUC hub running TimeScaleDB. It worked, but when the hub disconnected, all readings sent via MQTT were lost.

After a year of experimenting, we had a realization: **Why use extra energy and resources when the Raspberry Pi already has WiFi?**

This insight became the foundation of opensensor.space - eliminating unnecessary infrastructure by leveraging what edge devices already have. Simplicity scales better than complexity.

<Image
    url="/20250408-cloud-native-weather-station1.png"
    description="opensensor.space cloud-native architecture diagram"
    border=true
    class="p-2"
/>

## Architecture Overview

The pattern works for any IoT data source. Explore the data structure using DuckDB:
```sql
SUMMARIZE
    SELECT
        *
    FROM
        read_parquet('s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=019ab390-f291-7a30-bca8-381286e4c2aa/**/*.parquet', union_by_name=true, hive_partitioning=true);
```

```sql latest_data_schema
-- Get comprehensive statistics for all sensor data fields
SUMMARIZE SELECT * FROM all_stations
```

<DataTable
  data={latest_data_schema}
  title="Sensor Data Statistics"
  subtitle="Min, max, average, and other key metrics for all sensor readings"
  rows="all"
  search={true}
  minWidth={1000}
  rowShading={true}
  rowLines={true}
  sortable={true}
>
  <Column id="column_name" title="Sensor" width={120} />
  <Column id="column_type" title="Data Type" width={120} align="center" />
  <Column id="min" width={100} align="right" />
  <Column id="max" width={100} align="right" />
  <Column id="avg" title="Average" width={120} contentType="bar" barColor="#4CAF50" />
  <Column id="q25" title="25th %" width={100} align="right" />
  <Column id="q50" title="Median" width={100} align="right" />
  <Column id="q75" title="75th %" width={100} align="right" />
  <Column id="count" title="# Readings" width={100} contentType="colorscale" colorScale="#90caf9" />
</DataTable>

Edge devices stream measurements directly to cloud storage in **Parquet** format - no databases required.

### How It Works

1. Sensors collect readings every 5 seconds, batched into 15-minute Parquet files
2. Files stored in Hive-partitioned format: `station={ID}/year={year}/month={month}/day={day}/data_{time}.parquet`
3. Data queried directly using [DuckDB-wasm](https://duckdb.org/docs/stable/clients/wasm/overview.html) in the browser with [Evidence.dev](https://evidence.dev)

Our data is hosted on [Source Cooperative](https://source.coop) - free S3-compatible storage for open datasets (requires approval from Radiant Earth). Any S3-compatible storage works.

## Example: Environmental Monitoring

Reference deployment using Enviro+ sensor: temperature, pressure, humidity, gas sensors, light, proximity, and particulate matter (PM1.0, PM2.5, PM10).

- [Enviro+ Product Page](https://shop.pimoroni.com/products/enviro?variant=31155658457171)

## Platform Benefits

- **Low carbon footprint** - Edge processing reduces data transmission by 60-90%
- **Cost effective** - No databases, message brokers, or backend servers
- **Scalable** - Object storage scales from single sensors to millions
- **Hardware agnostic** - Works with any Python-capable device (Raspberry Pi, NVIDIA Jetson, ASUS Tinker Board, etc.)
- **Resilient** - Offline-first with automatic sync when connectivity returns
- **Open** - Standard formats (Parquet, S3) accessible to any analytics tool

Sensors operate autonomously even when offline - zero data loss during network outages.

## Roadmap

- **GPS-enabled sensors** - Location tracking for mobile sensor networks
- **Multi-sensor support** - LoRa, radio (AIS), industrial sensors, agricultural IoT, smart city applications
- **One-line setup** - ✅ Completed (see [Join the Network](/join-network))
- **Multi-cloud support** - ✅ Completed (AWS, GCS, Azure, Cloudflare R2, Wasabi, Hetzner, MinIO)
- **Stations health** - ✅ Completed (CPU, Memory, Disk, WiFi, NTP monitoring)

<Alert status="success">
  <strong>Ready to deploy your sensors?</strong> Check out the <a href="/join-network">Join the Sensor Network</a> page for instructions on how to contribute to this project!
</Alert>

## Resources

- [opensensor-enviroplus](https://github.com/walkthru-earth/opensensor-enviroplus) - Data collector CLI
- [Data Repository](https://source.coop/walkthru-earth/opensensor-space/)

---

*opensensor.space is an initiative by [walkthru.earth](https://walkthru.earth)*
