const puppeteer = require("puppeteer");
const fs = require("fs").promises; // Use fs.promises for async file operations
const path = require("path");

async function ensureDirectoryExists(directoryPath) {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
    console.log(`Directory created or already exists: ${directoryPath}`);
  } catch (error) {
    if (error.code !== "EEXIST") {
      // Ignore if directory already exists
      console.error(`Error creating directory ${directoryPath}:`, error);
      throw error; // Re-throw the error to stop execution
    }
  }
}

async function generateScreenshots(domain, sizes) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const screenshotsDir = path.join(__dirname, "public", "screenshots"); // Construct full path

  await ensureDirectoryExists(screenshotsDir); // Ensure directory exists

  for (const size of sizes) {
    const { width, height, filename } = size;
    await page.setViewport({ width, height });
    await page.goto(domain);

    try {
      await page.screenshot({
        path: path.join(screenshotsDir, `${filename}.png`), // Use full path
        fullPage: true,
      });
      console.log(`Screenshot ${filename}.png (${width}x${height}) captured.`);
    } catch (error) {
      console.error(`Error capturing screenshot ${filename}.png:`, error);
    }
  }

  await browser.close();
}

async function main() {
  const domain = process.argv[2];
  if (!domain) {
    console.error("Usage: node generate-screenshots.js <domain>");
    process.exit(1);
  }

  const sizes = [
    { width: 1920, height: 1080, filename: "desktop-1920x1080" },
    { width: 1280, height: 720, filename: "desktop-1280x720" },
    { width: 600, height: 800, filename: "mobile-600x800" },
    { width: 375, height: 667, filename: "mobile-375x667" },
  ];

  await generateScreenshots(domain, sizes);
}

main();
