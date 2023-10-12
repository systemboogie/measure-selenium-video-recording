const os = require("node:os");
const { Select, until } = require("selenium-webdriver");

exports.plainCommandSequence = async (driver) => {
  const pageUrl = `http://${os.hostname()}:7080`;

  await driver
    .manage()
    .window()
    .setRect({ x: 1, y: 1, width: 1200, height: 800 });
  await driver.get(pageUrl);

  await driver.findElement({ css: 'a[href="/dropdown"]' }).click();
  const selectElement = await driver.findElement({ css: "#dropdown" });
  const select = new Select(selectElement);
  await select.selectByVisibleText("Option 1");

  await driver.get(pageUrl);

  await driver.findElement({ css: 'a[href="/dynamic_controls"]' }).click();
  await driver.findElement({ css: "#input-example button" }).click();

  const input = await driver.findElement({ css: "#input-example input" });
  await driver.wait(until.elementIsEnabled(input));
};
