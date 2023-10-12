const { summary } = require("@actions/core");

exports.createWorkflowSummary = async (durationsAllRuns) => {
  for (const [index, durationMs] of durationsAllRuns.entries()) {
    await summary.addRaw(`Run ${index} took ${durationMs}ms\n`).write();
  }

  await summary.addRaw("\n").write();
};
