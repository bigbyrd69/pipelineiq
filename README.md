# PipelineIQ — AI Agent for GitLab CI/CD

> Built for the GitLab AI Hackathon 2026

## The Problem

Every developer knows the pain. You push code, the pipeline fails, and you spend 30-60 minutes reading cryptic logs trying to figure out what went wrong. Then you fix it, push again, wait again. This cycle kills productivity every single day.

## The Solution

PipelineIQ is an AI agent that watches your GitLab pipelines 24/7. The moment a pipeline fails, it:

1. Automatically receives the failure via GitLab webhook
2. Analyzes the logs using Gemini AI
3. Identifies the root cause in plain English
4. Creates a fix branch automatically
5. Opens a Merge Request with the suggested fix
6. Remembers past fixes to get smarter over time

**Zero manual debugging. Zero wasted time.**

## Demo

[![PipelineIQ Demo](https://img.shields.io/badge/Watch-Demo%20Video-red)](YOUR_YOUTUBE_LINK_HERE)

## How It Works
```
GitLab Pipeline Fails
        ↓
Webhook fires to PipelineIQ
        ↓
Gemini AI analyzes the logs
        ↓
Agent creates fix branch
        ↓
MR opened automatically
        ↓
Developer reviews & merges
```

## Tech Stack

- **GitLab Duo Agent Platform** — agent orchestration
- **Gemini AI (Google)** — log analysis and fix generation  
- **GitLab REST API** — branch creation and MR automation
- **Node.js + Express** — webhook server
- **Railway** — cloud deployment
- **Memory system** — learns from past fixes per repo

## What Changed For Developers

Before PipelineIQ:
- 30-60 min debugging failed pipelines manually
- Reading cryptic error logs
- Manually creating fix branches and MRs

After PipelineIQ:
- 0 minutes debugging — agent handles it
- Plain English explanation of what failed
- Fix MR ready to review in under 2 minutes

## Setup

### Prerequisites
- GitLab account
- Gemini API key (free at aistudio.google.com)
- Node.js 18+

### Installation
```bash
git clone https://gitlab.com/KrYPt0NiTE69/pipelineiq.git
cd pipelineiq
npm install
```

### Environment Variables

Create a `.env` file:
```
GEMINI_API_KEY=your_gemini_key
GITLAB_TOKEN=your_gitlab_token
GITLAB_PROJECT_ID=your_project_id
PORT=3000
```

### Run Locally
```bash
node agent/index.js
```

### Deploy

Deploy to Railway, Render, or any Node.js host. Then add your public URL as a GitLab webhook:

1. GitLab repo → Settings → Webhooks
2. URL: `https://your-app.railway.app/webhook`
3. Check "Pipeline events"
4. Save

## API

### Health Check
```
GET /health
→ {"status": "PipelineIQ is running"}
```

### Webhook Receiver
```
POST /webhook
← GitLab pipeline event payload
→ Triggers AI analysis and MR creation
```

## Prize Categories

- GitLab Duo Agent Platform (Journey 3: Pipeline Observability)
- Google Cloud / Gemini AI integration
- Anthropic Claude compatible architecture

## Built By

Sonal Singh (@KrYPt0NiTE69)
GitLab AI Hackathon 2026