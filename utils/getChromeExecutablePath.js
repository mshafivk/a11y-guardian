import os from "os";
import { header } from "./log.js";
import commonConfig from "../config/common.js";

const getChromeExecutablePath = () => {
  const platform = os.platform();

  console.log(header(`${commonConfig.title} running on: ${platform}`));

  switch (platform) {
    case "win32":
      return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    case "darwin":
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    case "linux":
      return "/usr/bin/google-chrome";
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};

export default getChromeExecutablePath;
