-- Station registry - reads from CSV
-- CSV is synced from YAML files on contributions branch during deploy
SELECT
    station_id,
    station_name,
    sensor_type,
    latitude,
    longitude,
    station_type,
    storage_url,
    description,
    contributor_name,
    contributor_url,
    submitted_at,
    status
FROM read_csv_auto('sources/stations/stations.csv')
WHERE status = 'approved'
