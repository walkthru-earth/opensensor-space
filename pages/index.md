---
title: My Weather Station Dashboard
---

<Details title='About this dashboard'>
  This dashboard analyzes weather station data using Evidence.dev. You can select the year, month, and day to view specific data points from station 01.
</Details>

<Dropdown name=year title="Select Year">
    <DropdownOption value=2025 valueLabel="2025"/>
    <DropdownOption value=2024 valueLabel="2024"/>
</Dropdown>

<Dropdown name=month title="Select Month">
    <DropdownOption value="03" valueLabel="March" />
    <DropdownOption value="02" valueLabel="February"/>
    <DropdownOption value="01" valueLabel="January"/>
    <DropdownOption value="04" valueLabel="April"/>
    <DropdownOption value="05" valueLabel="May"/>
    <DropdownOption value="06" valueLabel="June"/>
    <DropdownOption value="07" valueLabel="July"/>
    <DropdownOption value="08" valueLabel="August"/>
    <DropdownOption value="09" valueLabel="September"/>
    <DropdownOption value="10" valueLabel="October"/>
    <DropdownOption value="11" valueLabel="November"/>
    <DropdownOption value="12" valueLabel="December"/>
</Dropdown>

<Dropdown name=day title="Select Day">
    <DropdownOption value="27" valueLabel="27"/>
    <DropdownOption value="01" valueLabel="01"/>
    <DropdownOption value="02" valueLabel="02"/>
    <DropdownOption value="03" valueLabel="03"/>
    <DropdownOption value="04" valueLabel="04"/>
    <DropdownOption value="05" valueLabel="05"/>
    <DropdownOption value="06" valueLabel="06"/>
    <DropdownOption value="07" valueLabel="07"/>
    <DropdownOption value="08" valueLabel="08"/>
    <DropdownOption value="09" valueLabel="09"/>
    <DropdownOption value="10" valueLabel="10"/>
    <DropdownOption value="11" valueLabel="11"/>
    <DropdownOption value="12" valueLabel="12"/>
    <DropdownOption value="13" valueLabel="13"/>
    <DropdownOption value="14" valueLabel="14"/>
    <DropdownOption value="15" valueLabel="15"/>
    <DropdownOption value="16" valueLabel="16"/>
    <DropdownOption value="17" valueLabel="17"/>
    <DropdownOption value="18" valueLabel="18"/>
    <DropdownOption value="19" valueLabel="19"/>
    <DropdownOption value="20" valueLabel="20"/>
    <DropdownOption value="21" valueLabel="21"/>
    <DropdownOption value="22" valueLabel="22"/>
    <DropdownOption value="23" valueLabel="23"/>
    <DropdownOption value="24" valueLabel="24"/>
    <DropdownOption value="25" valueLabel="25"/>
    <DropdownOption value="26" valueLabel="26"/>
    <DropdownOption value="28" valueLabel="28"/>
    <DropdownOption value="29" valueLabel="29"/>
    <DropdownOption value="30" valueLabel="30"/>
    <DropdownOption value="31" valueLabel="31"/>
</Dropdown>

# Weather Station Data: {inputs.year.value}-{inputs.month.value}-{inputs.day.value}

## Weather Station Information

Weather station is located at coordinates: 30.0626, 31.4916

## Weather Statistics Summary

```sql summary_stats
  select
    round(min(temperature), 2) as min_temp,
    round(max(temperature), 2) as max_temp,
    round(avg(temperature), 2) as avg_temp,
    round(min(humidity), 2) as min_humidity,
    round(max(humidity), 2) as max_humidity,
    round(avg(humidity), 2) as avg_humidity,
    round(min(pressure), 2) as min_pressure,
    round(max(pressure), 2) as max_pressure,
    round(avg(pressure), 2) as avg_pressure
  from stations
```

<DataTable
  data={summary_stats}
  title="Weather Statistics Summary"
/>

## Temperature Distribution

```sql temp_data
  select
    timestamp,
    temperature
  from stations
```

<LineChart
  data={temp_data}
  x=timestamp
  y=temperature
  title="Temperature Distribution"
  xAxisTitle="Temperature (°C)"
  yAxisTitle="Count"
/>

## Humidity Distribution

```sql humidity_data
  select
    timestamp,
    humidity
  from stations
```

<LineChart
  data={humidity_data}
  x=timestamp
  y=humidity
  title="Humidity Distribution"
  xAxisTitle="Humidity (%)"
  yAxisTitle="Count"
/>

## Temperature vs Humidity

```sql temp_vs_humidity
  select 
    temperature,
    humidity
  from stations
```

<ScatterPlot
  data={temp_vs_humidity}
  x=temperature
  y=humidity
  xAxisTitle="Temperature (°C)"
  yAxisTitle="Humidity (%)"
  title="Temperature vs Humidity Correlation"
/>

## Raw Data Sample

```sql raw_data
  select
    timestamp::string as timestamp,
    temperature,
    humidity,
    pressure
  from stations
```

<DataTable 
  data={raw_data} 
  title="Sample Weather Data"
  search=true
  pagination=true
/>

<Details title='About The Measurements'>

## Measurement Explanations
- **Temperature**: Ambient temperature in degrees Celsius
- **Humidity**: Relative humidity as a percentage
- **Pressure**: Atmospheric pressure in hectopascals (hPa)

</Details>
