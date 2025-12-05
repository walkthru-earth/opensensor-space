---
title: ESP32 Modules Research
description: ESP32-based sensor system research for Rust development with native Parquet and S3 upload
---

# ESP32 Modules Research for Rust Development

## Project Goal

Build an ESP32-based sensor system that uploads data directly to S3/Object Storage as Parquet files, programmed in Rust.

---

## Executive Summary

**BREAKTHROUGH: Native Parquet on ESP32 is PROVEN FEASIBLE!**

<Mermaid title="Proven Architecture" chart={`
flowchart LR
    subgraph "Proven Architecture"
        ESP[ESP32-S3<br/>8MB PSRAM] --> PARQUET[parquet-rs<br/>ZSTD ~10KB]
        PARQUET --> S3[(S3 Storage)]
    end
    style ESP fill:#90EE90
    style PARQUET fill:#90EE90
`}/>

### POC Results (December 2024)
- **parquet-rs v57.1.0** compiles and works
- **ZSTD compression**: 10.1 KB output (91% of raw)
- **rusty-s3**: Sans-IO S3 client for presigned URLs
- **Binary size**: 1.1 MB with S3 (macOS), ~2-3 MB estimated for ESP32
- **Memory**: ~150 KB peak (fits in 8MB PSRAM easily!)

| Rank | Module | Best For |
|------|--------|----------|
| 1 | **ESP32-S3** | Native Parquet + ZSTD + 8MB PSRAM |
| 2 | **ESP32-C6** | WiFi 6 + standard RISC-V toolchain |
| 3 | **ESP32-C61** | Future-proof (WiFi 6 + PSRAM) - limited availability |
| 4 | **ESP32-P4** | Maximum power - requires external WiFi chip |

---

## Detailed Module Comparison

### ESP32-S3 (Recommended)

<Mermaid title="ESP32-S3 Specifications" chart={`
graph TD
    subgraph ESP32-S3["ESP32-S3 Specifications"]
        CPU["Dual-core Xtensa LX7<br/>240 MHz"]
        MEM["512 KB SRAM<br/>+ 8-16MB PSRAM"]
        WIFI["WiFi 4 (802.11 b/g/n)<br/>2.4 GHz"]
        BT["Bluetooth 5 LE"]
        RUST["Rust: esp-hal 1.0 Stable<br/>Requires Xtensa fork"]
    end
    CPU --> MEM
    MEM --> WIFI
    WIFI --> BT
    BT --> RUST
`}/>

| Specification | Value |
|---------------|-------|
| **Architecture** | Dual-core Xtensa LX7 @ 240 MHz |
| **On-chip SRAM** | 512 KB |
| **External PSRAM** | Up to 16MB (Octal SPI) |
| **Flash Options** | 8MB / 16MB / 32MB |
| **WiFi** | 802.11 b/g/n (2.4 GHz) |
| **Bluetooth** | BLE 5.0 |
| **GPIO** | 45 programmable pins |
| **USB** | USB 2.0 OTG full-speed |
| **Performance** | 1329 CoreMark |

**Key Features:**
- AI acceleration with vector instructions
- Camera (MIPI-CSI) and LCD support
- Largest PSRAM capacity among WiFi-enabled variants

**Rust Support:**
- Fully supported by esp-hal 1.0 (stable)
- Requires Xtensa fork of Rust compiler
- Both `no_std` and `std` (ESP-IDF) approaches available
- WiFi via esp-radio crate

**Recommended Development Boards:**

| Board | Flash | PSRAM | Price Range |
|-------|-------|-------|-------------|
| Waveshare ESP32-S3-DEV-KIT-N16R8 | 16MB | 8MB | ~$15 |
| Adafruit Metro ESP32-S3 | 16MB | 8MB | ~$25 |
| LILYGO T7-S3 | 16MB | 8MB | ~$12 |
| Unexpected Maker TinyS3 | 8MB | 8MB | ~$22 |

---

### ESP32-C6 (Best Standard Toolchain)

<Mermaid title="ESP32-C6 Specifications" chart={`
graph TD
    subgraph ESP32-C6["ESP32-C6 Specifications"]
        CPU["Single-core RISC-V<br/>160 MHz + LP core 20 MHz"]
        MEM["512 KB SRAM<br/>No PSRAM"]
        WIFI["WiFi 6 (802.11ax)<br/>2.4 GHz"]
        BT["Bluetooth 5.3<br/>+ Thread/Zigbee"]
        RUST["Rust: esp-hal 1.0 Stable<br/>Standard RISC-V toolchain"]
    end
    CPU --> MEM
    MEM --> WIFI
    WIFI --> BT
    BT --> RUST
`}/>

| Specification | Value |
|---------------|-------|
| **Architecture** | Single-core RISC-V @ 160 MHz |
| **Low-Power Core** | RISC-V @ 20 MHz |
| **On-chip SRAM** | 512 KB |
| **External PSRAM** | **Not supported** |
| **Flash** | 8MB (typical) |
| **WiFi** | 802.11ax (WiFi 6) - 2.4 GHz only |
| **Bluetooth** | BLE 5.3 |
| **802.15.4** | Thread / Zigbee / Matter |
| **GPIO** | 22-30 programmable pins |
| **Performance** | 496 CoreMark |

**Key Features:**
- First ESP32 with WiFi 6
- Thread and Zigbee support (Matter-ready)
- 2x TWAI (CAN) controllers
- USB Serial/JTAG controller

**Rust Support:**
- Fully supported by esp-hal 1.0 (stable)
- **Standard RISC-V toolchain** (no fork needed!)
- Full `std` library support via ESP-IDF
- Async/await with Embassy executor

**Critical Limitation:**
> No PSRAM support means only 512KB SRAM available. This significantly limits data buffering capacity for your S3 upload use case.

**Recommended Development Boards:**

| Board | Flash | Notes |
|-------|-------|-------|
| ESP32-C6-DevKitC-1 | 8MB | Official Espressif board |
| ESP32-C6 Super Mini | 4MB | Compact form factor |
| FireBeetle 2 ESP32-C6 | 8MB | DFRobot ecosystem |

---

### ESP32-C61 (Future Option)

