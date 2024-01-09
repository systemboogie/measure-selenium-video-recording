# measure-selenium-video-recording

## What is this?

This demonstrates different approaches of creating a video recording from a
browser test run in Selenium:

- Approach 1: Proper whole-screen video recording with _ffmpeg_ during test
  runtime
- Approach 2: Creating a sequence of screenshots from the browser's viewport,
  then stitching them together with _ffmpeg_ **after** test runtime

For the second approach, I tried different implementations:

- 2a) Use the screencast functionality of Chrome Devtools Protocol
- Proxy the WebDriver executor and on every executed WebDriver command take a
  screenshot with one of the following methods:
  - 2b) CDP `Page.captureScreenshot`
  - 2c) WebDriver BiDi `captureScreenshot()`
  - 2d) WebDriver `takeScreenshot()`

With each commit to this repository, workflows run each of the implementations 4
times. Each workflow summary displays the timings. Some examples:

- For the ffmpeg implementation (1):
  [link](https://github.com/systemboogie/measure-selenium-video-recording/actions/runs/7466908766#summary-20319306235)
- For the other implementations (2a, 2b, 2c, 2d):
  [link](https://github.com/systemboogie/measure-selenium-video-recording/actions/runs/7466908763#summary-20319306229)

The workflow summaries also contain the screenshots and videos produced.

## Why?

I did this because I stumbled across the screencast functionality in Chrome
Devtools Protocol and wanted to give it a spin. Because the JavaScript bindings
of WebDriver do not offer support for using the screencast feature and the
project does not want to add it (see
[this GitHub issue](https://github.com/SeleniumHQ/selenium/issues/12017)), I
played around with other methods of creating a series of screenshots.

## Measurements

GitHub deletes workflow data after a while (not sure about the summaries).
Therefore I decided to put some of the timings here in this readme file.

The results:

- Recording a video via _ffmpeg_ (1) does not add considerably to the test
  execution time. It is less time-consuming than all approaches that create a
  series of screenshots
- The same is true for the CDP screencast implementation (2a)
- The "proxied executor" implementations (2b, 2c, 2d) all add considerably to
  the timings, especially the one that uses the BiDi screenshot command. Using
  the CDP screenshot command seems to be the fastest option

The timings shown below are in milliseconds.

| Implementation                                  | Run 1 | Run 2 | Run 3 | Run 4 |
| ----------------------------------------------- | ----- | ----- | ----- | ----- |
| Plain command sequence (no screenshots/video)   | 4155  | 4030  | 4088  | 4080  |
| 1) Record video with _ffmpeg_ at runtime        | 4140  | 4008  | 3928  | 3946  |
| 2a) CDP screencast                              | 4083  | 3939  | 3983  | 3951  |
| 2b) Proxied executor + CDP screenshot           | 4903  | 4585  | 4557  | 4510  |
| 2c) Proxied executor + BiDi screenshot          | 6102  | 5956  | 5786  | 5969  |
| 2d) Proxied executor + classic `takeScreenshot` | 5246  | 5165  | 4929  | 5125  |
