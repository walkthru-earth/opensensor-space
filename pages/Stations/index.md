---
title: Stations
description: 
hide_title: true
---

## My Weather Stations


```sql stations
SELECT 
    '01' AS station_id,
    30.0626 AS latitude,
    31.4916 AS longitude;
```

<DataTable
  data={stations}
  title="Weather Stations"
/>

<PointMap 
    data={stations} 
    lat=latitude 
    long=longitude  
    pointName=station_id 
    height=200
/>