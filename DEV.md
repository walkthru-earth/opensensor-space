# Development Notes

## Near Real-Time Data Query

The near-real-time page (`pages/Stations/[station]/near-real-time.md`) reads directly from the latest 15-minute parquet file using dynamic URL construction.

### How It Works

1. **URL Construction in SQL** - We build the parquet URL using DuckDB's date functions (not JavaScript):

```sql
SELECT
  *,
  replace(replace(storage_url, 's3://', 'https://'), 'opendata.source.coop/', 'opendata.source.coop.s3.amazonaws.com/')
    || 'year=' || year(current_timestamp AT TIME ZONE 'UTC')
    || '/month=' || lpad(month(current_timestamp AT TIME ZONE 'UTC')::varchar, 2, '0')
    || '/day=' || lpad(day(current_timestamp AT TIME ZONE 'UTC')::varchar, 2, '0')
    || '/data_' || lpad(hour(current_timestamp AT TIME ZONE 'UTC')::varchar, 2, '0')
    || lpad((floor((minute(current_timestamp AT TIME ZONE 'UTC') - 1) / 15) * 15)::int::varchar, 2, '0')
    || '.parquet' as realtime_parquet_url
FROM station_registry
WHERE station_id = '${params.station}'
```

2. **Query Chaining** - The second query references the URL from the first:

```sql
FROM read_parquet('${station_info[0].realtime_parquet_url}')
```

### Why Not JavaScript?

Evidence.dev's `${}` syntax in SQL queries only supports:
- Query result interpolation (`${query_name}`)
- URL params (`${params.x}`)
- Input values (`${inputs.x}`)

**JavaScript functions like `Date()` or IIFEs do NOT work** inside SQL code blocks. The SQL is executed by DuckDB, not JavaScript.

### 15-Minute Bucket Logic

Files are named like `data_0415.parquet` (hour=04, minute bucket=15).

The formula `floor((minute - 1) / 15) * 15` calculates:
- Minutes 0-14 → bucket 0 (but we subtract 1 first, so minutes 1-15 → 0)
- Minutes 15-29 → bucket 15
- Minutes 30-44 → bucket 30
- Minutes 45-59 → bucket 45

### URL Transformation

The storage URL in the registry uses S3 format:
```
s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/station=XXX/
```

DuckDB-wasm needs HTTPS:
```
https://us-west-2.opendata.source.coop.s3.amazonaws.com/walkthru-earth/opensensor-space/enviroplus/station=XXX/
```

The SQL `replace()` functions handle this conversion.
