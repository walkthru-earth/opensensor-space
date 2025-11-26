---
title: Join the Sensor Network
description: Deploy your own cloud-native sensors and contribute to opensensor.space
---

opensensor.space is a community-driven sensor network. Deploy sensors, share open data using open standards, and help build comprehensive environmental monitoring across the globe.

## How to Participate

1. **Deploy your sensors** - Follow the setup instructions below
2. **Choose your storage** - Use [Source Cooperative](https://source.coop) for open data or your own S3-compatible storage
3. **Register your station** - Use our registration form below
4. **Share your insights** - Contribute dashboard improvements or new sensor implementations

## Register Your Station

Ready to add your sensor station to the network? Use our registration form to submit your station details. You'll need a GitHub account to authenticate.

<a href="https://opensensor.space/admin/" target="_blank" rel="external" class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 no-underline">
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
  Register New Station
</a>

<Details title="What information do I need to register?">

To register your station, you'll need:
- **Station Name**: A friendly name for your station
- **Sensor Type**: The type of sensor hardware (Enviro+, custom, etc.)
- **Station Type**: Indoor, Outdoor, or Moving
- **Location**: Coordinates on a map (click to place marker)
- **Storage URL**: Your S3-compatible storage path where data is stored

The registration creates a pull request that our team reviews before adding your station to the network.

</Details>

## Benefits of Contributing

By creating a distributed sensor network, we can build comprehensive data collection systems across different locations while maintaining individual ownership of data infrastructure. The platform supports environmental monitoring, industrial IoT, smart agriculture, urban analytics, and more.

## Hardware Requirements

### Recommended Setup (Enviro+)

<Grid cols=2>
  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-zero-2-w?variant=42101934587987" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/files/PiZ2WHfront_0abdb823-7474-4aa9-bffa-4990fe440574_768x768_crop_center.png?v=1723211856" alt="Raspberry Pi Zero 2 W" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Raspberry Pi Zero 2 W + Headers</h3>
      <p class="text-xs text-center mt-1">The brain of your sensor station</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-12-5w-micro-usb-power-supply?variant=39493050237011" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/PSU_UK_768x768_crop_center.jpg?v=1635179995" alt="Raspberry Pi Power Supply" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Raspberry Pi 12.5W Power Supply</h3>
      <p class="text-xs text-center mt-1">For Pi Zero 2 W (or any compatible power supply)</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/zero-adaptor-kit?variant=10462230279" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/Zero_2_of_5_daabacb7-b187-4089-86c7-575aeafb1d0d_768x768_crop_center.JPG?v=1448481941" alt="Raspberry Pi Zero Adaptor Kit" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Raspberry Pi Zero Adaptor Kit</h3>
      <p class="text-xs text-center mt-1">Micro HDMI converter for easy troubleshooting</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/microsd-card-with-raspberry-pi-os?variant=53501816832379" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/files/SD_CARD_128GB_768x768_crop_center.png?v=1729672748" alt="Raspberry Pi Official microSD Card" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">microSD Card with Raspberry Pi OS</h3>
      <p class="text-xs text-center mt-1">Pre-installed (or any other SD card)</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/enviro?variant=31155658457171" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/Enviro-Plus-pHAT-on-white-2_1500x1500_crop_center.jpg?v=1573820030" alt="Enviro+ Air Quality Version" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Enviro+ (Air Quality Version)</h3>
      <p class="text-xs text-center mt-1">Temperature, humidity, pressure, gas, and light sensors</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/pms5003-particulate-matter-sensor-with-cable?variant=29075640352851" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/PMS5003_particulate_matter_sensor_with_cable_1_of_4_768x768_crop_center.JPG?v=1560514915" alt="PMS5003 Particulate Matter Sensor" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">PMS5003 Particulate Matter Sensor</h3>
      <p class="text-xs text-center mt-1">PM1.0, PM2.5, and PM10 air quality monitoring</p>
    </a>
  </div>
</Grid>

### Custom Deployments

You can adapt this architecture to any sensor type:
- Any edge device with network connectivity (ESP32, Arduino, Raspberry Pi, industrial PLCs)
- Your sensor hardware (temperature, pressure, vibration, chemical, optical, etc.)
- Power supply appropriate for deployment (mains, battery, solar, PoE)

## Software Installation

### Step 1: Install UV Package Manager

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env
```

### Step 2: Install OpenSensor Collector

```bash
# Clone repository
git clone https://github.com/walkthru-earth/opensensor-enviroplus.git
cd opensensor-enviroplus

# Create isolated environment and install dependencies
uv venv --python 3.12
uv sync

# Configure hardware interfaces (I2C, SPI, UART)
uv run enviroplus-setup --install
sudo reboot
```

### Step 3: Configure Your Station

```bash
cd opensensor-enviroplus

# Interactive setup (generates UUID v7 station ID, configures S3)
uv run opensensor setup
```

### Step 4: Test and Verify

```bash
# Watch live logs for ~15 minutes to verify everything works
uv run opensensor logs --follow
```

Wait for at least one successful sync to confirm data is flowing to your storage.

### Step 5: Enable as Service

```bash
# Start as systemd service (auto-starts on boot)
uv run opensensor service setup
```

That's it! Your sensor is now collecting data and syncing to the cloud.

<Details title="What does this install?">

**[enviroplus-community](https://github.com/walkthru-earth/enviroplus-python)** - Sensor drivers for:
- BME280 (temperature, humidity, pressure)
- LTR559 (light and proximity)
- MICS6814 (gas sensor)
- PMS5003 (particulate matter)

**[opensensor-enviroplus](https://github.com/walkthru-earth/opensensor-enviroplus)** - Data collector with:
- UUID v7 station IDs (time-ordered)
- Polars + Apache Arrow for efficient processing
- Hive-partitioned Parquet output
- Automatic S3 sync via obstore (50% faster than boto3)
- Runs as systemd service with auto-restart
- Temperature compensation for CPU heat
- Offline-first with automatic sync when connected

</Details>

## Data Storage

Use [Source Cooperative](https://source.coop) for free open data hosting (requires approval from Radiant Earth), or any S3-compatible storage (AWS S3, MinIO, Cloudflare R2).

<Alert status="warning">
  <strong>Important:</strong> You'll need to configure your S3 credentials during `opensensor setup`. If using Source Cooperative, create an account and generate Access Keys.
</Alert>

## Data Structure

To ensure compatibility with the network, data is stored as Hive-partitioned Parquet files:

### Near Real-Time Data (15-minute files)

These files contain 5-second interval readings batched into 15-minute chunks for near real-time monitoring:

```
station={STATION_ID}/year={year}/month={month}/day={day}/data_{time}.parquet
```

**Example:**
```
s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=019ab390-f291-7a30-bca8-381286e4c2aa/year=2025/month=11/day=25/data_0415.parquet
```

View example files at [Source Cooperative - opensensor-space](https://source.coop/walkthru-earth/opensensor-space/)

This structure is used in the [Near Real-Time Dashboard](/Stations/019ab390-f291-7a30-bca8-381286e4c2aa/near-real-time) to show the most recent readings.

### Daily Aggregated Data (for historical analysis)

For more efficient historical data analysis, 1-minute averages are aggregated into daily files:

```
station={STATION_ID}/year={year}/month={month}/day={day}/data_{index}.parquet
```

**Example:**
```
s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=019ab390-f291-7a30-bca8-381286e4c2aa/year=2025/month=11/day=25/data_0.parquet
```

This structure is used for all historical dashboards and trend analysis.

### Station ID Guidelines

Use a unique identifier for your station (UUID v7) instead of simple identifiers like "02" or "03". The `opensensor setup` command generates this automatically.

### Benefits of This Structure

- **Partition pruning**: Query only the time ranges you need
- **Browser queries**: DuckDB-wasm can query directly in the browser
- **Universal compatibility**: Works with DuckDB, Polars, Spark, Pandas

## CLI Commands

```bash
opensensor status          # View current status
opensensor logs --follow   # Watch live logs
opensensor sync            # Manual sync to cloud
opensensor config          # View configuration
opensensor service restart # Restart collector
opensensor service stop    # Stop collector
```

## How It Works

```
Sensors (5s reads) → Polars DataFrame → Parquet (15min batches) → S3 Sync
```

**Architecture benefits:**
- **Offline-first**: Buffers locally, syncs when connected
- **Memory efficient**: ~50MB RAM on Raspberry Pi Zero
- **Low bandwidth**: Batch uploads reduce network usage by 60-90%
- **Browser-queryable**: DuckDB-wasm compatible Parquet output
- **Resilient**: Auto-restart on failure, graceful shutdown

## Advanced Deployments

### Mobile Sensors
Support for GPS-enabled mobile sensor deployments is coming soon, enabling spatial data collection from vehicles, drones, and portable monitoring units.

### Custom Sensor Types
You can adapt the architecture to any sensor by following the same pattern: collect data locally in Parquet format, then batch sync to object storage. See [opensensor-enviroplus](https://github.com/walkthru-earth/opensensor-enviroplus) for implementation details.

## Support

- [opensensor-enviroplus Issues](https://github.com/walkthru-earth/opensensor-enviroplus/issues)
- [enviroplus-community Issues](https://github.com/walkthru-earth/enviroplus-python/issues)
- Email: hi@walkthru.earth
