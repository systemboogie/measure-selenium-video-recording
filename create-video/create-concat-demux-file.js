const { writeFile } = require("node:fs/promises");
const path = require("node:path");
const { oneSecondMicroseconds } = require("../utils/timestamp");

module.exports = async (screenshotFilePaths, concatDemuxFilePath) => {
  const lastDurationMicroseconds = oneSecondMicroseconds;

  try {
    const fileExtension = path.extname(screenshotFilePaths[0]).toLowerCase();

    const timestamps = screenshotFilePaths
      .filter((file) => path.extname(file).toLowerCase() === fileExtension)
      .map((file) => path.basename(file, fileExtension));

    const durations = timestamps
      .slice(1)
      .map((timestamp, index) => timestamp - timestamps[index]);

    const result = timestamps.flatMap((timestamp, index) => {
      const duration = !isNaN(durations[index])
        ? durations[index]
        : lastDurationMicroseconds;
      return [
        "file " + timestamp + fileExtension,
        "duration " + duration + "us",
      ];
    });

    // "Due to a quirk, the last image has to be
    // specified twice - the 2nd time without any duration directive"
    // https://trac.ffmpeg.org/wiki/Slideshow#Concatdemuxer
    result.push("file " + timestamps[timestamps.length - 1] + fileExtension);

    const fileContent = result.join("\n");
    await writeFile(concatDemuxFilePath, fileContent);

    console.log("Concat demux input file written to " + concatDemuxFilePath);
  } catch (e) {
    console.log("Error while creating demux file list for ffmpeg; continue");
    console.log(e);
  }
};
