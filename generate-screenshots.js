const puppeteer = require("puppeteer");

async function generateScreenshots(domain, sizes) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const size of sizes) {
    const { width, height, filename } = size;
    await page.setViewport({ width, height });
    await page.goto(domain);

    try {
      await page.screenshot({
        path: `public/screenshots/${filename}.png`,
        fullPage: true, // Capture the full scrollable content
      });
      console.log(`Screenshot ${filename}.png (${width}x${height}) captured.`);
    } catch (error) {
      console.error(`Error capturing screenshot ${filename}.png:`, error);
    }
  }

  await browser.close();
}

async function main() {
  const domain = process.argv[2]; // Get domain from command-line argument
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