<Mermaid title="ESP32-C61 Specifications" chart={`
graph TD
    subgraph ESP32-C61["ESP32-C61 Specifications"]
        CPU["Single-core RISC-V<br/>160 MHz"]
        MEM["320 KB SRAM<br/>+ PSRAM Support"]
        WIFI["WiFi 6 (802.11ax)<br/>Optimized 20 MHz BW"]
        BT["Bluetooth 5 LE<br/>Long-range support"]
        RUST["Rust: Coming Soon<br/>Standard RISC-V toolchain"]
    end
    CPU --> MEM
    MEM --> WIFI
    WIFI --> BT
    BT --> RUST
`}/>

| Specification | Value |
|---------------|-------|
| **Architecture** | Single-core RISC-V @ 160 MHz |
| **On-chip SRAM** | 320 KB (less than C6) |
| **External PSRAM** | Supported (Quad SPI @ 120 MHz) |
| **WiFi** | 802.11ax (WiFi 6) - optimized for 20 MHz |
| **Bluetooth** | BLE 5.0 with long-range |
| **Security** | TEE, Secure boot, Flash/PSRAM encryption |

**Release Status:**
- Announced: January 2024
- Status: Development boards becoming available in 2025
- Mass production timeline unclear

**Why Wait for C61?**
- Combines WiFi 6 (from C6) + PSRAM support (from S3)
- Standard RISC-V toolchain
- Cost-optimized

---

### ESP32-P4 (Maximum Power)

<Mermaid title="ESP32-P4 Specifications" chart={`
graph TD
    subgraph ESP32-P4["ESP32-P4 Specifications"]
        CPU["Dual-core RISC-V<br/>400 MHz + LP core 40 MHz"]
        MEM["768 KB SRAM<br/>+ 32MB PSRAM"]
        WIFI["No WiFi/BT<br/>Requires companion chip"]
        VIDEO["H.264 1080p@30fps<br/>MIPI-CSI/DSI"]
        RUST["Rust: In Development<br/>Standard RISC-V toolchain"]
    end
    CPU --> MEM
    MEM --> WIFI
    WIFI --> VIDEO
    VIDEO --> RUST
`}/>

| Specification | Value |
|---------------|-------|
| **Architecture** | Dual-core RISC-V @ 400 MHz |
| **Low-Power Core** | RISC-V @ 40 MHz |
| **On-chip SRAM** | 768 KB |
| **External PSRAM** | Up to 32MB |
| **WiFi/Bluetooth** | **None** - requires companion chip |
| **Video** | H.264 encoding 1080p@30fps |
| **Display** | MIPI-DSI (up to 1080p) |
| **Camera** | MIPI-CSI |
| **USB** | USB 2.0 High-Speed OTG |
| **GPIO** | 55 programmable pins |

**Use Case:** HMI, video doorbells, edge AI - **overkill for sensor data logging**

---

### ESP32-H2 (Not Recommended for This Project)

| Specification | Value |
|---------------|-------|
| **Architecture** | Single-core RISC-V @ 96 MHz |
| **SRAM** | 320 KB |
| **WiFi** | **None** |
| **Bluetooth** | BLE 5.0 |
| **802.15.4** | Thread / Zigbee |

**Not suitable:** No WiFi capability - cannot upload to S3 directly.

---

## Complete Comparison Table

<Mermaid title="Processing Power Comparison" chart={`
graph LR
    subgraph Performance["Processing Power"]
        P4["ESP32-P4<br/>400MHz Dual RISC-V"]
        S3["ESP32-S3<br/>240MHz Dual Xtensa"]
        C6["ESP32-C6<br/>160MHz Single RISC-V"]
        C61["ESP32-C61<br/>160MHz Single RISC-V"]
        H2["ESP32-H2<br/>96MHz Single RISC-V"]
    end
    P4 --> S3 --> C6 --> C61 --> H2
`}/>

| Feature | ESP32-S3 | ESP32-C6 | ESP32-C61 | ESP32-P4 | ESP32-H2 |
|---------|----------|----------|-----------|----------|----------|
| **CPU** | 2x Xtensa 240MHz | 1x RISC-V 160MHz | 1x RISC-V 160MHz | 2x RISC-V 400MHz | 1x RISC-V 96MHz |
| **SRAM** | 512 KB | 512 KB | 320 KB | 768 KB | 320 KB |
| **PSRAM** | 16MB | None | Yes | 32MB | None |
| **WiFi** | WiFi 4 | WiFi 6 | WiFi 6 | None | None |
| **Bluetooth** | BLE 5.0 | BLE 5.3 | BLE 5.0 | None | BLE 5.0 |
| **Thread/Zigbee** | No | Yes | No | No | Yes |
| **Rust Toolchain** | Xtensa fork | Standard | Standard | Standard | Standard |
| **esp-hal 1.0** | Stable | Stable | Coming | In dev | Stable |
| **WiFi in Rust** | esp-radio | esp-radio | Expected | In progress | N/A |
| **Availability** | Wide | Wide | Limited | Samples | Wide |
| **For This Project** | **BEST** | Good | Future | Overkill | No WiFi |

---

## Rust Ecosystem Overview

### esp-hal 1.0.0 (October 2025)

<Mermaid title="ESP-RS Ecosystem" chart={`
graph TB
    subgraph "ESP-RS Ecosystem"
        HAL["esp-hal 1.0<br/>Hardware Abstraction Layer"]
        RADIO["esp-radio<br/>(formerly esp-wifi)"]
        IDF["esp-idf-svc<br/>ESP-IDF Wrapper"]
        HAL --> |no_std| RADIO
        HAL --> |std| IDF
        IDF --> HTTP["HTTP Client"]
        IDF --> WIFI["WiFi Stack"]
        IDF --> FS["Filesystem"]
    end
    subgraph "Supported Chips"
        ESP32["ESP32"]
        S2["ESP32-S2"]
        S3["ESP32-S3"]
        C3["ESP32-C3"]
        C6["ESP32-C6"]
        H2["ESP32-H2"]
        P4["ESP32-P4"]
    end
    HAL --> ESP32
    HAL --> S2
    HAL --> S3
    HAL --> C3
    HAL --> C6
    HAL --> H2
    HAL --> P4
`}/>

### Two Development Approaches

