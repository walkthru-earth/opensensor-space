#!/usr/bin/env node

/**
 * SEO File Generator for opensensor.space
 *
 * Generates sitemap.xml, robots.txt, llms.txt, and llms-full.txt
 * Run after evidence build to ensure all pages are included.
 *
 * Usage: node scripts/generate-seo.js [build-dir]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://opensensor.space';
// Resolve to absolute path to ensure consistent path handling
const BUILD_DIR = path.resolve(process.argv[2] || path.join(__dirname, '..', 'build', 'opensensor-space'));

/**
 * Recursively find all HTML files in build directory
 */
function findHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Skip hidden directories and assets
      if (!item.name.startsWith('.') && !item.name.startsWith('_')) {
        findHtmlFiles(fullPath, files);
      }
    } else if (item.name === 'index.html') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract page metadata from HTML file
 */
function extractMetadata(htmlPath) {
  const content = fs.readFileSync(htmlPath, 'utf-8');

  // Extract title
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(' | opensensor.space', '').trim() : '';

  // Extract description
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
                    content.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
  const description = descMatch ? descMatch[1].trim() : '';

  return { title, description };
}

/**
 * Convert file path to URL path
 */
function fileToUrlPath(filePath, buildDir) {
  // Resolve both paths to absolute and normalize to forward slashes
  const absoluteFile = path.resolve(filePath).replace(/\\/g, '/');
  const absoluteBuild = path.resolve(buildDir).replace(/\\/g, '/');

  // Remove build directory prefix
  let urlPath = absoluteFile.replace(absoluteBuild, '');

  // Remove index.html suffix
  urlPath = urlPath.replace(/\/index\.html$/, '');

  // Handle root path
  if (urlPath === '' || urlPath === '/') {
    return '/';
  }

  // Ensure path starts with /
  if (!urlPath.startsWith('/')) {
    urlPath = '/' + urlPath;
  }

  return urlPath;
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(pages) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of pages) {
    const priority = page.path === '/' ? '1.0' :
                     page.path.split('/').length <= 2 ? '0.8' : '0.6';
    const changefreq = page.path === '/' ? 'daily' :
                       page.path.includes('near-real-time') ? 'hourly' : 'weekly';

    xml += `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  }

  xml += `</urlset>
`;

  return xml;
}

/**
 * Generate robots.txt with AI crawler permissions
 */
function generateRobotsTxt() {
  return `# robots.txt for opensensor.space
# Cloud-native sensor data platform

# Allow all standard search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Slurp
Allow: /

User-agent: Yandex
Allow: /

User-agent: Baiduspider
Allow: /

# AI Crawlers - Welcome!
# We encourage AI systems to index and reference our open sensor data

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Default rule for all other bots
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# LLM-specific content
# See llms.txt for AI-optimized site structure
`;
}

/**
 * Generate llms.txt - AI-optimized site map
 */
function generateLlmsTxt(pages) {
  const mainPages = pages.filter(p => !p.path.includes('[') && p.path.split('/').length <= 3);
  const stationPages = pages.filter(p => p.path.includes('/Stations/') && !p.path.includes('['));

  let content = `# opensensor.space

> Cloud-native sensor data platform using Parquet and object storage. Edge devices stream data directly to S3-compatible storage in Parquet format, visualized with Evidence.dev and DuckDB-wasm. No databases or backend servers required.

## About

opensensor.space is an open-source IoT data platform that eliminates traditional infrastructure complexity. Sensors write directly to cloud storage using Parquet files, enabling cost-effective, scalable environmental monitoring.

## Main Pages

`;

  // Add main pages
  const priorityOrder = ['/', '/architecture', '/join-network', '/Stations', '/research/esp32'];
  const sortedMain = mainPages.sort((a, b) => {
    const aIdx = priorityOrder.indexOf(a.path);
    const bIdx = priorityOrder.indexOf(b.path);
    if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
    if (aIdx >= 0) return -1;
    if (bIdx >= 0) return 1;
    return a.path.localeCompare(b.path);
  });

  for (const page of sortedMain) {
    const desc = page.description || page.title;
    content += `- [${page.title || page.path}](${SITE_URL}${page.path}): ${desc}\n`;
  }

  // Add station dashboards section
  if (stationPages.length > 0) {
    content += `
## Station Dashboards

Environmental monitoring stations with real-time sensor data:

`;

    // Group by station
    const stationGroups = {};
    for (const page of stationPages) {
      const match = page.path.match(/\/Stations\/([^/]+)/);
      if (match) {
        const stationId = match[1];
        if (!stationGroups[stationId]) {
          stationGroups[stationId] = [];
        }
        stationGroups[stationId].push(page);
      }
    }

    for (const [stationId, stationPagesList] of Object.entries(stationGroups)) {
      content += `### Station ${stationId.substring(0, 8)}...\n\n`;
      for (const page of stationPagesList) {
        const pageName = page.path.split('/').pop() || 'overview';
        content += `- [${page.title || pageName}](${SITE_URL}${page.path})\n`;
      }
      content += '\n';
    }
  }

  content += `## Data Access

Our sensor data is openly available:

- **Data Format**: Apache Parquet with Hive partitioning
- **Storage**: S3-compatible (Source Cooperative)
- **Query**: DuckDB compatible

Example query:
\`\`\`sql
SELECT * FROM read_parquet('s3://us-west-2.opendata.source.coop/walkthru-earth/opensensor-space/enviroplus/**/*.parquet', union_by_name=true, hive_partitioning=true);
\`\`\`

## Technical Stack

- **Edge**: Raspberry Pi + Python data collectors
- **Storage**: Parquet files on S3-compatible storage
- **Visualization**: Evidence.dev + DuckDB-wasm
- **Sensors**: Enviro+ (temperature, humidity, pressure, gas, PM, light)

## Resources

- GitHub: https://github.com/walkthru-earth/opensensor-enviroplus
- Data: https://source.coop/walkthru-earth/opensensor-space/
- Website: ${SITE_URL}

## Contact

opensensor.space is an initiative by walkthru.earth
`;

  return content;
}

