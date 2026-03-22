import { analyzePipelineLogs } from "./agent/analyzer.js";
import { createFixMR } from "./agent/gitlab_api.js";

const analysis = await analyzePipelineLogs("Error: Cannot find module ./utils");
console.log("Analysis:", analysis);

const mr = await createFixMR(analysis);
console.log("Full MR response:", JSON.stringify(mr, null, 2));