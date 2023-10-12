const { execSync } = require("node:child_process");
const ffmpegBin = require("ffmpeg-static");

module.exports = (concatDemuxFilePath, outputFilePath) => {
  try {
    // ffmpeg documentation: https://ffmpeg.org/ffmpeg.html
    const ffmpegArgs = [
      "-y", // Overwrite output files
      "-f concat", // https://trac.ffmpeg.org/wiki/Slideshow#Concatdemuxer
      `-i ${concatDemuxFilePath}`, // Input file name
      "-c:v libx264", // Set codec for encoding the video (x264)
      "-pix_fmt yuv420p", // Make .png source images work (https://superuser.com/a/632473)
      '-vf "pad=ceil(iw/2)*2:ceil(ih/2)*2"', // https://stackoverflow.com/a/20848224
    ];

    execSync(`${ffmpegBin} ${ffmpegArgs.join(" ")} ${outputFilePath}`, {
      stdio: "inherit",
    });
  } catch (e) {
    console.log("Error while converting screenshots to video; continue");
    console.log(e);
  }
};
