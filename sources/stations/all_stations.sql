-- Hourly aggregated data for all approved stations.
-- Driven by the registry storage_url column, so contributors on any public
-- source.coop bucket work without editing this file. Reduces ~10M raw
-- readings to ~6K hourly averages per station (faster for duckdb-wasm).
--
-- source.coop bucket names contain dots (e.g. us-west-2.opendata.source.coop),
-- which breaks virtual-hosted SSL. Force path style + region us-west-2.

INSTALL httpfs;
LOAD httpfs;
SET s3_url_style = 'path';
SET s3_region = 'us-west-2';

SET VARIABLE station_globs = (
    SELECT list(storage_url || '**/*.parquet')
    FROM read_csv_auto('sources/stations/stations.csv')
    WHERE status = 'approved'
);

SELECT
    station as station_id,
    date_trunc('hour', timestamp) as timestamp,

    round(avg(temperature), 2) as temperature,
    round(avg(humidity), 2) as humidity,
    round(avg(pressure), 2) as pressure,

    round(avg(oxidised), 2) as oxidised,
    round(avg(reducing), 2) as reducing,
    round(avg(nh3), 2) as nh3,

    round(avg(lux), 2) as lux,
    round(avg(proximity), 2) as proximity,

    round(avg(pm1), 2) as pm1,
    round(avg(pm25), 2) as pm25,
    round(avg(pm10), 2) as pm10,

    round(avg(particles_03um), 0) as particles_03um,
    round(avg(particles_05um), 0) as particles_05um,
    round(avg(particles_10um), 0) as particles_10um,
    round(avg(particles_25um), 0) as particles_25um,
    round(avg(particles_50um), 0) as particles_50um,
    round(avg(particles_100um), 0) as particles_100um,

    count(*) as readings_count
FROM read_parquet(
    getvariable('station_globs'),
    union_by_name = true,
    hive_partitioning = true
)
GROUP BY station, date_trunc('hour', timestamp)
ORDER BY station, timestamp;
