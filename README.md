# OpenSensor Contributions Branch

This branch contains station submissions from the [Decap CMS](https://opensensor.space/admin/).

## Structure

```
content/stations/*.yml    # Station registration files (YAML)
.github/workflows/        # Validation and processing workflows
```

## How it works

1. Users submit stations via the CMS at https://opensensor.space/admin/
2. PRs are created to this branch with new `.yml` files
3. GitHub Actions validates the submission (S3 URL check)
4. After merge, stations are processed and added to `stations.csv` on `main`

See [CONTRIBUTING.md](https://github.com/walkthru-earth/opensensor-space/blob/main/CONTRIBUTING.md) for details.
