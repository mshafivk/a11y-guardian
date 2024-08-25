import path from "path";

import commonConfig from "./common.js";
import getChromeExecutablePath from "../utils/getChromeExecutablePath.js";

const config = {
  ...commonConfig,
  chromeExecutablePath: getChromeExecutablePath(), // Auto-detect based on OS
  a11yCheckLevel: "wcag2a", // Choose between wcag2a, wcag2aa, wcag2aaa
  outputDir: path.resolve("./reports"),
  reportConfig: {
    projectKey: commonConfig.title,
    // outputDir: path.resolve("./report"), // Directory to save reports
    // reportFileName: `${commonConfig.title}-report.html`,
    doNotCreateReportFile: true,
  },
};

export default config;