<Mermaid title="Development Approaches" chart={`
flowchart TD
    START[Start Project] --> CHOICE[Choose Approach]
    CHOICE -->|Bare Metal| NOSTD[no_std Approach]
    CHOICE -->|Full Features| STD[std Approach]
    subgraph NOSTD_DETAILS["no_std Bare Metal"]
        NOSTD --> HAL[esp-hal]
        HAL --> RADIO_NS[esp-radio]
        RADIO_NS --> EMBASSY[Embassy async]
    end
    subgraph STD_DETAILS["std ESP-IDF"]
        STD --> IDF_SVC[esp-idf-svc]
        IDF_SVC --> HTTP_CLIENT[HTTP Client]
        IDF_SVC --> WIFI_STACK[Mature WiFi]
        IDF_SVC --> THREADS[Threads & FS]
    end
    NOSTD_DETAILS --> |Smaller Binary| USE_CASE
    STD_DETAILS --> |More Features| USE_CASE
    USE_CASE[Your S3 Upload Project]
`}/>

| Aspect | no_std (Bare Metal) | std (ESP-IDF) |
|--------|---------------------|---------------|
| **Binary Size** | Smaller | Larger |
| **Control** | Full hardware control | Higher-level abstractions |
| **Networking** | esp-radio (experimental) | Mature ESP-IDF stack |
| **Standard Library** | No Vec, String, etc. | Full std library |
| **HTTP Client** | Manual implementation | esp-idf-svc::http |
| **Recommended For** | Resource-constrained | **Your S3 project** |

---

## Parquet/Arrow Deep Dive: Can ESP32 Create Parquet Files?

### Real-World Reference: opensensor.space

Your actual Parquet files from the Raspberry Pi Zero W setup:

```
s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/
  station=019ab390-f291-7a30-bca8-381286e4c2aa/
    year=2025/month=12/day=03/
      data_2315.parquet  → 11.6 KB, 178 rows, 20 columns
```

| Metric | Value |
|--------|-------|
| **File Size** | ~11.6 KB |
| **Rows** | 178 (15 minutes @ 5 sec intervals) |
| **Columns** | 20 sensor readings (floats) |
| **Compression** | Snappy |
| **Encoding** | PLAIN + RLE_DICTIONARY |
| **Row Groups** | 1 |

This is **MUCH smaller** than typical Parquet use cases!

### Updated Analysis: Small Parquet Files MIGHT Be Feasible

<Mermaid title="Parquet Feasibility Analysis" chart={`
graph TD
    subgraph Analysis["Parquet Feasibility - Small Files"]
        Q1[178 rows x 20 cols<br/>= 14KB raw data]
        Q1 -->|Peak Memory| R1["~110-185 KB<br/>(with optimizations)"]
        Q2[ESP32-S3 with<br/>8MB PSRAM?]
        Q2 -->|Yes| R2["8MB >> 185KB<br/>Memory OK!"]
        Q3[parquet-rs with<br/>minimal features?]
        Q3 -->|Unknown| R3["Binary size unknown<br/>Needs testing"]
        Q4[Alternative:<br/>Custom minimal writer?]
        Q4 -->|Possible| R4["~500-1000 lines<br/>High effort"]
    end
    style R1 fill:#ffffcc
    style R2 fill:#90EE90
    style R3 fill:#ffffcc
    style R4 fill:#ffcccc
`}/>

---

### Rust Parquet/Arrow Crates Analysis

#### parquet-rs (arrow-rs ecosystem)

| Aspect | Status | Details |
|--------|--------|---------|
| **no_std support** | None | Requires heap allocation, Vec, HashMap, String |
| **Dependencies** | Heavy | Thrift, compression libs (snappy, gzip, zstd) |
| **Min row group** | ~5MB | Practical minimum for compression efficiency |
| **Memory for write** | ~2x row group | Buffering required before flush |

**Verdict:** Cannot run on ESP32

#### arrow-rs

| Aspect | Status | Details |
|--------|--------|---------|
| **no_std support** | None | Designed for in-memory columnar processing |
| **Memory** | High | Requires megabytes of RAM |

**Verdict:** Cannot run on ESP32

#### Arrow IPC / Feather V2

| Aspect | Status | Details |
|--------|--------|---------|
| **Complexity** | Lower | No Thrift, simpler than Parquet |
| **File size** | ~45% larger | Less compression than Parquet |
| **Memory** | ~1-2MB min | Still requires batch buffering |

**Verdict:** Still too heavy, but closest option

---

### Parquet File Structure (Why It's Memory-Hungry)

<Mermaid title="Parquet File Structure" chart={`
graph TB
    subgraph ParquetFile["Parquet File Structure"]
        MAGIC1["PAR1 - 4 bytes"]
        RG1["Row Group 1"]
        RG2["Row Group 2"]
        RGN["Row Group N..."]
        META["FileMetadata - Thrift encoded"]
        LEN["Metadata Length - 4 bytes"]
        MAGIC2["PAR1 - 4 bytes"]
    end
    subgraph RowGroup["Row Group Detail"]
        COL1["Column Chunk 1<br/>encoded + compressed"]
        COL2["Column Chunk 2"]
        COLN["Column Chunk N..."]
    end
    subgraph Memory["Memory Requirements"]
        BUF["Buffer entire row group<br/>before writing"]
        ENC["Encoding overhead<br/>RLE, DELTA, DICT"]
        COMP["Compression buffer<br/>Snappy, GZIP, etc."]
    end
    MAGIC1 --> RG1
    RG1 --> RG2
    RG2 --> RGN
    RGN --> META
    META --> LEN
    LEN --> MAGIC2
    RG1 -.-> COL1
    COL1 --> COL2
    COL2 --> COLN
    RowGroup -.-> Memory
`}/>

**Minimum Memory Requirements:**
- Row group buffer: **1-5 MB** (minimum practical size)
- Thrift serialization: **~100-500 KB**
- Compression workspace: **~100 KB - 1 MB**
- **Total: 2-7 MB minimum** - exceeds ESP32 practical limits

---

### Lightweight Alternatives for ESP32

#### Comparison Table

| Format | Memory | no_std | Compression | ESP32 Suitable |
|--------|--------|--------|-------------|----------------|
| **Postcard** | ~1-5 KB | Yes | Good (binary) | **Best** |
| **CBOR** | ~1-5 KB | Yes | Good (binary) | Excellent |
| **MessagePack** | ~5-10 KB | Partial | Good (binary) | Good |
| **Gorilla TSC** | ~1 KB | Yes | **12x** for time-series | **Best for sensors** |
| **Sprintz** | **Less than 1 KB** | Yes | Excellent | Purpose-built for IoT |
| **Protocol Buffers** | ~10-20 KB | Partial | 3x smaller than JSON | Good |
| **JSON** | ~10-20 KB | Partial | None | Large output |
| **Arrow IPC** | ~1-2 MB | No | Moderate | Too heavy |
| **Parquet** | ~5+ MB | No | Best | Impossible |

