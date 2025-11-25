-- Station registry - centralized metadata for all stations
-- Add new stations here using UNION ALL
SELECT
    '0195ae3c-43e0-7624-8c5c-7424adbcc30d' AS station_id,
    'Enviro+' AS station_name,
    'enviroplus' AS sensor_type,
    30.0626 AS latitude,
    31.4916 AS longitude,
    'Indoor' AS station_type,
    's3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=0195ae3c-43e0-7624-8c5c-7424adbcc30d/' AS storage_url

-- To add more stations, use UNION ALL:
-- UNION ALL
-- SELECT
--     'new-uuid-here' AS station_id,
--     'Station Name' AS station_name,
--     'enviroplus' AS sensor_type,
--     0.0 AS latitude,
--     0.0 AS longitude,
--     'Indoor' AS station_type,
--     's3://...' AS storage_url
