---
title: Join the Sensor Network
description: Deploy your own cloud-native sensors and contribute to opensensor.space
---

opensensor.space is designed to be easily replicated and expanded into a community-driven sensor network. We welcome contributions from anyone interested in deploying sensors - whether for environmental monitoring, industrial IoT, smart agriculture, or any other use case - and sharing data using open standards.

## How to Participate

1. **Deploy your sensors** - Follow the setup instructions below for the reference implementation, or adapt to your sensor hardware
2. **Choose your storage** - Use [Source Cooperative](https://source.coop) for open data or your own S3-compatible storage
3. **Register your station** - Use our simple registration form to add your station to the network
4. **Share your insights** - Contribute dashboard improvements, custom visualizations, or reference implementations for new sensor types

## Register Your Station

Ready to add your sensor station to the network? Use our registration form to submit your station details. You'll need a GitHub account to authenticate.

<a href="/admin/" class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 no-underline">
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

By creating a distributed sensor network using this architecture, we can build comprehensive data collection systems across different locations and use cases while maintaining individual ownership of data collection infrastructure. The platform supports various applications: environmental monitoring, industrial IoT, smart agriculture, urban analytics, and more.

## Reference Implementation: Environmental Monitoring

This example demonstrates the platform using environmental sensors. You can adapt this architecture to any sensor type - industrial, agricultural, medical, or custom IoT devices.

### Hardware Components for Reference Setup

<Grid cols=2>
  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-zero-2-w?variant=42101934587987" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/files/PiZ2WHfront_0abdb823-7474-4aa9-bffa-4990fe440574_768x768_crop_center.png?v=1723211856" alt="Raspberry Pi Zero 2 W" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Raspberry Pi Zero 2 W + Headers</h3>
      <p class="text-xs text-center mt-1">The brain of your weather station</p>
    </a>
  </div>
  
  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-12-5w-micro-usb-power-supply?variant=39493050237011" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/PSU_UK_768x768_crop_center.jpg?v=1635179995" alt="Raspberry Pi Power Supply" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">Raspberry Pi 12.5W Micro USB Power Supply</h3>
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
      <p class="text-xs text-center mt-1">The main sensor package with temperature, humidity, pressure, gas, and light sensors</p>
    </a>
  </div>
  
  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/pms5003-particulate-matter-sensor-with-cable?variant=29075640352851" target="_blank" class="flex flex-col items-center">
      <img src="https://shop.pimoroni.com/cdn/shop/products/PMS5003_particulate_matter_sensor_with_cable_1_of_4_768x768_crop_center.JPG?v=1560514915" alt="PMS5003 Particulate Matter Sensor" class="w-48 h-48 object-contain mb-3" />
      <h3 class="font-bold text-center">PMS5003 Particulate Matter Sensor</h3>
      <p class="text-xs text-center mt-1">For PM1.0, PM2.5, and PM10 air quality monitoring</p>
    </a>
  </div>
</Grid>

## Technical Requirements

### Hardware Options

**For the Reference Environmental Setup:**
- Raspberry Pi Zero 2 W (or any Raspberry Pi model)
- Pimoroni Enviro+ Air Quality sensor package
- PMS5003 Particulate Matter sensor (recommended for air quality monitoring)
- microSD card with Raspberry Pi OS (min. 8GB)
- Power supply for Raspberry Pi
- Optional: GPS module for mobile installations (for location tracking)

**For Custom Sensor Deployments:**
- Any edge device with network connectivity (ESP32, Arduino, Raspberry Pi, industrial PLCs, etc.)
- Your sensor hardware (temperature, pressure, vibration, chemical, optical, etc.)
- Storage (SD card, eMMC, or local SSD for offline buffering)
- Power supply appropriate for deployment (mains, battery, solar, PoE)

### Software Setup (Reference Implementation)

For the environmental monitoring reference setup, follow these steps:

1. **Install the Official Enviro+ Python Library** - Set up the official [Enviro+ Python environment](https://github.com/pimoroni/enviroplus-python) first following their installation instructions:
   ```bash
   git clone https://github.com/pimoroni/enviroplus-python
   cd enviroplus-python
   sudo ./install.sh
   ```

2. **Extend the Environment with Additional Libraries** - Once the official Enviro+ environment is set up, install the additional required libraries:
   ```bash
   pip install awscli fastparquet pandas
   ```

3. **Set Up Your Own Copy of the Parquet-Edge Project**:
   - First, fork the [opensensor-space-edge repository](https://github.com/walkthru-earth/opensensor-space-edge/) to your own GitHub account
   - Clone your forked repository to your Raspberry Pi
   - Customize the configuration:
     - Update the station ID in `config.py` (e.g., change from "01" to your unique station ID)
     - Configure your S3 credentials in the GitHub Actions workflow files (`.github/workflows/*.yml`)
     - Adjust any data collection parameters as needed for your specific deployment

<Alert status="warning">
  <strong>Important:</strong> You must update the S3 credentials in the GitHub Actions workflows to match your own storage provider. If you're using Source Cooperative, you'll need to set up your own Access Key and Secret Key.
</Alert>

#### How the Data Collection System Works

The opensensor-space-edge repository provides a reference implementation for sensor operation:

1. **Sensor Data Collection**: Reads data from sensors at configurable intervals (default: 1-second for environmental data)
2. **Local Storage**: Writes data to local Parquet files in partitioned structure
3. **Cloud Synchronization**: Uses built-in GitHub Actions workflows to sync data to your S3-compatible storage
4. **Offline Operation**: Continues collecting data when internet is unavailable and syncs when connection is restored
5. **Aggregation**: Creates daily aggregated files for more efficient historical analysis

**Custom Implementations:** You can adapt this pattern to any programming language (Python, JavaScript, Rust, C++) and any sensor protocol (I2C, SPI, Modbus, UART, etc.). The core principle remains: collect data locally in Parquet format, then batch sync to object storage.

After your sensor deployment is up and running, use the **Register New Station** button above to add your station to the network. Your submission will be reviewed and added to the dashboard.

### Data Structure Guidelines

To ensure compatibility with the network, please follow these data structure guidelines:

1. **File format**: Use Parquet files with consistent schema
2. **Data frequency**: Record data at 1-second intervals, with files covering 5-minute periods

#### Near Real-Time Data (5-minute files)

These files contain 1-second interval readings aggregated into 5-minute chunks for near real-time monitoring:

```sql
station={STATION_ID}/year={year}/month={month}/day={day}/data_{time}.parquet
```

Example:
```sql
s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=0195ae3c-43e0-7624-8c5c-7424adbcc30d/year=2025/month=04/day=05/data_0145.parquet
```

View example files at [Source Cooperative - opensensor-space](https://source.coop/walkthru-earth/opensensor-space/)

This structure is used in the [Near Real-Time Dashboard](/Stations/0195ae3c-43e0-7624-8c5c-7424adbcc30d/near-real-time) to show the most recent readings.

#### Daily Aggregated Data (for historical analysis)

For more efficient historical data analysis, 1-minute averages are aggregated into daily files:

```sql
station={STATION_ID}/year={year}/month={month}/{year}_{month}_{day}.parquet
```

Example:
```sql
s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=0195ae3c-43e0-7624-8c5c-7424adbcc30d/year=2025/month=04/day=05/data_0.parquet
```

The new architecture stores daily consolidated data directly in the same partition structure.

This structure is used for all the historical dashboards and trend analysis.

#### Station ID Guidelines

* Use a unique identifier for your station (UUID) instead of simple identifiers like "02" or "03"

## Advanced Deployments

### Mobile Sensors
Support for GPS-enabled mobile sensor deployments is coming soon, enabling spatial data collection from vehicles, drones, and portable monitoring units.

### LoRa Mesh Networks
We're developing reference implementations for LoRa mesh architectures where multiple sensors communicate with each other, and one designated gateway sensor handles WiFi synchronization to cloud storage. This enables large-area coverage with minimal infrastructure and ultra-low power consumption.

This dashboard is built with [Evidence](https://evidence.dev), which allows us to query and visualize the Parquet data directly in the browser - no backend required!
