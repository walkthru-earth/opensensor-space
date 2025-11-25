-- Hourly aggregated data for all stations
-- Reduces ~10M raw readings to ~6K hourly averages per station (much faster for wasm)
SELECT
    station as station_id,
    date_trunc('hour', timestamp) as timestamp,

    -- Environmental metrics
    round(avg(temperature), 2) as temperature,
    round(avg(humidity), 2) as humidity,
    round(avg(pressure), 2) as pressure,

    -- Gas sensors
    round(avg(oxidised), 2) as oxidised,
    round(avg(reducing), 2) as reducing,
    round(avg(nh3), 2) as nh3,

    -- Light and proximity
    round(avg(lux), 2) as lux,
    round(avg(proximity), 2) as proximity,

    -- Particulate matter
    round(avg(pm1), 2) as pm1,
    round(avg(pm25), 2) as pm25,
    round(avg(pm10), 2) as pm10,

    -- Particle counts (optional, comment out if not needed)
    round(avg(particles_03um), 0) as particles_03um,
    round(avg(particles_05um), 0) as particles_05um,
    round(avg(particles_10um), 0) as particles_10um,
    round(avg(particles_25um), 0) as particles_25um,
    round(avg(particles_50um), 0) as particles_50um,
    round(avg(particles_100um), 0) as particles_100um,

    -- Record count per hour (useful for data quality)
    count(*) as readings_count
FROM read_parquet(
    's3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/**/*.parquet',
    union_by_name=true,
    hive_partitioning=true
)
GROUP BY station, date_trunc('hour', timestamp)
ORDER BY station, timestamp;
