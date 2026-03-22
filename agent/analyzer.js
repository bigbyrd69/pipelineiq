import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// The new SDK automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

const MEMORY_FILE = path.join("agent", "memory.md");

// Ensure the agent directory exists so fs.appendFileSync doesn't crash
const agentDir = path.dirname(MEMORY_FILE);
if (!fs.existsSync(agentDir)) {
  fs.mkdirSync(agentDir, { recursive: true });
}

function loadMemory() {
  if (fs.existsSync(MEMORY_FILE)) {
    return fs.readFileSync(MEMORY_FILE, "utf-8");
  }
  return "No previous fixes recorded yet.";
}

function saveMemory(cause, fix) {
  const entry = `\n## ${new Date().toISOString()}\n- **Cause:** ${cause}\n- **Fix:** ${fix}\n`;
  fs.appendFileSync(MEMORY_FILE, entry);
}

export async function analyzePipelineLogs(logs) {
  const memory = loadMemory();

  const prompt = `You are a CI/CD expert AI agent called PipelineIQ.

Past fixes for this repo:
${memory}

A GitLab pipeline just failed. Here are the build logs:
${logs}

Respond ONLY with valid JSON, no extra text:
{
  "cause": "one sentence root cause",
  "fix_file": "path/to/file.js",
  "fix_description": "what to change in plain english",
  "confidence": 8
}`;

  try {
    // NEW SDK Syntax using gemini-2.5-flash
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    // Note: in the new SDK, .text is a property, not a function
    const text = response.text.replace(/```json|```/g, "").trim();
    
    const parsed = JSON.parse(text);
    saveMemory(parsed.cause, parsed.fix_description);
    return parsed;
  } catch (e) {
    console.error("Error analyzing logs or parsing JSON:", e);
    return { cause: "Unknown", fix_file: "", fix_description: "", confidence: 0 };
  }
}