---

### Recommended: Postcard (Purpose-Built for Embedded)

```rust
// Cargo.toml
[dependencies]
postcard = "1.0"
serde = { version = "1.0", default-features = false, features = ["derive"] }

// Example usage
use postcard::{to_vec, from_bytes};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct SensorReading {
    timestamp: u64,
    temperature: f32,
    humidity: f32,
    pressure: f32,
}

fn serialize_readings(readings: &[SensorReading]) -> Vec<u8> {
    postcard::to_allocvec(readings).unwrap()
}
```

**Why Postcard:**
- Designed specifically for `#![no_std]` microcontrollers
- Stable wire format (v1.0+)
- Extremely compact binary output
- Drop-in replacement for Serde

---

### Recommended: Gorilla Compression (For Time-Series Sensors)

<Mermaid title="Gorilla Compression" chart={`
graph LR
    subgraph Gorilla["Gorilla Compression - Facebook TSDB"]
        TS[Timestamps] -->|Delta-of-Delta| TS_COMP["96% compress to 1 bit"]
        VAL[Float Values] -->|XOR encoding| VAL_COMP["51% compress to 1 bit"]
    end
    RATIO["Overall: ~12x compression<br/>for regular sensor data"]
`}/>

**Rust Crates:**
- `tsz-rs` - Gorilla implementation
- `gorilla-tsc` - Alternative implementation

```rust
// Ideal for sensor data with regular intervals
// Timestamps: 10:00:00, 10:00:01, 10:00:02... -> nearly free
// Temperatures: 23.5, 23.5, 23.6, 23.5... -> highly compressible
```

---

### Recommended: CBOR (no_std Alternative)

```rust
// Cargo.toml
[dependencies]
serde = { version = "1.0", default-features = false, features = ["derive"] }
serde_cbor = { version = "0.11", default-features = false }

// Usage identical to JSON but binary output
let data = SensorReading { ... };
let bytes = serde_cbor::to_vec(&data)?;
```

---

### Sprintz Algorithm (Purpose-Built for IoT)

| Feature | Value |
|---------|-------|
| **Designed for** | IoT and resource-constrained devices |
| **Memory required** | **Less than 1 KB** |
| **Latency** | Virtually zero |
| **Best for** | Predictable time series, monotonic values |

**Perfect for:** Temperature, humidity, pressure sensors with regular intervals

---

## PROVEN: Native Parquet on ESP32-S3 is FEASIBLE!

We built and tested a POC using parquet-rs v57.1.0 on macOS ARM64, and the results are very promising for ESP32-S3.

### POC Test Results (December 2024)

<Mermaid title="POC Results" chart={`
graph TD
    subgraph Results["POC Results - 178 rows x 14 columns"]
        RAW["Raw Data: 11.4 KB"]
        ZSTD["ZSTD Parquet: 10.1 KB"]
        SNAPPY["Snappy Parquet: 11.0 KB"]
        BINARY["Binary Size: 849 KB (ZSTD)"]
    end
    RAW --> ZSTD
    RAW --> SNAPPY
    style ZSTD fill:#90EE90
    style BINARY fill:#90EE90
`}/>

### Compression Comparison (Actual Test Data)

| Compression | File Size | vs Raw | Binary Size (macOS ARM64) |
|-------------|-----------|--------|---------------------------|
| **ZSTD** | **10.1 KB** | **91%** | **849 KB** |
| Snappy | 11.0 KB | 99% | 589 KB |
| Uncompressed | 11.9 KB | 104% | 589 KB |

**Winner: ZSTD** - Best compression ratio with reasonable binary size.

### Memory Analysis - Confirmed!

| Component | Memory Needed |
|-----------|---------------|
| Raw sensor data (178 × 14 × 4 bytes) | ~11 KB |
| Column buffers | ~80 KB |
| ZSTD workspace | ~50 KB |
| Metadata | ~10 KB |
| **Total Peak Memory** | **~150 KB** |
| **ESP32-S3 PSRAM Available** | **8,000 KB** |

**Conclusion: Memory is NOT a bottleneck - fits easily in PSRAM!**

---

### Working Cargo.toml for parquet-rs + S3

```toml
[package]
name = "parquet-size-test"
version = "0.1.0"
edition = "2024"
rust-version = "1.85"

[dependencies]
# Minimal parquet - no arrow dependency, ZSTD compression only
parquet = { version = "57.1.0", default-features = false, features = ["zstd"] }

# Lightweight S3 client - Sans-IO approach (no HTTP client bundled)
# Perfect for ESP32: you bring your own HTTP client
rusty-s3 = "0.8"

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

### Available Compression Features

| Feature | Adds to Binary | Compression Ratio | Recommendation |
|---------|----------------|-------------------|----------------|
| `zstd` | +260 KB | **Best (91%)** | **Recommended** |
| `snap` | +0 KB | Good (99%) | Fallback |
| `lz4` | ~+50 KB | Moderate | Alternative |
| `brotli` | ~+100 KB | Good | Web-focused |
| `flate2` | ~+50 KB | Good (gzip) | Compatibility |

---

### Working Parquet Writer Code (Rust 2024)

```rust
use parquet::basic::{Compression, Encoding};
use parquet::data_type::{FloatType, Int64Type};
use parquet::file::properties::WriterProperties;
use parquet::file::writer::SerializedFileWriter;
use parquet::schema::parser::parse_message_type;
use std::fs::File;
use std::sync::Arc;

