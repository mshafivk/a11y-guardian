import puppeteer from "puppeteer";
import axeCore from "axe-core";
import fs from "fs";
import path from "path";
import config from "./config/config.js";
import { createHtmlReport } from "axe-html-reporter";
import { header, warning } from "./utils/log.js";

async function runA11yCheck(url) {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: config.chromeExecutablePath, // Use the detected Chrome executable path
  });

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the target URL
  await page.goto(url);

  // Inject axe-core into the page
  await page.addScriptTag({ content: axeCore.source });
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  // Run axe-core accessibility checks
  const results = await page.evaluate((allyCheckLevel) => {
    //{
    // runOnly: {
    //     type: "tag",
    //     values: [allyCheckLevel],
    //   },
    // }
    return axe.run();
  }, config.a11yCheckLevel);

  // Close the browser
  await browser.close();

  if (!results || !results.violations) {
    console.error("Error: No violations found in the results:", results);
    return;
  }

  // Generate the report
  const reportHtml = createHtmlReport({
    results: { violations: results.violations },
    options: config.reportConfig,
  });

  // Ensure the output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const sanitizedUrl = url.replace(/[^a-z0-9]/gi, "_").toLowerCase(); // Sanitize the URL for file naming
  const reportFilePath = path.join(
    config.outputDir,
    `report_${sanitizedUrl}.html`
  );
  fs.writeFileSync(reportFilePath, reportHtml);

  console.log(`Accessibility report generated: ${reportFilePath}`);
}

async function runA11yChecksForMultiplePages(urls) {
  for (const url of urls) {
    try {
      await runA11yCheck(url);
    } catch (err) {
      console.error(`Error running accessibility check for ${url}:`, err);
    }
  }
}

// target urls for a11y check - later can be passed via gui tool or can be moved to config
const targetUrls = ["https://www.a11yproject.com/checklist/"];

runA11yChecksForMultiplePages(targetUrls).catch((err) => {
  console.error("Error running accessibility checks:", err);
});
