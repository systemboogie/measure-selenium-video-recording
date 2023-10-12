const { plainCommandSequence } = require("./common/plain-command-sequence");
const { oneSecondMicroseconds } = require("../utils/timestamp");

exports.withScreencastCdp = async (driver) => {
  let screenshotData = {};

  /**
   * @type {CdpConnection}
   */
  const cdpConnection = await driver.createCDPConnection("page");

  cdpConnection.addListener("Page.screencastFrame", async (payload) => {
    const {
      params: {
        metadata: { timestamp },
        data,
        sessionId,
      },
    } = payload;

    screenshotData[`${timestamp * oneSecondMicroseconds}.jpeg`] = data;

    await cdpConnection.send("Page.screencastFrameAck", {
      sessionId,
    });
  });

  await cdpConnection.send("Page.startScreencast", {
    format: "jpeg",
    quality: 50, // 50% is sufficient, reduces image size to 1/3
    maxWidth: 1920,
    maxHeight: 1080,
    everyNthFrame: 1,
  });

  await plainCommandSequence(driver);

  await cdpConnection.send("Page.stopScreencast");

  return screenshotData;
};
