const getDriver = require("./common/get-driver");
const { createWorkflowSummary } = require("../utils/create-workflow-summary");
const {
  writeScreenshotsToDisk,
} = require("../utils/write-screenshots-to-disk");
const plainCommandSequence = require("./common/plain-command-sequence");
const withScreencastCdp = require("./with-screencast-cdp");
const withProxiedExecutorTakescreenshot = require("./with-proxied-executor-takescreenshot");
const withProxiedExecutorBidiCaptureScreenshot = require("./with-proxied-executor-bidi-capture-screenshot");
const withProxiedExecutorCdpScreenshot = require("./with-proxied-executor-cdp-screenshot");

const scenario = {
  plainCommandSequence,
  withScreencastCdp,
  withProxiedExecutorTakescreenshot,
  withProxiedExecutorBidiCaptureScreenshot,
  withProxiedExecutorCdpScreenshot,
};

const measure = async (scenario, withSeleniumGrid) => {
  const scenarioName = Object.keys(scenario)[0];
  let screenshotsAllRuns = [];
  let durationsAllRuns = [];

  console.log("Running scenario", scenarioName);

  for (let index = 0; index < 4; index++) {
    const runWithSeleniumGrid = withSeleniumGrid === "true";
    const driver = await getDriver(runWithSeleniumGrid);

    console.log(`Browser instance ${index} started`);

    const startTime = Date.now();
    const screenshotsSingleRun = await scenario[scenarioName](driver);
    durationsAllRuns.push(Date.now() - startTime);

    if (screenshotsSingleRun) {
      screenshotsAllRuns.push(screenshotsSingleRun);
    }

    await driver.quit();
  }

  createWorkflowSummary(durationsAllRuns, scenarioName);

  if (screenshotsAllRuns.length > 0) {
    writeScreenshotsToDisk(screenshotsAllRuns, scenarioName);
  }
};

(async function () {
  const [, , scenarioName] = process.argv;
  const { WITH_SELENIUM_GRID } = process.env;
  await measure(scenario[scenarioName], WITH_SELENIUM_GRID);
})();
