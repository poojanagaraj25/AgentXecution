# AgentXecution

## Problem Statement

In most meetings, tasks, deadlines, and responsibilities are discussed verbally, but after the meeting ends, teams still spend time manually organizing and tracking execution.

Existing tools mainly focus on note-taking or task storage, but they do not actively predict execution risks, monitor workload pressure, or assist teams proactively.

## Our Solution

AgentXecution is an AI-powered Multi-Agent Execution System that converts meeting discussions into structured, trackable workflows automatically.

The system captures meeting discussions through text or voice input, extracts tasks and deadlines, predicts execution risks, and generates workflow summaries using multiple AI agents.

## Key Features

-  Voice Assist using Speech Recognition
-  Multi-Agent Workflow System
-  Live Dashboard Analytics
-  AI Risk Detection
-  Deadline Prediction
-  Undo System
-  Workflow Summary Generation
-  Execution Monitoring
-  Futuristic Samsung-inspired UI

## Multi-Agent Architecture

- **Listener Agent** → Captures meeting discussions
- **Planner Agent** → Extracts tasks and workflow
- **Risk Agent** → Predicts delays and execution risks
- **Reviewer Agent** → Generates workflow summaries
- **Executor Agent** → Handles execution interventions

## Tech Stack
### Frontend
- React.js
- CSS

### Backend
- FastAPI
- Python

### AI / ML
- NLP-based Task Extraction
- Speech-to-Text Integration
- AI Risk Prediction Logic
- Multi-Agent Workflow Orchestration

### Data Handling
- JSON-based Task Tracking
- History Stack for Undo System

---

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm start

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Usage
Enter or speak meeting transcript
Click Generate
AI agents process the workflow
Tasks, deadlines, and risks are extracted
Dashboard analytics are displayed
Workflow summary is generated automatically
Future Enhancements
OpenClaw autonomous agent integration
AI-based task reassignment
Smart calendar synchronization
Real-time team collaboration
Advanced meeting quality analysis
Autonomous workflow execution
Demo Features
Voice-controlled meeting capture
AI-based risk prediction
Deadline delay prediction
Animated execution dashboard
Undo workflow rollback
Multi-agent orchestration
Conclusion

AgentXecution is not just a meeting notes application.

It is an intelligent execution operating system that listens to meetings, predicts delays, identifies bottlenecks, monitors workload pressure, and helps teams execute workflows more efficiently