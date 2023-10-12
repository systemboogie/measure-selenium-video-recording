const fs = require("node:fs");
const path = require("node:path");

exports.writeScreenshotsToDisk = (allScreenshots, type) => {
  try {
    const screenshotPath = path.join("tmp", type);
    fs.mkdirSync(screenshotPath, { recursive: true });

    allScreenshots.forEach((screenshotSet, index) => {
      fs.mkdirSync(path.join(screenshotPath, index.toString()), {
        recursive: true,
      });
      for (const [filename, base64Data] of Object.entries(screenshotSet)) {
        fs.writeFileSync(
          path.join(screenshotPath, index.toString(), filename),
          base64Data,
          "base64"
        );
      }
    });
  } catch (e) {
    console.log("Error while trying to write screenshots to disk; continue");
    console.log(e);
  }
};
