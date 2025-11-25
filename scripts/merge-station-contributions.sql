-- Merge station contributions from YAML files into stations.csv
-- Run with: duckdb -c ".read scripts/merge-station-contributions.sql"

INSTALL yaml FROM community;
INSTALL spatial;
LOAD yaml;
LOAD spatial;

-- Create temp table with existing stations from CSV
CREATE TEMP TABLE existing_stations AS
SELECT * FROM read_csv_auto('sources/stations/stations.csv');

-- Create temp table with new stations from YAML files (.yml and .md)
CREATE TEMP TABLE new_stations AS
SELECT
    yaml.station_id,
    yaml.station_name,
    yaml.sensor_type,
    ST_Y(ST_GeomFromGeoJSON(yaml.location)) as latitude,
    ST_X(ST_GeomFromGeoJSON(yaml.location)) as longitude,
    yaml.station_type,
    yaml.storage_url,
    COALESCE(yaml.description, '') as description,
    COALESCE(yaml.contributor_name, '') as contributor_name,
    COALESCE(yaml.contributor_url, '') as contributor_url,
    yaml.submitted_at::VARCHAR as submitted_at,
    'pending' as status
FROM (
    SELECT * FROM read_yaml_objects('content/stations/*.yml')
    UNION ALL
    SELECT * FROM read_yaml_objects('content/stations/*.md')
)
WHERE yaml.station_id NOT IN (SELECT station_id FROM existing_stations);

-- Show what's being added
SELECT 'New stations to add:' as message;
SELECT station_id, station_name, station_type FROM new_stations;

-- Export merged results to CSV
COPY (
    SELECT * FROM existing_stations
    UNION ALL
    SELECT * FROM new_stations
    ORDER BY submitted_at DESC
) TO 'sources/stations/stations.csv' (HEADER, DELIMITER ',');

SELECT 'Done! Merged ' || COUNT(*) || ' new station(s)' as result FROM new_stations;
