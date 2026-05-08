from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents.orchestrator import run_system
from memory import store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.get("/heartbeat")
def heartbeat():
    return {"status": "alive"}

@app.post("/generate")
def generate(data: dict):
    text = data.get("transcript", "")

    tasks, warnings, simulation, quality, execution = run_system(text)

    return {
        "tasks": tasks,
        "warnings": warnings,
        "simulation": simulation,
        "quality": quality
    }