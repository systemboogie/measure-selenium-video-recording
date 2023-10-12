const { readdir } = require("node:fs/promises");
const path = require("node:path");
const createConcatDemuxFile = require("./create-concat-demux-file");
const convertScreenshotsToVideo = require("./convert-screenshots-to-video");

(async function () {
  const [, , scenarioName] = process.argv;

  const screenshotFolderPath = path.join("tmp", scenarioName, "0");
  const concatDemuxFilePath = path.join(screenshotFolderPath, "filelist.txt");
  const outputFilePath = path.join("tmp", `${scenarioName}.mp4`);
  let screenshotFilePaths;

  try {
    screenshotFilePaths = await readdir(screenshotFolderPath);
    console.log("------- screenshot folder path", screenshotFolderPath);
  } catch (e) {
    console.log(
      "Screenshot folder",
      screenshotFolderPath,
      "does not exist; continue"
    );
  }

  await createConcatDemuxFile(screenshotFilePaths, concatDemuxFilePath);
  convertScreenshotsToVideo(concatDemuxFilePath, outputFilePath);
})();
