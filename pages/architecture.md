---
title: System Architecture
description: Detailed architecture and data flow of the OpenSensor network
---

## System Architecture

### High-Level Overview

<Mermaid title="System Architecture" chart={`
graph TB
    subgraph "Edge Device - Raspberry Pi"
        Sensors[Environmental Sensors<br/>BME280, Gas, LTR559, PMS5003]
        Collector[Data Collector<br/>Python + Polars]
        LocalStorage[Local Parquet Files<br/>Hive Partitioned]
    end
    subgraph "Cloud Storage"
        S3[S3-Compatible Storage<br/>AWS S3, GCS, Source.coop]
        DataLake[Data Lake<br/>station=XX/year=YYYY/month=MM/day=DD/]
    end
    subgraph "Analytics"
        DuckDB[DuckDB Analytics<br/>Browser or Server]
        Dashboard[Evidence.dev Dashboard<br/>Real-time Visualization]
    end
    Sensors -->|Read every 5 seconds| Collector
    Collector -->|Batch every 15 minutes| LocalStorage
    LocalStorage -->|Auto-sync every 15 min| S3
    S3 --> DataLake
    DataLake --> DuckDB
    DuckDB --> Dashboard
    style Collector fill:#e1f5ff
    style LocalStorage fill:#ffe1f5
    style S3 fill:#fff5e1
    style Dashboard fill:#e1ffe1
`}/>

**Data Flow:**
1. **Collect**: Read sensors every 5 seconds
2. **Batch**: Accumulate 180 readings (15 minutes)
3. **Write**: Save as Hive-partitioned Parquet
4. **Sync**: Upload to S3 automatically
5. **Analyze**: Query with DuckDB from anywhere

---

## Component Architecture

<Mermaid title="Component Architecture" chart={`
graph TB
    subgraph "CLI Application"
        CLI[opensensor CLI<br/>Typer Framework]
        Setup[Setup Command]
        Start[Start Command]
        Sync[Sync Command]
    end
    subgraph "Configuration"
        Config[Pydantic Settings]
        EnvFile[.env File]
    end
    subgraph "Data Pipeline"
        Collector[Sensor Collector]
        Buffer[In-Memory Buffer<br/>180 readings]
        Polars[Polars DataFrame<br/>Columnar Processing]
        Writer[Parquet Writer]
    end
    subgraph "Sensors - I2C/UART"
        BME[BME280<br/>Temp, Pressure, Humidity]
        Gas[Gas Sensor<br/>Oxidised, Reducing, NH3]
        Light[LTR559<br/>Lux, Proximity]
        PM[PMS5003<br/>PM1, PM2.5, PM10]
    end
    subgraph "Storage"
        Local[Local Filesystem<br/>Hive Partitioning]
        ObStore[ObStore Client<br/>S3 Sync]
        Cloud[Cloud Object Storage]
    end
    CLI --> Setup
    CLI --> Start
    CLI --> Sync
    Setup --> Config
    Config --> EnvFile
    Start --> Collector
    Collector --> BME
    Collector --> Gas
    Collector --> Light
    Collector --> PM
    Collector --> Buffer
    Buffer --> Polars
    Polars --> Writer
    Writer --> Local
    Collector --> ObStore
    ObStore --> Cloud
    style Collector fill:#e1f5ff
    style Polars fill:#ffe1f5
    style Cloud fill:#fff5e1
`}/>

**Components:**
- **CLI**: User interface (setup, start, sync, status)
- **Collector**: Reads sensors, manages batches
- **Polars**: Fast columnar data processing
- **ObStore**: Efficient S3 sync (Rust-based)
- **Hive Partitioning**: Time-based organization

---

## Data Flow

### Sensor to Cloud Pipeline

<Mermaid title="Sensor to Cloud Pipeline" chart={`
sequenceDiagram
    participant Sensors
    participant Collector
    participant Buffer
    participant Polars
    participant FileSystem
    participant S3
    loop Every 5 seconds
        Collector->>Sensors: Read all sensors
        Sensors-->>Collector: temperature, humidity, PM2.5, etc
        Collector->>Collector: Compensate CPU temperature
        Collector->>Buffer: Append reading
    end
    Note over Buffer: 15 minutes elapsed<br/>180 readings collected
    Collector->>Polars: Create DataFrame from buffer
    Polars->>Polars: Optimize dtypes Float32
    Polars->>Polars: Cast timestamp to UTC datetime
    Polars->>FileSystem: Write Hive-partitioned Parquet
    Note over FileSystem: Path: station=UUID/year=YYYY/month=MM/day=DD/data_HHMM.parquet
    Collector->>Buffer: Clear buffer
    alt Auto-sync enabled and interval elapsed
        Collector->>S3: Upload new Parquet files
        S3-->>Collector: Upload complete
    end
`}/>

**Timing:**
- **Read Interval**: 5 seconds
- **Batch Duration**: 900 seconds (15 minutes)
- **Batch Size**: ~180 readings
- **Sync Interval**: 15 minutes (configurable)

### Batch Processing Flow

<Mermaid title="Batch Processing Flow" chart={`
flowchart LR
    A[Start] --> B[Read Sensors]
    B --> C[15 min elapsed?]
    C -->|No| D[Sleep 5s]
    D --> B
    C -->|Yes| E[Create DataFrame]
    E --> F[Extract Partition Values<br/>year, month, day]
    F --> G[Optimize Types<br/>Float32, DateTime]
    G --> H[Build Path<br/>station=UUID/year=YYYY/...]
    H --> I[Write Parquet<br/>Snappy compression]
    I --> J[Sync time?]
    J -->|Yes| K[Upload to S3]
    J -->|No| L[Continue]
    K --> L
    L --> M[Clear Buffer]
    M --> B
    style E fill:#e1f5ff
    style I fill:#ffe1f5
    style K fill:#fff5e1
`}/>

### Storage Structure

Your data is organized using **Hive Partitioning**, which makes querying efficient and cost-effective.

```bash
output/
└── station={UUID}/
    └── year={YYYY}/
        └── month={MM}/
            └── day={DD}/
                ├── data_0900.parquet  (15-min batch)
                ├── data_0915.parquet
                └── ...
```
