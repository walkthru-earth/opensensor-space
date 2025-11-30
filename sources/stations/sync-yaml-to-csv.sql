-- Sync YAML station files to stations.csv
-- YAML files on contributions branch are the source of truth
-- Handles: ADD, UPDATE, DELETE

INSTALL yaml FROM community;
LOAD yaml;

-- Read ALL stations from YAML files
CREATE TEMP TABLE yaml_stations AS
SELECT
    yaml.station_id::VARCHAR as station_id,
    yaml.station_name::VARCHAR as station_name,
    yaml.sensor_type::VARCHAR as sensor_type,
    CAST(json_extract(yaml.location::JSON, '$.coordinates[1]') AS DOUBLE) as latitude,
    CAST(json_extract(yaml.location::JSON, '$.coordinates[0]') AS DOUBLE) as longitude,
    yaml.station_type::VARCHAR as station_type,
    yaml.storage_url::VARCHAR as storage_url,
    COALESCE(yaml.description, '')::VARCHAR as description,
    COALESCE(yaml.contributor_name, '')::VARCHAR as contributor_name,
    COALESCE(yaml.contributor_url, '')::VARCHAR as contributor_url,
    yaml.submitted_at::VARCHAR as submitted_at,
    COALESCE(yaml.status, 'pending')::VARCHAR as status
FROM read_yaml_objects('content/stations/*.yml');

-- Export to CSV (replaces existing file)
COPY (
    SELECT * FROM yaml_stations
    ORDER BY submitted_at DESC
) TO 'sources/stations/stations.csv' (HEADER, DELIMITER ',');

SELECT 'Synced ' || COUNT(*) || ' station(s)' as result FROM yaml_stations;
