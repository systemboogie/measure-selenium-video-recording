const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

module.exports = async (withSeleniumGrid) => {
  const builder = new Builder().forBrowser("chrome");

  if (!withSeleniumGrid) {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("headless=new");
    chromeOptions.enableBidi();

    builder.setChromeOptions(chromeOptions);
  }

  if (withSeleniumGrid) {
    builder.usingServer("http://localhost:4444/");
  }

  return await builder.build();
};
