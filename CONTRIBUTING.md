# Contributing Stations to OpenSensor

## Quick Start

1. Go to [opensensor.space/admin](https://opensensor.space/admin/)
2. Sign in with GitHub (this forks the repo to your account)
3. Fill out the station form
4. Submit → PR created → Auto-validated → Merged to CSV

## Workflow Overview

```mermaid
flowchart LR
    A[User] -->|1. Submit Form| B[Decap CMS]
    B -->|2. Fork + PR| C[contributions branch]
    C -->|3. Validates| D[GitHub Actions]
    D -->|4. Merge PR| C
    C -->|5. Triggers| E[Process Workflow]
    E -->|6. DuckDB YAML→CSV| F[stations.csv PR]
    F -->|7. Merge| G[main branch]
    G -->|8. Deploy| H[Dashboard]
```

## Detailed Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CMS as Decap CMS
    participant Fork as User's Fork
    participant CB as contributions branch
    participant VA as Validate Workflow
    participant S3 as S3 Storage
    participant PA as Process Workflow
    participant DB as DuckDB
    participant M as main branch

    U->>CMS: 1. Submit station form
    CMS->>Fork: 2. Create YAML in fork
    Fork->>CB: 3. Open PR to contributions
    CB->>VA: 4. Trigger validation
    VA->>S3: 5. aws s3 ls --no-sign-request
    S3-->>VA: 6. ✓ Files exist
    VA->>CB: 7. Comment results on PR
    Note over CB: Admin reviews & merges PR
    CB->>PA: 8. Trigger on push to contributions
    PA->>DB: 9. read_yaml_objects('*.yml')
    DB->>DB: 10. Merge with existing CSV
    PA->>M: 11. Create PR with updated CSV
    Note over M: Admin merges stations PR
    M->>M: 12. Deploy to GitHub Pages
```

## Data Flow

```mermaid
flowchart TB
    subgraph contributions["contributions branch"]
        YAML["content/stations/*.yml"]
    end

    subgraph workflow["GitHub Actions"]
        DuckDB["DuckDB v1.4.2<br/>YAML Extension"]
    end

    subgraph main["main branch"]
        CSV["sources/stations/stations.csv"]
        SQL1["sources/stations/station_registry.sql"]
        SQL2["sources/stations/all_stations.sql"]
    end

    subgraph dashboard["Evidence Dashboard"]
        UI["opensensor.space"]
    end

    subgraph storage["S3 Storage"]
        Parquet["Hive-partitioned Parquet"]
    end

    YAML -->|read_yaml_objects| DuckDB
    DuckDB -->|COPY TO CSV| CSV
    CSV -->|read_csv_auto| SQL1
    SQL1 -->|approved stations| UI
    SQL2 -->|read_parquet| Parquet
    Parquet --> UI
```

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production - Evidence dashboard, stations.csv |
| `contributions` | CMS submissions (YAML files) |

## Files

| File | Location | Description |
|------|----------|-------------|
| `content/stations/*.yml` | contributions | Station YAML submissions |
| `sources/stations/stations.csv` | main | Station registry (CSV) |
| `sources/stations/station_registry.sql` | main | Query approved stations |
| `sources/stations/all_stations.sql` | main | Query sensor data from S3 |

## Station Status

| Status | Description |
|--------|-------------|
| `pending` | Newly added, awaiting approval |
| `approved` | Validated and visible on dashboard |

## DuckDB Queries

### Station Registry (station_registry.sql)

```sql
SELECT * FROM read_csv_auto('sources/stations/stations.csv')
WHERE status = 'approved'
```

### All Stations Data (all_stations.sql)

```sql
SELECT
    station as station_id,
    date_trunc('hour', timestamp) as timestamp,
    round(avg(temperature), 2) as temperature,
    -- ... other metrics
FROM read_parquet(
    's3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/**/*.parquet',
    union_by_name=true,
    hive_partitioning=true
)
GROUP BY station, date_trunc('hour', timestamp)
```

### YAML to CSV Processing (GitHub Actions)

```sql
INSTALL yaml FROM community;
LOAD yaml;

-- Read YAML files (struct access via yaml.field)
SELECT
    yaml.station_id,
    yaml.station_name,
    CAST(json_extract(yaml.location::JSON, '$.coordinates[1]') AS DOUBLE) as latitude,
    CAST(json_extract(yaml.location::JSON, '$.coordinates[0]') AS DOUBLE) as longitude,
    -- ... other fields
FROM read_yaml_objects('content/stations/*.yml')
```

## Requirements

Your S3 storage URL must:
- Be publicly accessible (no auth required)
- Contain Parquet files with hive partitioning
- Follow the path format: `station={STATION_ID}/year={year}/month={month}/day={day}/*.parquet`

## Validation Checks

1. **UUIDv7 Format** - Station ID must be valid UUIDv7
2. **S3 URL Format** - Must start with `s3://`
3. **S3 Accessibility** - Path must be publicly listable
4. **Parquet Files** - Data must exist in the specified location
