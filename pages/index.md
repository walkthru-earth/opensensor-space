---
sidebar_position: 1
title: Cloud Native DIY Weather Station
description: Build a cloud-native weather station
hide_title: true
---

# My DIY Weather Station: A Cloud-Native Approach

## The Journey

When I first built my DIY weather station last year early (2024), I followed a traditional approach - a Raspberry Pi Zero W with an Enviro+ sensor connected to an Intel NUC that served as a data hub. The NUC collected sensor data and stored it in a TimeScaleDB database. It worked, but it wasn't as elegant or efficient as it could be. If the hub disconnected for any reason - like a power outage - I lost all the readings and measurements sent via MQTT from my sensors.

After a year of working with cloud-native technologies, I had a realization: **Why am I using extra energy and resources when my Raspberry Pi Zero W already has WiFi?**

This insight led me to reimagine my weather station with a truly cloud-native approach.

<Image 
    url="/image.png" 
    description="My DIY weather station cloud-native diagram"
    border=true 
    class="p-4"
/>

## The Cloud-Native Solution

Instead of relying on a local database server, I now stream sensor measurements directly from the Raspberry Pi to cloud storage in **Parquet** format. This approach eliminates unnecessary infrastructure while maintaining all the functionality I need.

The current implementation:

1. A Python script runs as a **cron job** every 5 minutes on the Raspberry Pi
2. Each Parquet file contains 1-second interval measurements from the Enviro+ sensor
3. Files are stored in a partitioned format for near real-time dashboarding:
   ```
   station={STATION_ID}/year={year}/month={month}/day={day}/data_{time}.parquet
   ```
4. A GitHub Actions workflow runs daily to aggregate the small 5-minute files into consolidated daily files, making queries more efficient and reducing the number of small files
5. Data is queried directly using [**DuckDB-wasm**](https://duckdb.org/docs/stable/clients/wasm/overview.html) in the browser with [Evidence.dev](https://evidence.dev), creating a truly cloud-native dashboard without any intermediate servers

All Parquet files are hosted on [Source Cooperative](https://source.coop), a [Radiant Earth](https://radiant.earth) initiative that provides free S3-compatible object storage for open datasets. This allows me to share my weather station data openly while avoiding storage costs.

## Sensor Capabilities

The Enviro+ sensor pack collects a wealth of environmental data:
- Temperature
- Pressure
- Humidity
- Oxidized gases
- Reducing gases
- NH3 (ammonia)
- Light levels (lux)
- Proximity

I'm currently waiting for a replacement for the combined Particulate Matter sensors (PM1.0, PM2.5, and PM10) to complete the setup.

## Why This Matters

This project demonstrates how edge devices can participate in cloud-native architectures without complex infrastructure. By storing data in open formats like Parquet and using client-side processing with tools like DuckDB and Evidence, we can build sophisticated monitoring systems that are:

- **Energy efficient** - minimal hardware requirements
- **Cost effective** - no servers to maintain
- **Scalable** - easily add more sensors or locations
- **Open** - data in standard formats accessible to many tools

## What's Next

I'm continuing to optimize this setup by:
- Fine-tuning the upload intervals to balance real-time data needs with S3 request costs
- Developing more sophisticated client-side visualizations
- Exploring integration with other cloud-native geospatial tools

This dashboard is built with [Evidence](https://evidence.dev), which allows me to query and visualize the Parquet data directly in the browser - no backend required!

## Resources

- [Project Repository](https://github.com/Youssef-Harby/parquet-edge)
- [Data Repository](https://source.coop/youssef-harby/weather-station-realtime-parquet/)

I'd love to hear your feedback and suggestions on optimizing this setup to make edge cloud-native computing more practical!