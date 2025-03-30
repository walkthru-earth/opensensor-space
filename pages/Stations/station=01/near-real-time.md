```sql near_real_time_data
SELECT * FROM read_parquet('https://data.source.coop/youssef-harby/weather-station-realtime-parquet/parquet/station=01/year=2025/month=03/day=30/data_0240.parquet')
```

```sql temperature_stats
SELECT 
  AVG(temperature) as avg_temp,
  MIN(temperature) as min_temp,
  MAX(temperature) as max_temp,
  AVG(raw_temperature) as avg_raw_temp
FROM read_parquet('https://data.source.coop/youssef-harby/weather-station-realtime-parquet/parquet/station=01/year=2025/month=03/day=30/data_0240.parquet')
```

```sql humidity_stats
SELECT 
  AVG(humidity) as avg_humidity,
  MIN(humidity) as min_humidity,
  MAX(humidity) as max_humidity
FROM read_parquet('https://data.source.coop/youssef-harby/weather-station-realtime-parquet/parquet/station=01/year=2025/month=03/day=30/data_0240.parquet')
```

```sql pressure_stats
SELECT 
  AVG(pressure) as avg_pressure,
  MIN(pressure) as min_pressure,
  MAX(pressure) as max_pressure
FROM read_parquet('https://data.source.coop/youssef-harby/weather-station-realtime-parquet/parquet/station=01/year=2025/month=03/day=30/data_0240.parquet')
```

```sql air_quality_stats
SELECT 
  AVG(oxidised) as avg_oxidised,
  MIN(oxidised) as min_oxidised,
  MAX(oxidised) as max_oxidised,
  AVG(reducing) as avg_reducing,
  MIN(reducing) as min_reducing,
  MAX(reducing) as max_reducing,
  AVG(nh3) as avg_nh3,
  MIN(nh3) as min_nh3,
  MAX(nh3) as max_nh3
FROM read_parquet('https://data.source.coop/youssef-harby/weather-station-realtime-parquet/parquet/station=01/year=2025/month=03/day=30/data_0240.parquet')
```

```sql light_stats
SELECT 
  AVG(lux) as avg_lux,
  MAX(lux) as max_lux,
  AVG(proximity) as avg_proximity,
  MAX(proximity) as max_proximity
FROM read_parquet('https://data.source.coop/youssef-harby/weather-station-realtime-parquet/parquet/station=01/year=2025/month=03/day=30/data_0240.parquet')
```

# Station 01 - Near Real-Time Weather Data

<small>*All metrics represent averages from the last 5 minutes of data collection at this station.*</small>

## Key Metrics

<BigValue 
  data={temperature_stats} 
  value=avg_temp
  title="Average Temperature (°C)"
  fmt="num1"
  description="Average ambient temperature measured in degrees Celsius. Standard range: 15°C to 30°C. Optimal indoor temperature is 20-25°C."
/>

<BigValue 
  data={humidity_stats} 
  value=avg_humidity
  title="Average Humidity (%)"
  fmt="num1"
  description="Relative humidity percentage in the air. Standard range: 30% to 60%. Optimal indoor humidity is 40-50%."
/>

<BigValue 
  data={pressure_stats} 
  value=avg_pressure
  title="Average Pressure (hPa)"
  fmt="num1"
  description="Atmospheric pressure in hectopascals. Standard range: 970 hPa to 1030 hPa. Standard sea level pressure is 1013.25 hPa."
/>

## Temperature Metrics

<BigValue 
  data={temperature_stats} 
  value=min_temp
  title="Minimum Temperature (°C)"
  fmt="num1"
  description="Lowest recorded temperature. Standard range: 15°C to 30°C."
/>

<BigValue 
  data={temperature_stats} 
  value=max_temp
  title="Maximum Temperature (°C)"
  fmt="num1"
  description="Highest recorded temperature. Standard range: 15°C to 30°C."
/>

<BigValue 
  data={temperature_stats} 
  value=avg_raw_temp
  title="Average Raw Temperature (°C)"
  fmt="num1"
  description="Average raw temperature from sensor before calibration. Raw temperature readings are typically higher than calibrated readings due to sensor self-heating."
/>

## Air Quality Metrics

<BigValue 
  data={air_quality_stats} 
  value=avg_oxidised
  title="Oxidised Gas (kΩ)"
  fmt="num1"
  description="Average oxidising gas level (primarily NO2). Lower resistance values indicate higher gas concentrations. Standard range: 50-500 kΩ."
/>

<BigValue 
  data={air_quality_stats} 
  value=avg_reducing
  title="Reducing Gas (kΩ)"
  fmt="num1"
  description="Average reducing gas level (primarily CO). Lower resistance values indicate higher gas concentrations. Standard range: 100-600 kΩ."
/>

<BigValue 
  data={air_quality_stats} 
  value=avg_nh3
  title="Ammonia (kΩ)"
  fmt="num1"
  description="Average ammonia (NH3) gas level. Lower resistance values indicate higher gas concentrations. Standard range: 10-300 kΩ."
/>

## Light Metrics

<BigValue 
  data={light_stats} 
  value=avg_lux
  title="Average Light Level (lux)"
  fmt="num1"
  description="Average ambient light level in lux. Standard ranges: Moonlight (0.1 lux), Living room (50-100 lux), Office (300-500 lux), Daylight (10,000-25,000 lux)."
/>

<BigValue 
  data={light_stats} 
  value=max_lux
  title="Maximum Light Level (lux)"
  fmt="num1"
  description="Peak light level recorded. Standard ranges: Moonlight (0.1 lux), Living room (50-100 lux), Office (300-500 lux), Daylight (10,000-25,000 lux)."
/>

<BigValue 
  data={light_stats} 
  value=avg_proximity
  title="Average Proximity"
  fmt="num0"
  description="Average proximity sensor reading. Proximity values range from 0 (no object detected) to 2047 (object very close to sensor)."
/>

## Raw Data

<DataTable
  data={near_real_time_data}
  title="Near Real-Time Weather Data"
  limit=10
/>