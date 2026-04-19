---
title: System Health
---

```sql station_info
-- Health telemetry is a sibling of the sensor data: swap `enviroplus/` for
-- `enviroplus-health/` in storage_url. We target the 15-minute bucket from
-- ~3 hours ago, not "now": stations can be a couple of hours late uploading,
-- and the file's day=YYYY partition matches the UTC day the file was created,
-- not wall-clock now. Three hours of lookback lets us land on a file that
-- actually exists in almost all cases. When no data matches the page still
-- shows a graceful "No data" alert. Trade-off: data is never newer than ~3 h.
SELECT
  *,
  replace(
    replace(storage_url, 's3://', 'https://s3.us-west-2.amazonaws.com/'),
    '/enviroplus/',
    '/enviroplus-health/'
  )
    || 'year=' || year((current_timestamp AT TIME ZONE 'UTC') - INTERVAL '3 hours')::int::varchar
    || '/month=' || lpad(month((current_timestamp AT TIME ZONE 'UTC') - INTERVAL '3 hours')::int::varchar, 2, '0')
    || '/day=' || lpad(day((current_timestamp AT TIME ZONE 'UTC') - INTERVAL '3 hours')::int::varchar, 2, '0')
    || '/health_' || lpad(hour((current_timestamp AT TIME ZONE 'UTC') - INTERVAL '3 hours')::int::varchar, 2, '0')
    || lpad((floor(minute((current_timestamp AT TIME ZONE 'UTC') - INTERVAL '3 hours') / 15) * 15)::int::varchar, 2, '0')
    || '.parquet' as health_parquet_url
FROM station_registry WHERE station_id = '${params.station}'
```

# {station_info[0].station_name} - System Health

<LastRefreshed/>

<Details title='About this dashboard'>

This dashboard monitors the device health of **{station_info[0].station_name}**. It tracks CPU temperature, system load, memory usage, disk space, and network connectivity.

Not every station publishes health telemetry, so this page may show "No data" for stations that only stream environmental readings.

</Details>

```sql raw_data
-- Read the single 15-minute health parquet that station_info pointed at
-- (already time-shifted 2 hours to tolerate upload delay and the file
-- day-partition lag around UTC midnight).
SELECT
  timestamp,
  cpu_temp_c,
  cpu_load_1min,
  cpu_load_5min,
  cpu_load_15min,
  memory_total_mb,
  memory_available_mb,
  memory_percent_used,
  disk_total_gb,
  disk_free_gb,
  disk_percent_used,
  wifi_signal_dbm,
  wifi_quality_percent,
  uptime_seconds,
  clock_synced,
  cpu_voltage_v,
  throttled_hex
FROM read_parquet('${station_info[0].health_parquet_url}')
ORDER BY timestamp
```

```sql latest_health
SELECT
  max(timestamp) as last_reading_time,
  round(avg(cpu_temp_c), 1) as avg_cpu_temp,
  round(avg(cpu_load_1min), 2) as avg_load,
  round(avg(memory_percent_used), 1) as avg_memory,
  round(avg(disk_percent_used), 1) as avg_disk,
  round(avg(wifi_signal_dbm), 0) as avg_wifi,
  max(uptime_seconds) / 3600.0 as uptime_hours,
  round(avg(cpu_voltage_v), 3) as avg_voltage
FROM ${raw_data}
```

{#if raw_data.length > 0}

<Alert status="info">
  Last reading: <strong>{latest_health[0].last_reading_time}</strong> | Uptime: <strong><Value data={latest_health} column=uptime_hours fmt="num1"/> hours</strong>
</Alert>

## System Status

<Grid cols=4>
  <BigValue
    data={raw_data}
    value=cpu_temp_c
    title="CPU Temp (°C)"
    fmt="num1"
    sparkline=timestamp
    sparklineType=area
    description="Max recommended: 80°C"
    emptySet="pass"
    emptyMessage="No data"
  />
  <BigValue
    data={raw_data}
    value=cpu_load_1min
    title="CPU Load (1m)"
    fmt="num2"
    sparkline=timestamp
    sparklineType=area
    description="System load average"
    emptySet="pass"
    emptyMessage="No data"
  />
  <BigValue
    data={raw_data}
    value=memory_percent_used
    title="Memory Usage (%)"
    fmt="num1"
    sparkline=timestamp
    sparklineType=area
    description="RAM utilization"
    emptySet="pass"
    emptyMessage="No data"
  />
  <BigValue
    data={raw_data}
    value=disk_percent_used
    title="Disk Usage (%)"
    fmt="num1"
    sparkline=timestamp
    sparklineType=area
    description="Storage utilization"
    emptySet="pass"
    emptyMessage="No data"
  />
  <BigValue
    data={raw_data}
    value=disk_free_gb
    title="Free Disk (GB)"
    fmt="num1"
    sparkline=timestamp
    sparklineType=area
    description="Available storage"
    emptySet="pass"
    emptyMessage="No data"
  />
</Grid>

## Network & Connectivity

<Grid cols=2>
  <BigValue
    data={raw_data}
    value=wifi_signal_dbm
    title="WiFi Signal (dBm)"
    fmt="num0"
    sparkline=timestamp
    sparklineType=area
    description="Closer to 0 is better"
    emptySet="pass"
    emptyMessage="No data"
  />
</Grid>

## CPU Voltage

<Grid cols=1>
  <BigValue
    data={raw_data}
    value=cpu_voltage_v
    title="CPU Voltage (V)"
    fmt="num3"
    sparkline=timestamp
    sparklineType=area
    description="Core voltage, typical 0.8 to 1.4 V"
    emptySet="pass"
    emptyMessage="No data"
  />
</Grid>

## Performance Trends

```sql minute_data
SELECT
  date_trunc('minute', timezone('${Intl.DateTimeFormat().resolvedOptions().timeZone}', timestamp)) as minute,
  round(avg(cpu_temp_c), 1) as "CPU Temp (°C)",
  round(avg(cpu_load_1min), 2) as "Load (1m)",
  round(avg(memory_percent_used), 1) as "Memory (%)",
  round(avg(cpu_voltage_v), 3) as "Voltage (V)"
FROM ${raw_data}
GROUP BY 1
ORDER BY minute
```

<LineChart
  data={minute_data}
  x=minute
  y={['CPU Temp (°C)', 'Memory (%)']}
  title="Thermals & Memory"
  xFmt="HH:mm"
  chartAreaHeight=200
  emptySet="pass"
  emptyMessage="No data available"
/>

<LineChart
  data={minute_data}
  x=minute
  y={['Load (1m)']}
  title="System Load"
  xFmt="HH:mm"
  chartAreaHeight=200
  emptySet="pass"
  emptyMessage="No data available"
/>

<LineChart
  data={minute_data}
  x=minute
  y={['Voltage (V)']}
  title="CPU Voltage"
  xFmt="HH:mm"
  chartAreaHeight=200
  emptySet="pass"
  emptyMessage="No data available"
/>

{:else}

<Alert status="warning">
  No health data available for this station in the current 15-minute window. Not every contributor publishes device health, so this may also mean the station streams environmental readings only.
</Alert>

{/if}
