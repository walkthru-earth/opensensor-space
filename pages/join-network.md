---
title: Join the Sensor Network
description: Deploy your own cloud-native sensors and contribute to opensensor.space
---

Join our community-driven sensor network. Deploy sensors, share open data, and help build comprehensive environmental monitoring across the globe.

## Quick Start

1. **Get the hardware** - Raspberry Pi + Enviro+ sensor
2. **Install the software** - Two packages, one command
3. **Register your station** - Submit via our form below

## Register Your Station

<a href="https://opensensor.space/admin/" target="_blank" rel="external" class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 no-underline">
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
  Register New Station
</a>

<Details title="What information do I need?">

- **Station Name**: A friendly name for your station
- **Sensor Type**: Enviro+, custom, etc.
- **Station Type**: Indoor, Outdoor, or Moving
- **Location**: Click on map to place marker
- **Storage URL**: Your S3 path where data is stored

The registration creates a pull request that we review before adding your station.

</Details>

## Hardware

<Grid cols=2>
  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-zero-2-w?variant=42101934587987" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/files/PiZ2WHfront_0abdb823-7474-4aa9-bffa-4990fe440574_768x768_crop_center.png?v=1723211856" alt="Raspberry Pi Zero 2 W" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Raspberry Pi Zero 2 W</h3>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/enviro?variant=31155658457171" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/Enviro-Plus-pHAT-on-white-2_1500x1500_crop_center.jpg?v=1573820030" alt="Enviro+ Air Quality Version" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Enviro+ (Air Quality)</h3>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/pms5003-particulate-matter-sensor-with-cable?variant=29075640352851" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/PMS5003_particulate_matter_sensor_with_cable_1_of_4_768x768_crop_center.JPG?v=1560514915" alt="PMS5003 Particulate Matter Sensor" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">PMS5003 (PM Sensor)</h3>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/microsd-card-with-raspberry-pi-os?variant=53501816832379" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/files/SD_CARD_128GB_768x768_crop_center.png?v=1729672748" alt="microSD Card" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">microSD Card + Power Supply</h3>
    </a>
  </div>
</Grid>

## Software Installation

### Step 1: Install UV and Sensor Drivers

```bash
# Install UV package manager
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env

# Install Enviro+ drivers
uv pip install enviroplus-community

# Configure hardware (I2C, SPI, UART)
sudo enviroplus-setup --install
sudo reboot
```

### Step 2: Install OpenSensor Collector

```bash
# Clone and install
git clone https://github.com/walkthru-earth/opensensor-enviroplus.git
cd opensensor-enviroplus
uv sync

# Interactive setup (generates station ID, configures S3)
opensensor setup

# Start as systemd service
opensensor service setup
```

That's it! Your sensor is now collecting data and syncing to the cloud.

<Details title="What does this install?">

**[enviroplus-community](https://github.com/walkthru-earth/enviroplus-python)** - Sensor drivers for BME280 (temp/humidity/pressure), LTR559 (light), MICS6814 (gas), PMS5003 (particulates)

**[opensensor-enviroplus](https://github.com/walkthru-earth/opensensor-enviroplus)** - Data collector with:
- UUID v7 station IDs
- Polars + Arrow for efficient processing
- Hive-partitioned Parquet output
- Automatic S3 sync via obstore
- Runs as systemd service

</Details>

## Data Storage

Use [Source Cooperative](https://source.coop) for free open data hosting, or any S3-compatible storage.

**Data format**: Hive-partitioned Parquet files
```
station={UUID}/year=2025/month=11/day=26/data_1430.parquet
```

**Example**: [source.coop/walkthru-earth/opensensor-space](https://source.coop/walkthru-earth/opensensor-space/)

## CLI Commands

```bash
opensensor status          # View current status
opensensor logs --follow   # Watch live logs
opensensor sync            # Manual sync to cloud
opensensor service restart # Restart collector
```

## Architecture

```
Sensors (5s reads) → Polars DataFrame → Parquet (15min batches) → S3 Sync
```

- **Offline-first**: Buffers locally, syncs when connected
- **Memory efficient**: ~50MB RAM on Pi Zero
- **Browser-queryable**: DuckDB-wasm compatible output

## Support

- [opensensor-enviroplus Issues](https://github.com/walkthru-earth/opensensor-enviroplus/issues)
- [enviroplus-community Issues](https://github.com/walkthru-earth/enviroplus-python/issues)
- Email: yharby@walkthru.earth

Built with [Evidence](https://evidence.dev) - query Parquet directly in the browser!