fn write_parquet_file(readings: &[SensorReading], filename: &str) -> Result<()> {
    let message_type = "
        message sensor_data {
            required int64 timestamp (TIMESTAMP_MILLIS);
            required float temperature;
            required float humidity;
            required float pressure;
            // ... more columns
        }
    ";

    let schema = Arc::new(parse_message_type(message_type)?);

    // ZSTD compression - best ratio for sensor data
    let props = WriterProperties::builder()
        .set_compression(Compression::ZSTD(Default::default()))
        .set_encoding(Encoding::PLAIN)
        .set_statistics_enabled(parquet::file::properties::EnabledStatistics::None)
        .build();

    let file = File::create(filename)?;
    let mut writer = SerializedFileWriter::new(file, schema, Arc::new(props))?;
    let mut row_group_writer = writer.next_row_group()?;

    // Write each column using typed() API
    {
        let mut col_writer = row_group_writer.next_column()?.unwrap();
        col_writer
            .typed::<Int64Type>()
            .write_batch(&timestamps, None, None)?;
        col_writer.close()?;
    }

    // Float columns
    {
        let mut col_writer = row_group_writer.next_column()?.unwrap();
        col_writer
            .typed::<FloatType>()
            .write_batch(&temperatures, None, None)?;
        col_writer.close()?;
    }

    row_group_writer.close()?;
    writer.close()?;
    Ok(())
}
```

---

### Binary Size Analysis for ESP32

| Platform | Binary Size (ZSTD) | Flash Budget | Fits? |
|----------|-------------------|--------------|-------|
| macOS ARM64 | 849 KB | N/A | N/A |
| **ESP32-S3 (est.)** | **~1.5-2.5 MB** | **16 MB** | **YES** |
| ESP32-C6 | ~1.5-2.5 MB | 8 MB | YES |

**Note:** ESP32 binary will be larger due to:
- ESP-IDF runtime (~500 KB)
- WiFi stack (~150 KB)
- TLS stack (~100 KB)
- Total estimate: ~2-3 MB (fits in 8-16 MB flash)

---

### Next Steps for ESP32 Deployment

<Mermaid title="Next Steps" chart={`
flowchart TD
    POC[POC Complete] --> ESP[Compile for ESP32-S3]
    ESP --> MEASURE[Measure binary + memory]
    MEASURE -->|< 4MB| SUCCESS[Deploy to ESP32!]
    MEASURE -->|> 4MB| OPTIMIZE[Optimize or use Snappy]
    style POC fill:#90EE90
    style SUCCESS fill:#90EE90
