# Contributing Stations to OpenSensor

## Quick Start

1. Go to [opensensor.space/admin](https://opensensor.space/admin/)
2. Sign in with GitHub
3. Fill out the station form (you'll need to generate a UUIDv7 at [uuidgenerator.net/version7](https://www.uuidgenerator.net/version7))
4. Submit → PR created → Auto-validated → Merged

## Workflow Overview

```mermaid
flowchart LR
    A[User] -->|1. Submit Form| B[Decap CMS]
    B -->|2. Creates PR| C[contributions-clean branch]
    C -->|3. Triggers| D[Validation Workflow]
    D -->|4. S3 Check| E[Auto-comment on PR]
    E -->|5. Admin Review| F[Merge to main]
```

## Detailed Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CMS as Decap CMS
    participant Fork as User's Fork
    participant PR as Pull Request
    participant GH as GitHub Actions
    participant S3 as S3 Storage

    U->>CMS: Submit station form
    CMS->>Fork: Create MD file in fork
    Fork->>PR: Create PR to contributions-clean
    PR->>GH: Trigger validation
    GH->>S3: aws s3 ls --no-sign-request
    S3-->>GH: ✓ Files exist
    GH->>PR: Comment validation results
    PR->>PR: Admin reviews & merges
```

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production - Evidence dashboard |
| `contributions-clean` | CMS submissions (YAML files) |

## Files

| File | Description |
|------|-------------|
| `content/stations/*.yml` | Station submissions (on contributions-clean) |
| `sources/stations/stations.csv` | Station registry (on main) |
| `scripts/merge-station-contributions.sql` | DuckDB script to merge YAML → CSV |

## Station Status

- `pending` - Awaiting validation
- `approved` - Validated and visible on dashboard

## Requirements

Your S3 storage URL must:
- Be publicly accessible (no auth required)
- Contain Parquet files in the expected structure
- Follow the path format: `s3://bucket/path/to/station/`
