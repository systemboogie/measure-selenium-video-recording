const webdriver = require("selenium-webdriver");
const { timestampMicroseconds } = require("../utils/timestamp");
const { plainCommandSequence } = require("./common/plain-command-sequence");

exports.withProxiedExecutorTakescreenshot = async (driver) => {
  let screenshotData = {};

  const executeProxy = (originalExecute) => {
    return new Proxy(originalExecute, {
      apply: async (target, thisArg, args) => {
        const commandResult = await target.apply(thisArg, args);

        /** @type {import('selenium-webdriver/lib/command').Command} */
        const command = args[0];
        const commandName = command.getName();

        if (commandName !== "screenshot" && commandName !== "quit") {
          screenshotData[`${timestampMicroseconds()}.png`] =
            await driver.takeScreenshot();
        }

        return commandResult;
      },
    });
  };

  // Proxy WebDriver command executor to take screenshot on every command
  const originalExecute = webdriver.WebDriver.prototype.execute;
  webdriver.WebDriver.prototype.execute = executeProxy(
    webdriver.WebDriver.prototype.execute
  );

  await plainCommandSequence(driver);

  // Restore execute to not interfere with creating a new driver instance
  webdriver.WebDriver.prototype.execute = originalExecute;

  return screenshotData;
};