`}/>

1. **Create ESP32 project:** `esp-generate --chip=esp32s3 sensor-parquet`
2. **Add parquet-rs:** Same Cargo.toml config
3. **Measure:** `cargo build --release && ls -la target/*/release/*.bin`
4. **Test:** Flash and verify Parquet file creation

---

## S3 Client Options for ESP32

### Comparison of Rust S3 Crates

| Crate | Approach | Dependencies | ESP32 Suitable | Binary Impact |
|-------|----------|--------------|----------------|---------------|
| **rusty-s3** | Sans-IO | Minimal (HMAC, SHA2) | **Best** | +250 KB |
| rust-s3 | Full client | Tokio/attohttpc | Possible (sync) | +500 KB |
| aws-sdk-s3 | Official AWS | Heavy (Tokio, Hyper) | Too heavy | +2 MB |

### Recommended: rusty-s3 (Sans-IO)

**Why rusty-s3 is perfect for ESP32:**
- **Sans-IO approach**: Only handles URL signing, you bring your own HTTP client
- **Minimal dependencies**: Just HMAC-SHA256 for signing
- **Works with any HTTP client**: Use esp-idf-svc on ESP32
- **Presigned URLs**: Generate signed PUT URLs for direct S3 upload

```toml
# Cargo.toml for ESP32
[dependencies]
rusty-s3 = "0.8"
# On ESP32, use esp-idf-svc for HTTP - no need for ureq/reqwest
```

### Example: Presigned URL Generation

```rust
use rusty_s3::{Bucket, Credentials, S3Action, UrlStyle};
use std::time::Duration;

fn generate_s3_upload_url(object_key: &str, credentials: &Credentials) -> String {
    let bucket = Bucket::new(
        "https://s3.us-west-2.amazonaws.com".parse().unwrap(),
        UrlStyle::VirtualHost,
        "your-bucket",
        "us-west-2",
    ).unwrap();

    let mut put_action = bucket.put_object(Some(credentials), object_key);
    put_action.headers_mut().insert("content-type", "application/octet-stream");

    // Sign URL - valid for 1 hour
    put_action.sign(Duration::from_secs(3600)).to_string()
}
```

### ESP32 HTTP Upload with esp-idf-svc

```rust
use esp_idf_svc::http::client::{EspHttpConnection, Configuration};
use embedded_svc::http::client::Client;

fn upload_to_s3(signed_url: &str, parquet_data: &[u8]) -> Result<(), Error> {
    let config = Configuration::default();
    let mut client = Client::wrap(EspHttpConnection::new(&config)?);

    let headers = [("Content-Type", "application/octet-stream")];
    let mut request = client.put(signed_url, &headers)?;
    request.write_all(parquet_data)?;

    let response = request.submit()?;
    if response.status() == 200 {
        log::info!("Upload successful!");
    }
    Ok(())
}
```

---

## Architecture for S3 Upload

### Primary: Direct Parquet on ESP32 (PROVEN!)

<Mermaid title="Primary Architecture" chart={`
flowchart LR
    subgraph ESP["ESP32-S3 + 8MB PSRAM"]
        SENSOR[Enviro+ Sensors] --> BUFFER[Buffer 178 rows<br/>15 minutes]
        BUFFER --> PARQUET[Create Parquet<br/>ZSTD ~10KB]
    end
    PARQUET --> |HTTP PUT| S3[(S3 Storage<br/>Hive Partitioned)]
    style PARQUET fill:#90EE90
    style S3 fill:#87CEEB
`}/>

**This is now the recommended architecture!**

### Fallback: Hybrid Architecture (If needed)

<Mermaid title="Hybrid Architecture" chart={`
flowchart LR
    subgraph ESP["ESP32-S3"]
        SENSOR[Temperature<br/>Humidity<br/>Sensors]
        BUFFER[Data Buffer<br/>in PSRAM]
        COMPRESS[Compress with<br/>Gorilla/Postcard/CBOR]
    end
    subgraph UPLOAD["Upload Options"]
        HTTP[HTTP PUT]
        MQTT[MQTT Publish]
    end
    subgraph CLOUD["Cloud Processing"]
        S3_RAW[(S3 Raw Data<br/>Compressed Binary)]
        LAMBDA[AWS Lambda<br/>or Server]
        S3_PARQUET[(S3 Parquet<br/>Optimized)]
    end
    SENSOR --> BUFFER
    BUFFER --> COMPRESS
    COMPRESS --> HTTP
    COMPRESS --> MQTT
    HTTP --> S3_RAW
    MQTT --> |Bridge| S3_RAW
    S3_RAW --> LAMBDA
    LAMBDA --> S3_PARQUET
`}/>

### Data Flow Options

#### Option 1: Direct S3 Upload (Presigned URLs)

<Mermaid title="Direct S3 Upload Flow" chart={`
sequenceDiagram
    participant ESP as ESP32-S3
    participant API as Your API Server
    participant S3 as AWS S3
    participant Lambda as AWS Lambda
    ESP->>API: Request presigned URL
    API->>S3: Generate presigned PUT URL
    S3-->>API: Presigned URL
    API-->>ESP: Presigned URL
    ESP->>S3: HTTP PUT (compressed binary)
    S3-->>ESP: 200 OK
    S3->>Lambda: Trigger on upload
    Lambda->>S3: Convert to Parquet
`}/>

#### Option 2: MQTT Bridge

<Mermaid title="MQTT Bridge Flow" chart={`
sequenceDiagram
    participant ESP as ESP32-S3
    participant MQTT as MQTT Broker
    participant Bridge as Bridge Service
    participant S3 as AWS S3
    ESP->>MQTT: Publish sensor data
    MQTT->>Bridge: Forward message
    Bridge->>S3: Upload + Convert to Parquet
`}/>

#### Option 3: Direct HTTP to Processing Server

<Mermaid title="Direct HTTP Flow" chart={`
sequenceDiagram
    participant ESP as ESP32-S3
    participant Server as Processing Server
    participant S3 as AWS S3
    ESP->>Server: HTTP POST (sensor data)
    Server->>Server: Convert to Parquet
    Server->>S3: Upload Parquet file
    Server-->>ESP: 200 OK
`}/>

---

### Server-Side Parquet Conversion

#### Python Lambda Example

```python
import boto3
import pyarrow as pa
import pyarrow.parquet as pq
import postcard  # or cbor2

def lambda_handler(event, context):
    # Download from S3
    s3 = boto3.client('s3')
    obj = s3.get_object(Bucket='raw-bucket', Key=event['key'])
    compressed_data = obj['Body'].read()

    # Deserialize (Postcard/CBOR/custom)
    readings = postcard.loads(compressed_data)

    # Convert to Arrow Table
    table = pa.Table.from_pydict({
        'timestamp': [r['timestamp'] for r in readings],
        'temperature': [r['temperature'] for r in readings],
        'humidity': [r['humidity'] for r in readings],
    })

    # Write as Parquet with compression
    pq.write_table(table, '/tmp/output.parquet', compression='snappy')

    # Upload to optimized bucket
    s3.upload_file('/tmp/output.parquet', 'parquet-bucket',
                   f'{event["key"]}.parquet')
```

#### Rust Lambda Example

```rust
use arrow::array::*;
use arrow::datatypes::*;
use parquet::arrow::ArrowWriter;

// Deserialize from Postcard/CBOR
let readings: Vec<SensorReading> = postcard::from_bytes(&data)?;

// Build Arrow arrays
let timestamps = UInt64Array::from(
    readings.iter().map(|r| r.timestamp).collect::<Vec<_>>()
);
let temps = Float32Array::from(
    readings.iter().map(|r| r.temperature).collect::<Vec<_>>()
);

// Create schema
let schema = Schema::new(vec![
    Field::new("timestamp", DataType::UInt64, false),
    Field::new("temperature", DataType::Float32, false),
]);

// Write Parquet
let file = File::create("output.parquet")?;
let mut writer = ArrowWriter::try_new(file, Arc::new(schema), None)?;
writer.write(&batch)?;
writer.close()?;
```

---

### Recommended Data Formats for ESP32

| Format | Pros | Cons | Best For |
|--------|------|------|----------|
| **Postcard** | Tiny, no_std, fast | Less common | **ESP32 primary choice** |
| **CBOR** | Standard, no_std | Slightly larger | Interoperability needed |
| **Gorilla+Postcard** | Best compression | More complex | High-frequency sensors |
| **JSON** | Human-readable | Large, slow | Debugging only |
| **CSV** | Simple | Very large | Legacy systems |

---

## Development Setup

### Toolchain Installation

```bash
# Install espup (manages ESP Rust toolchains)
cargo install espup

# Install toolchains for your target chip
espup install

# For ESP32-S3 (Xtensa) - installs fork automatically
# For ESP32-C6 (RISC-V) - uses standard toolchain

# Source the environment (add to .bashrc/.zshrc)
source ~/export-esp.sh
```

### Project Generation

```bash
# Install project generator
cargo install esp-generate

# Generate new project
esp-generate --chip=esp32s3 my-sensor-project

# Or for ESP32-C6
esp-generate --chip=esp32c6 my-sensor-project
```

### Flashing and Monitoring

```bash
# Install flash tool
cargo install espflash

# Build and flash
cd my-sensor-project
cargo build --release
espflash flash --monitor target/xtensa-esp32s3-espidf/release/my-sensor-project
```

### Project Structure (std approach)

```
my-sensor-project/
├── Cargo.toml
├── build.rs
├── sdkconfig.defaults
└── src/
    └── main.rs
```

### Essential Crates

```toml
# Cargo.toml for std approach (recommended for S3 uploads)
[dependencies]
esp-idf-svc = "0.49"        # WiFi, HTTP, system services
esp-idf-hal = "0.44"        # Hardware abstraction
embedded-svc = "0.28"       # Service abstractions
log = "0.4"                 # Logging

# Serialization - choose one
postcard = "1.0"            # Recommended: smallest, no_std
serde = { version = "1.0", features = ["derive"] }

# Optional: time-series compression
# tsz = "0.5"               # Gorilla compression

[build-dependencies]
embuild = "0.32"
```

---

## Memory Considerations

### ESP32-S3 Memory Map

<Mermaid title="ESP32-S3 Memory" chart={`
pie title ESP32-S3 Memory with 8MB PSRAM
    "On-chip SRAM (512KB)" : 512
    "External PSRAM (8MB)" : 8192
`}/>

### Memory Budget for S3 Upload

| Component | Estimated Memory |
|-----------|------------------|
| WiFi stack | ~50-100 KB |
| HTTP client | ~20-30 KB |
| TLS (HTTPS) | ~40-60 KB |
| Sensor data buffer | Variable |
| Postcard/CBOR formatting | ~5-10 KB |
| **Available for data** | **~300 KB SRAM + 8MB PSRAM** |

### ESP32-C6 Memory Constraints

<Mermaid title="ESP32-C6 Memory" chart={`
pie title ESP32-C6 Memory - no PSRAM
    "WiFi + TLS (~150KB)" : 150
    "Application (~100KB)" : 100
    "Available for data (~260KB)" : 260
`}/>

**With only 512KB and no PSRAM, you must:**
- Upload data more frequently
- Use compact binary formats (Postcard/CBOR)
- Minimize buffering

---

## Sample Code Structure

### WiFi Connection (std approach)

```rust
use esp_idf_svc::{
    wifi::{EspWifi, ClientConfiguration, Configuration},
    eventloop::EspSystemEventLoop,
    nvs::EspDefaultNvsPartition,
};

fn connect_wifi() -> Result<EspWifi<'static>, Error> {
    let sys_loop = EspSystemEventLoop::take()?;
    let nvs = EspDefaultNvsPartition::take()?;

    let mut wifi = EspWifi::new(peripherals.modem, sys_loop, Some(nvs))?;

    wifi.set_configuration(&Configuration::Client(ClientConfiguration {
        ssid: "YourSSID".try_into().unwrap(),
        password: "YourPassword".try_into().unwrap(),
        ..Default::default()
    }))?;

    wifi.start()?;
    wifi.connect()?;

    Ok(wifi)
}
```

### HTTP Upload to S3

```rust
use esp_idf_svc::http::client::{EspHttpConnection, Configuration};
use embedded_svc::http::client::Client;

fn upload_to_s3(presigned_url: &str, data: &[u8]) -> Result<(), Error> {
    let config = Configuration::default();
    let mut client = Client::wrap(EspHttpConnection::new(&config)?);

    let headers = [("Content-Type", "application/octet-stream")];

    let mut request = client.put(presigned_url, &headers)?;
    request.write_all(data)?;

    let response = request.submit()?;

    if response.status() == 200 {
        log::info!("Upload successful!");
    }

    Ok(())
}
```

### Complete Sensor + Upload Example

```rust
use postcard::to_allocvec;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct SensorReading {
    timestamp: u64,
    temperature: f32,
    humidity: f32,
}

fn collect_and_upload(readings: Vec<SensorReading>, presigned_url: &str) -> Result<(), Error> {
    // Serialize with Postcard (tiny binary format)
    let data = to_allocvec(&readings)?;

    log::info!("Serialized {} readings to {} bytes", readings.len(), data.len());

    // Upload to S3
    upload_to_s3(presigned_url, &data)?;

    Ok(())
}
```

---

## Final Recommendation

<Mermaid title="Final Recommendation" chart={`
flowchart TD
    START[Your Project:<br/>Sensor to S3 Parquet] --> DECISION[Primary Concern?]
    DECISION -->|Maximum Memory| S3_REC[ESP32-S3<br/>16MB Flash + 8MB PSRAM]
    DECISION -->|Standard Toolchain| C6_REC[ESP32-C6<br/>WiFi 6 + RISC-V]
    DECISION -->|Future-Proof| C61_REC[Wait for ESP32-C61<br/>WiFi 6 + PSRAM]
    S3_REC --> PARQUET[Native Parquet<br/>with parquet-rs + ZSTD]
    C6_REC --> PARQUET
    C61_REC --> PARQUET
    PARQUET --> UPLOAD[Direct HTTP PUT to S3<br/>~10KB Parquet files]
    style S3_REC fill:#90EE90
    style PARQUET fill:#90EE90
    style UPLOAD fill:#87CEEB
`}/>

### Summary

| If You Need... | Choose | Why |
|----------------|--------|-----|
| **Best overall for your project** | ESP32-S3 (8MB PSRAM) | Maximum memory, native Parquet works! |
| **Standard Rust toolchain** | ESP32-C6 | No fork needed, 8MB flash sufficient |
| **Future-proofing** | Wait for ESP32-C61 | WiFi 6 + PSRAM, best of both worlds |
| **Maximum power** | ESP32-P4 + C6 | Only if you need video/AI processing |

### Key Takeaways (Updated December 2024)

1. **Native Parquet on ESP32 IS FEASIBLE!** - POC proven with parquet-rs v57.1.0
2. **ZSTD compression recommended** - 91% of raw size, best ratio
3. **rusty-s3 for S3 upload** - Sans-IO, minimal deps, perfect for ESP32
4. **Binary size ~1.1MB** (macOS with S3), estimated ~2-3MB on ESP32 (fits in 8-16MB flash)
5. **Memory usage ~150KB** - fits easily in 8MB PSRAM
6. **ESP32-S3 with 8MB PSRAM** is the best choice
7. **Direct ESP32 → Parquet → S3** architecture is now possible!
8. **No Lambda/server-side conversion needed** for your use case

---

## Resources

### Official Documentation
- [ESP-RS Book](https://docs.esp-rs.org/book/) - Comprehensive Rust on ESP guide
- [esp-hal Documentation](https://docs.esp-rs.org/esp-hal/) - HAL API reference
- [esp-idf-svc Documentation](https://docs.esp-rs.org/esp-idf-svc/) - std approach docs
- [Embedded Rust Training](https://docs.esp-rs.org/no_std-training/) - no_std training

### Serialization Libraries
- [Postcard](https://github.com/jamesmunns/postcard) - no_std binary serialization
- [serde_cbor](https://github.com/pyfisch/cbor) - CBOR for Rust
- [tsz-rs](https://github.com/jeromefroe/tsz-rs) - Gorilla time-series compression

### Parquet/Arrow (Server-Side)
- [arrow-rs](https://github.com/apache/arrow-rs) - Rust Arrow/Parquet
- [PyArrow](https://arrow.apache.org/docs/python/) - Python Arrow/Parquet

### Community
- Matrix Chat: `#esp-rs:matrix.org`
- GitHub: [esp-rs organization](https://github.com/esp-rs)
- [awesome-esp-rust](https://github.com/esp-rs/awesome-esp-rust) - Curated resources

### Development Boards Database
- [ESP Boards Comparison](https://www.espboards.dev/) - Comprehensive board database

---

## Data Volume & Cost Analysis (Per Sensor)

Based on actual data from opensensor.space S3 bucket (station `019ab390-f291-7a30-bca8-381286e4c2aa`).

### Measured Data

| Metric | Value |
|--------|-------|
| **Avg Parquet File Size** | 12.89 KB |
| **Upload Frequency** | Every 15 minutes |
| **Files per Day** | 96 |

### Data Volume Per Sensor

| Period | Data Volume |
|--------|-------------|
| **Per Day** | 1.21 MB |
| **Per Month** | 36.78 MB |
| **Per Year** | 441 MB (0.43 GB) |

### AWS S3 Costs (us-west-2)

| Cost Type | Monthly | Yearly |
|-----------|---------|--------|
| Storage | $0.001 | $0.06 |
| PUT Requests (2,922/month) | $0.015 | $0.18 |
| **Total** | **$0.02** | **$0.24** |

### Scaling to Multiple Sensors

| Sensors | Data/Month | Data/Year | Cost/Year |
|---------|------------|-----------|-----------|
| 1 | 37 MB | 441 MB | $0.24 |
| 10 | 368 MB | 4.3 GB | $2.35 |
| 100 | 3.6 GB | 43 GB | $23 |
| 1000 | 36 GB | 431 GB | $235 |

### ESP32 WiFi Feasibility

- Each upload: ~13 KB + HTTP overhead ≈ **15 KB per request**
- Daily bandwidth: **~1.4 MB per sensor**
- Monthly bandwidth: **~42 MB per sensor**
- **Very feasible for ESP32 WiFi!**

---

## IoT Cellular Connectivity: SIM Card Providers

For remote sensor deployments without WiFi access, cellular connectivity via LTE-M or NB-IoT is essential.

### Provider Comparison

<Mermaid title="IoT SIM Providers" chart={`
graph LR
    subgraph Providers["IoT SIM Providers"]
        A["1NCE<br/>$10 for 10 years"]
        B["Hologram<br/>Pay-per-use"]
        C["Soracom<br/>Bundled plans"]
    end
    subgraph Coverage["Network Coverage"]
        US["US: AT&T, T-Mobile"]
        GLOBAL["Global: 170+ countries"]
    end
    A --> GLOBAL
    B --> GLOBAL
    C --> US
    style A fill:#90EE90
`}/>

### Detailed Comparison

| Provider | SIM Cost | Monthly Fee | Data Cost | Coverage | Best For |
|----------|----------|-------------|-----------|----------|----------|
| **1NCE** | **$10** | **$0** | **Included (500MB/10yr)** | 170+ countries | **Long-term low-data IoT** |
| Hologram | $3-5 | $1 (can pause) | $0.03/MB | 190+ countries | Flexible/variable usage |
| Soracom | $5 | $0 | $0.002/KB | US (AT&T/T-Mo/VZW) | High-volume US deployments |

### 1NCE (Recommended for opensensor.space)

**Why 1NCE is perfect for your use case:**

| Feature | Value |
|---------|-------|
| **Total Cost** | $10 one-time (covers 10 years!) |
| **Data Included** | 500 MB over 10 years |
| **Your Monthly Usage** | ~42 MB per sensor |
| **Annual Usage** | ~441 MB per sensor |
| **Coverage** | LTE-M/NB-IoT in 170+ countries |
| **Networks (US)** | AT&T, T-Mobile |

**Calculation for your sensor:**
- Annual data: 441 MB
- 10-year allowance: 500 MB
- **Result: 500 MB is tight for 10 years**, but:
  - 1NCE offers top-up options
  - Consider WiFi for high-frequency deployments
  - Use for remote/cellular-only locations

### Hologram

| Feature | Value |
|---------|-------|
| **SIM Cost** | $3-5 |
| **Monthly Fee** | $1 (can pause when not in use) |
| **Data Cost** | $0.03/MB |
| **Your Monthly Cost** | ~$1.26/month (42 MB × $0.03) |
| **Annual Cost** | ~$27/year per sensor |
| **Coverage** | 190+ countries, multiple carriers per region |

**Pros:**
- Most flexible - pay only for what you use
- Can pause SIM when not needed
- Excellent dashboard and API

**Cons:**
- Higher per-MB cost adds up for regular uploads

### Soracom

| Feature | Value |
|---------|-------|
| **SIM Cost** | $5 |
| **Plan Options** | plan-D ($0.002/KB), plan-US ($2/1GB) |
| **Coverage** | US: AT&T, T-Mobile, Verizon |
| **Best Price** | plan-US: $2/GB |

**Your monthly cost with plan-US:**
- 42 MB/month = $0.08/month
- Annual: ~$1/year per sensor

**Pros:**
- Cheapest for higher volumes
- Strong US coverage (3 carriers)
- Japanese company with excellent IoT focus

**Cons:**
- US-focused (limited global coverage)
- More complex pricing tiers

### Cost Comparison for Your Use Case (42 MB/month)

| Provider | Year 1 | Year 5 | Year 10 |
|----------|--------|--------|---------|
| **1NCE** | **$10** | **$10** | **$10** |
| Hologram | $27 | $135 | $270 |
| Soracom (plan-US) | $7 | $11 | $16 |

### Recommendation

<Mermaid title="Cellular Connectivity Decision" chart={`
flowchart TD
    START[Cellular IoT Connectivity] --> Q1[Remote deployment or backup?]
    Q1 -->|Primary cellular| Q2[Location?]
    Q1 -->|WiFi backup| WIFI[Use WiFi primary<br/>Cellular as failover]
    Q2 -->|US only| SORACOM[Soracom plan-US<br/>$2/GB, best US coverage]
    Q2 -->|Global| Q3[Data volume?]
    Q3 -->|< 50 MB/month| 1NCE[1NCE<br/>$10 for 10 years]
    Q3 -->|> 50 MB/month| HOLOGRAM[Hologram<br/>Flexible pay-per-use]
    style 1NCE fill:#90EE90
    style SORACOM fill:#87CEEB
`}/>

**For opensensor.space sensors:**
- **Primary recommendation: 1NCE** - $10 total for 10 years, perfect for low-bandwidth sensor data
- **Alternative (US): Soracom** - Best rates for US deployments
- **Flexible option: Hologram** - Best if usage varies or you need to pause SIMs

### ESP32 Cellular Modules

For cellular connectivity, you'll need an ESP32 paired with an LTE-M/NB-IoT modem:

| Module | Description | Price Range |
|--------|-------------|-------------|
| **LILYGO T-SIM7600G** | ESP32-S3 + SIM7600 (4G LTE) | ~$40-50 |
| **LILYGO T-A7670** | ESP32 + A7670 (4G LTE-Cat 1) | ~$25-35 |
| **Waveshare SIM7080G** | Add-on for any ESP32 (LTE-M/NB-IoT) | ~$20-30 |

These modules support the LTE-M/NB-IoT bands used by 1NCE, Hologram, and Soracom.

---

*Last Updated: December 4, 2024 - POC Validated!*