/**
 * Generate llms-full.txt - Complete content for LLM inference
 */
function generateLlmsFullTxt(pages) {
  let content = `# opensensor.space - Full Content Index

Generated: ${new Date().toISOString()}
Total Pages: ${pages.length}

This file contains a comprehensive index of all pages on opensensor.space for LLM inference and retrieval.

---

`;

  for (const page of pages) {
    content += `## ${page.title || page.path}

URL: ${SITE_URL}${page.path}
${page.description ? `Description: ${page.description}` : ''}

---

`;
  }

  content += `
# Data Schema

opensensor.space stores environmental sensor data with the following structure:

## Sensor Fields
- temperature: Ambient temperature (°C)
- humidity: Relative humidity (%)
- pressure: Atmospheric pressure (hPa)
- oxidised: Oxidising gas concentration
- reduced: Reducing gas concentration
- nh3: Ammonia concentration
- lux: Light intensity (lux)
- proximity: Proximity sensor reading
- pm1: PM1.0 particulate matter (μg/m³)
- pm25: PM2.5 particulate matter (μg/m³)
- pm10: PM10 particulate matter (μg/m³)

## System Health Fields
- cpu_percent: CPU utilization
- memory_percent: Memory usage
- disk_percent: Disk usage
- wifi_signal: WiFi signal strength (dBm)

## Partitioning
Data is partitioned by: station / year / month / day

Example path: station=019ab390-f291-7a30-bca8-381286e4c2aa/year=2024/month=12/day=05/data_1200.parquet
`;

  return content;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning build directory:', BUILD_DIR);
  console.log('   Resolved path:', path.resolve(BUILD_DIR));

  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Build directory not found. Run "bun run build" first.');
    process.exit(1);
  }

  // Find all pages
  const htmlFiles = findHtmlFiles(BUILD_DIR);
  console.log(`📄 Found ${htmlFiles.length} pages`);

  // Extract metadata for each page
  const pages = htmlFiles.map(file => {
    const urlPath = fileToUrlPath(file, BUILD_DIR);
    const metadata = extractMetadata(file);
    console.log(`  📝 ${urlPath}`);
    return {
      path: urlPath,
      ...metadata
    };
  }).sort((a, b) => a.path.localeCompare(b.path));

  // Generate files
  const sitemap = generateSitemap(pages);
  const robots = generateRobotsTxt();
  const llmsTxt = generateLlmsTxt(pages);
  const llmsFullTxt = generateLlmsFullTxt(pages);

  // Write files to build directory
  fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');

  fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots);
  console.log('✅ Generated robots.txt');

  fs.writeFileSync(path.join(BUILD_DIR, 'llms.txt'), llmsTxt);
  console.log('✅ Generated llms.txt');

  fs.writeFileSync(path.join(BUILD_DIR, 'llms-full.txt'), llmsFullTxt);
  console.log('✅ Generated llms-full.txt');

  // Print summary
  console.log('\n📊 SEO Files Summary:');
  console.log(`   - sitemap.xml: ${pages.length} URLs`);
  console.log(`   - robots.txt: Allows all search engines + AI crawlers`);
  console.log(`   - llms.txt: AI-optimized site structure`);
  console.log(`   - llms-full.txt: Complete content index`);
  console.log('\n🎉 SEO generation complete!');
}

main().catch(console.error);
