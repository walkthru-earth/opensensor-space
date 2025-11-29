---
title: Join the Sensor Network
description: Deploy your own cloud-native sensors and contribute to opensensor.space
---

opensensor.space is a community-driven sensor network. Deploy sensors, share open data using open standards, and help build comprehensive environmental monitoring across the globe.

## How to Participate

1. **Deploy your sensors** - Follow the setup instructions below
2. **Choose your storage** - This is the **only** 3rd party service required. You can use:
    - **Cloud**: AWS S3, Google Cloud Storage, Azure Blob, Wasabi, Hetzner, etc.
    - **Open Data**: [Source Cooperative](https://source.coop) (recommended for public data)
    - **Local / Airgapped**: [MinIO](https://min.io), [Ceph](https://ceph.io), or [RustFS](https://github.com/rustfs/rustfs) for local edge networks
3. **Register your station** - Use our registration form below
4. **Share your insights** - Contribute dashboard improvements or new sensor implementations

## Register Your Station

Ready to add your sensor station to the network? Use our registration form to submit your station details.

**Requirements:**
1.  A **GitHub account** is required to authenticate and submit the registration.
2.  Your **Object Storage Bucket** must be **publicly accessible** so the network can read your data.

<a href="https://opensensor.space/admin/" target="_blank" rel="external" class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 no-underline">
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
  Register New Station
</a>

<Details title="What information do I need to register?">

To register your station, you'll need:
- **Station Name**: A friendly name for your station
- **Sensor Type**: The type of sensor hardware (Enviro+, custom, etc.)
- **Station Type**: Indoor, Outdoor, or Moving
- **Location**: Coordinates on a map (click to place marker)
- **Storage URL**: Your S3-compatible storage path where data is stored

The registration creates a pull request that our team reviews before adding your station to the network.

</Details>

## 1. Hardware Requirements

### Recommended Setup (Enviro+)

<Grid cols=2>
  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-zero-2-w?variant=42101934587987" target="_blank" class="flex flex-col items-center">
      <Image url="https://shop.pimoroni.com/cdn/shop/files/PiZ2WHfront_0abdb823-7474-4aa9-bffa-4990fe440574_768x768_crop_center.png?v=1723211856" description="Raspberry Pi Zero 2 W" height=150 />
      <h3 class="font-bold text-center mt-2">Raspberry Pi Zero 2 W + Headers</h3>
      <p class="text-xs text-center mt-1">The brain of your sensor station</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/raspberry-pi-12-5w-micro-usb-power-supply?variant=39493050237011" target="_blank" class="flex flex-col items-center">
      <Image url="https://shop.pimoroni.com/cdn/shop/products/PSU_UK_768x768_crop_center.jpg?v=1635179995" description="Raspberry Pi Power Supply" height=150 />
      <h3 class="font-bold text-center mt-2">Raspberry Pi 12.5W Power Supply</h3>
      <p class="text-xs text-center mt-1">For Pi Zero 2 W (or any compatible power supply)</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/zero-adaptor-kit?variant=10462230279" target="_blank" class="flex flex-col items-center">
      <Image url="https://shop.pimoroni.com/cdn/shop/products/Zero_2_of_5_daabacb7-b187-4089-86c7-575aeafb1d0d_768x768_crop_center.JPG?v=1448481941" description="Raspberry Pi Zero Adaptor Kit" height=150 />
      <h3 class="font-bold text-center mt-2">Raspberry Pi Zero Adaptor Kit</h3>
      <p class="text-xs text-center mt-1">Micro HDMI converter for easy troubleshooting</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/microsd-card-with-raspberry-pi-os?variant=53501816832379" target="_blank" class="flex flex-col items-center">
      <Image url="https://shop.pimoroni.com/cdn/shop/files/SD_CARD_128GB_768x768_crop_center.png?v=1729672748" description="Raspberry Pi Official microSD Card" height=150 />
      <h3 class="font-bold text-center mt-2">microSD Card with Raspberry Pi OS</h3>
      <p class="text-xs text-center mt-1">Pre-installed (or any other SD card)</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/enviro?variant=31155658457171" target="_blank" class="flex flex-col items-center">
      <Image url="https://shop.pimoroni.com/cdn/shop/products/Enviro-Plus-pHAT-on-white-2_1500x1500_crop_center.jpg?v=1573820030" description="Enviro+ Air Quality Version" height=150 />
      <h3 class="font-bold text-center mt-2">Enviro+ (Air Quality Version)</h3>
      <p class="text-xs text-center mt-1">Temperature, humidity, pressure, gas, and light sensors</p>
    </a>
  </div>

  <div class="border rounded-lg p-4 my-2 mx-1 hover:shadow-md transition">
    <a href="https://shop.pimoroni.com/products/pms5003-particulate-matter-sensor-with-cable?variant=29075640352851" target="_blank" class="flex flex-col items-center">
      <Image url="https://shop.pimoroni.com/cdn/shop/products/PMS5003_particulate_matter_sensor_with_cable_1_of_4_768x768_crop_center.JPG?v=1560514915" description="PMS5003 Particulate Matter Sensor" height=150 />
      <h3 class="font-bold text-center mt-2">PMS5003 Particulate Matter Sensor</h3>
      <p class="text-xs text-center mt-1">PM1.0, PM2.5, and PM10 air quality monitoring</p>
    </a>
  </div>
</Grid>

### Custom Deployments

You can adapt this architecture to any Python-capable device:
- Raspberry Pi (Zero 2 W, 3, 4, 5)
- NVIDIA Jetson (Nano, Orin)
- ASUS Tinker Board
- Any Linux SBC with Python 3.12+ support

## 2. Operating System

Follow this step-by-step guide to install and configure Raspberry Pi OS using **Raspberry Pi Imager v2.x.x**. Download it from [raspberrypi.com/software](https://www.raspberrypi.com/software/).

### Step 1: Select Your Device

Open Raspberry Pi Imager. The setup wizard guides you through each step using the sidebar on the left. First, select your Raspberry Pi model from the list. For this tutorial, we're using **Raspberry Pi Zero 2 W**.

<Image url="/tutorial/os/01-raspberry-pi-imager-device.png" description="Select Raspberry Pi Zero 2 W from the device list" />

### Step 2: Choose Operating System

Click on the **OS** step in the sidebar. You'll see several options including Raspberry Pi OS (64-bit) with desktop and other variants. Select **Raspberry Pi OS (other)** to access the Lite versions.

<Alert status="warning">
  <strong>Important:</strong> Only use 64-bit operating systems. The 32-bit versions and Raspberry Pi Zero v1 are not supported by this setup.
</Alert>

<Image url="/tutorial/os/02-raspberry-pi-imager-os.png" description="Choose operating system - select Raspberry Pi OS (other)" />

### Step 3: Select Raspberry Pi OS Lite (64-bit)

Choose **Raspberry Pi OS Lite (64-bit)** - a port of Debian Trixie with no desktop environment. This is ideal for sensor stations as it uses fewer resources and runs headless. The image is approximately 500MB and will be cached on your computer after the first download.

<Image url="/tutorial/os/03-raspberry-pi-imager-os-lite.png" description="Select Raspberry Pi OS Lite (64-bit) - no desktop environment" />

### Step 4: Select Storage Device

Insert your microSD card and click on the **Storage** step. Select your SD card from the list. The "Exclude system drives" checkbox is enabled by default to prevent accidentally overwriting your computer's drive.

<Image url="/tutorial/os/04-raspberry-pi-imager-storage.png" description="Select your microSD card as the storage device" />

### Step 5: Configure Hostname

The **Customisation** section is where you configure your headless setup. In the **Hostname** step, enter a unique name for your Pi (e.g., `opensensor01`). This allows you to find it on your network as `opensensor01.local`. The hostname should contain only letters, numbers, and hyphens.

<Image url="/tutorial/os/05-raspberry-pi-imager-next.png" description="Enter hostname - e.g., opensensor01" />

<Image url="/tutorial/os/07-raspberry-pi-imager-general-hostname.png" description="Set a unique hostname like opensensor01" />

### Step 6: Set Locale and Timezone

In the **Localisation** step, configure your regional settings:
- **Capital city**: Select your nearest major city
- **Time zone**: This will be auto-filled based on your city selection
- **Keyboard layout**: Choose your keyboard layout (e.g., `us`)

Correct timezone settings ensure your sensor readings have accurate timestamps.

<Image url="/tutorial/os/06-raspberry-pi-imager-edit-settings.png" description="Set your timezone and keyboard layout" />

### Step 6b: Raspberry Pi Connect (Optional)

The **Raspberry Pi Connect** step allows you to enable remote access through Raspberry Pi's cloud service. This is optional for our setup since we'll use SSH over your local network. You can leave this disabled and click **NEXT** to continue.

<Image url="/tutorial/os/10-raspberry-pi-imager-general-locale.png" description="Raspberry Pi Connect - optional, leave disabled for this setup" />

### Step 7: Create User Account

In the **User** step, create your login credentials:

- **Username**: Enter a lowercase username (letters, numbers, underscores, and hyphens only). Avoid using `pi` as it's a well-known default that makes your device easier to target.
- **Password**: Create a strong password with at least 12 characters, mixing uppercase, lowercase, numbers, and symbols. Re-enter it in the "Confirm password" field.

<Alert status="info">
  <strong>Remember these credentials!</strong> You'll need them to SSH into your Pi. Consider using a password manager to store them securely.
</Alert>

<Image url="/tutorial/os/08-raspberry-pi-imager-general-user.png" description="Create username and password for SSH access" />

### Step 8: Configure Wi-Fi

In the **Wi-Fi** step, enter your wireless network details:
- **SSID**: Your Wi-Fi network name
- **Password**: Your Wi-Fi password (confirm it in the second field)
- **Hidden SSID**: Check this box if your network doesn't broadcast its name

Choose between **SECURE NETWORK** (WPA/WPA2) or **OPEN NETWORK** based on your setup.

<Image url="/tutorial/os/09-raspberry-pi-imager-general-wifi.png" description="Enter your Wi-Fi network credentials" />

### Step 9: Enable SSH Access

In the **Remote access** step, enable SSH to control your Pi remotely:

- Toggle **Enable SSH** to ON
- Choose your authentication method:
  - **Use password authentication**: Simpler setup, uses the password from Step 7
  - **Use public key authentication**: More secure, uses cryptographic keys instead of passwords

We recommend public key authentication for better security. If you choose this option, you can either paste your public key directly or click **BROWSE** to select your key file.

<Image url="/tutorial/os/11-raspberry-pi-imager-services-ssh.png" description="Enable SSH and configure authentication method" />

<Details title="How to generate an SSH key">

If you don't have an SSH key yet, follow the instructions for your operating system:

<Tabs>
<Tab label="Windows">

**Option 1: Using PowerShell (Windows 10/11)**

Open **PowerShell** and run:

```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press **Enter** to accept the default location (`C:\Users\YourName\.ssh\id_ed25519`).

View your public key:

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

**Option 2: Using Git Bash**

If you have Git installed, open **Git Bash** and follow the macOS/Linux instructions.

</Tab>
<Tab label="macOS">

Open **Terminal** and run:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press **Enter** to accept the default file location (`~/.ssh/id_ed25519`). Optionally set a passphrase for extra security.

Your public key is now at `~/.ssh/id_ed25519.pub`. You can view it with:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output and paste it into the Raspberry Pi Imager, or click **BROWSE** and select the `.pub` file.

</Tab>
<Tab label="Linux">

Open a terminal and run:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press **Enter** to accept the default file location (`~/.ssh/id_ed25519`). Optionally set a passphrase.

View your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output and paste it into the Raspberry Pi Imager, or click **BROWSE** and select the file.

</Tab>
</Tabs>

</Details>

### Step 10: Review and Write

The **Writing** step shows a summary of your choices before writing:
- **Device**: Raspberry Pi Zero 2 W
- **Operating system**: Raspberry Pi OS Lite (64-bit)
- **Storage**: Your selected SD card
- **Customisations to apply**: Hostname, Localisation, User account, Wi-Fi, and SSH settings

Review the summary and click **WRITE** to begin.

<Image url="/tutorial/os/12-raspberry-pi-imager-options-save.png" description="Review your configuration summary before writing" />

### Step 11: Confirm Erase

A warning dialog appears: **"You are about to ERASE all data on: [your SD card]"**. This action is permanent and cannot be undone. Click **I UNDERSTAND, ERASE AND WRITE** to proceed.

<Image url="/tutorial/os/13-raspberry-pi-imager-confirm-write.png" description="Confirm that you want to erase the SD card" />

### Step 12: Authenticate and Wait

On macOS, you'll be prompted to authenticate with Touch ID or your password to allow disk access. After authenticating, the writing process begins. **Do not disconnect the storage device** while writing is in progress.

<Image url="/tutorial/os/14-raspberry-pi-imager-writing.png" description="Writing in progress - do not disconnect the SD card" />

### Step 13: Complete

When finished, you'll see **"Write complete!"** with a summary of all applied customisations:
- Hostname configured
- Localisation configured
- User account configured
- Wi-Fi configured
- SSH enabled

The storage device is ejected automatically. You can now safely remove the SD card and insert it into your Raspberry Pi.

<Image url="/tutorial/os/15-raspberry-pi-imager-complete.png" description="Write complete - SD card is ready to use" />

<Alert status="positive">
  <strong>Next step:</strong> Insert the SD card into your Raspberry Pi, connect power, and wait 2-4 minutes for first boot. Then proceed to Software Installation below.
</Alert>

## 3. Software Installation

SSH into your Raspberry Pi to begin the installation.

<Tabs>
  <Tab label="macOS / Linux">

  Open your **Terminal** application.

  Run the following command (using your configured hostname):

  ```bash
  ssh <username>@opensensor01.local
  ```

  If the hostname doesn't work, use the IP address:

  ```bash
  ssh <username>@<ip_address>
  ```

  </Tab>
  <Tab label="Windows">

  Open **PowerShell** (press Start, type "PowerShell", and hit Enter).

  Run the following command:

  ```powershell
  ssh <username>@opensensor01.local
  ```

  If the hostname doesn't work, use the IP address:

  ```powershell
  ssh <username>@<ip_address>
  ```

  </Tab>
</Tabs>

<Details title="How to find your Raspberry Pi's IP address">

If you can't connect using the hostname, you'll need to find the IP address assigned by your router. Your computer/phone must be on the **same network** as the Pi.

**Methods:**

1.  **Network Scanner App (Easiest)**: Download an app like **Fing** (iOS/Android) on your phone. Scan the network and look for a device named "Raspberry Pi" or your custom hostname.
2.  **Router Admin Page**: Log in to your router (usually `192.168.1.1` or `192.168.0.1`) and look for the list of "Connected Devices" or "DHCP Clients".
3.  **Ping Command**: Sometimes the ping command can find the IP even if SSH fails.
    *   **Mac/Linux**: `ping -c 1 opensensor01.local`
    *   **Windows**: `ping -n 1 opensensor01.local`

</Details>

We've simplified the installation process to a single command that handles everything: system dependencies, Python environment, and sensor configuration.

### One-Line Install (Recommended)

Run this command on your Raspberry Pi:

```bash
curl -LsSf https://raw.githubusercontent.com/walkthru-earth/opensensor-enviroplus/main/install.sh | sudo bash
```

This script will:
1.  Install system dependencies (git, python3-dev, etc.)
2.  Install `uv` (fast Python package manager)
3.  Install `opensensor-enviroplus`
4.  Configure hardware permissions

**After the installation completes, reboot your Raspberry Pi:**

```bash
sudo reboot
```

### Post-Installation Setup

After rebooting, SSH back into your Pi and run these commands to verify, configure, and start your station:

1.  **Test Sensors**: First, verify that your sensors are reading data correctly.
    ```bash
    opensensor test
    ```

2.  **Configure Station**: Set up your station ID and storage credentials.
    ```bash
    cd ~/opensensor
    opensensor setup
    ```

3.  **Enable Service**: Install the systemd service to start data collection automatically on boot.
    ```bash
    opensensor service setup
    ```

4.  **Verify Operation**: Check the logs to ensure the service is running and syncing.
    ```bash
    opensensor service logs -f
    ```

---

<script>
  const highLevelArchitecture = `
graph LR
    subgraph User ["Your Contribution"]
        You["Your Station"] -->|Sync| YourBucket["Your Storage - AWS/GCS/R2"]
    end

    subgraph Network ["The Network"]
        Other1["Station A"] -->|Sync| Bucket1["Source.coop"]
        Other2["Station B"] -->|Sync| Bucket2["MinIO/Wasabi"]
    end

    YourBucket -.->|Public Access| Dashboard
    Bucket1 -.->|Public Access| Dashboard
    Bucket2 -.->|Public Access| Dashboard

    subgraph OS ["opensensor.space"]
        Dashboard["Unified Dashboard - Browser + DuckDB"]
    end

    style You fill:#e1f5ff,stroke:#0077cc,stroke-width:2px
    style YourBucket fill:#fff5e1,stroke:#dcb20a,stroke-width:2px
    style Dashboard fill:#e1ffe1,stroke:#00cc44,stroke-width:2px
`;
</script>

## System Architecture

<Mermaid chart={highLevelArchitecture} />

For a detailed overview of how the system works, check out the [System Architecture](/architecture) page.

### Configuration

Configuration is managed via a `.env` file in your `~/opensensor` directory. Key settings include:

*   `OPENSENSOR_STATION_ID`: Your unique station UUID.
*   `OPENSENSOR_READ_INTERVAL`: How often to read sensors (default: 5s).
*   `OPENSENSOR_BATCH_DURATION`: How often to save files (default: 900s / 15m).
*   `OPENSENSOR_SYNC_ENABLED`: Enable/disable cloud sync.
*   `OPENSENSOR_STORAGE_BUCKET`: Your cloud storage bucket name.

### Health Monitoring

The system optionally collects health metrics to help you monitor your station remotely. This includes:
*   CPU temperature and load
*   Memory and disk usage
*   WiFi signal strength
*   NTP clock synchronization status

These metrics are stored in a separate `output-health/` directory with the same structure as your sensor data.

## CLI Commands & Documentation

For a full list of CLI commands, configuration options, and advanced usage, please refer to the official repository:

- **[opensensor-enviroplus](https://github.com/walkthru-earth/opensensor-enviroplus)**: Documentation for the data collector, CLI, and service management.

## Support

If you encounter issues or have questions, please check the issues page on GitHub:

- [opensensor-enviroplus Issues](https://github.com/walkthru-earth/opensensor-enviroplus/issues)
- Email: hi@walkthru.earth
