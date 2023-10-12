const webdriver = require("selenium-webdriver");
const getBrowsingContextInstance = require("selenium-webdriver/bidi/browsingContext");
const { timestampMicroseconds } = require("../utils/timestamp");
const { plainCommandSequence } = require("./common/plain-command-sequence");

exports.withProxiedExecutorBidiCaptureScreenshot = async (driver) => {
  let screenshotData = {};

  const executeProxy = (originalExecute, browsingContext) => {
    return new Proxy(originalExecute, {
      apply: async (target, thisArg, args) => {
        const commandResult = await target.apply(thisArg, args);

        /** @type {import('selenium-webdriver/lib/command').Command} */
        const command = args[0];
        const commandName = command.getName();

        if (commandName !== "screenshot" && commandName !== "quit") {
          screenshotData[`${timestampMicroseconds()}.png`] =
            await browsingContext.captureScreenshot();
        }

        return commandResult;
      },
    });
  };

  const windowHandle = await driver.getWindowHandle();
  const browsingContext = await getBrowsingContextInstance(driver, {
    browsingContextId: windowHandle,
  });

  // Proxy WebDriver command executor to take screenshot on every command
  const originalExecute = webdriver.WebDriver.prototype.execute;
  webdriver.WebDriver.prototype.execute = executeProxy(
    webdriver.WebDriver.prototype.execute,
    browsingContext
  );

  await plainCommandSequence(driver);

  // Restore execute to not interfere with creating a new driver instance
  webdriver.WebDriver.prototype.execute = originalExecute;

  return screenshotData;
};
