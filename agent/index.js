import express from "express";
import { analyzePipelineLogs } from "./analyzer.js";
import { createFixMR } from "./gitlab_api.js";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  const payload = req.body;

  if (payload.object_kind !== "pipeline") return;
  if (payload.object_attributes?.status !== "failed") return;

  console.log("🔴 Pipeline failed! Starting PipelineIQ...");

  const failedJobs = payload.builds?.filter(b => b.status === "failed") || [];
  const logSummary = failedJobs.map(j => `Job: ${j.name}\nStage: ${j.stage}`).join("\n");

  const logs = `Pipeline failed in project: ${payload.project?.name}
Failed jobs:
${logSummary}
Commit: ${payload.commit?.message}
Branch: ${payload.object_attributes?.ref}`;

  console.log("📋 Analyzing logs with AI...");
  const analysis = await analyzePipelineLogs(logs);
  console.log("🤖 Analysis:", analysis);

  if (analysis.confidence >= 6) {
    console.log("🔧 Creating fix MR...");
    const mr = await createFixMR(analysis);
    console.log("✅ MR created:", mr.web_url);
  } else {
    console.log("⚠️ Low confidence, skipping auto-fix");
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "PipelineIQ is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ PipelineIQ running on port ${PORT}`));