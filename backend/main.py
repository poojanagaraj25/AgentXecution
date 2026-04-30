from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5179"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    transcript: str

@app.post("/extract-tasks")
async def extract_tasks(request: TranscriptRequest):
    transcript = request.transcript
    tasks = []

    # Split transcript by "."
    sentences = [s.strip() for s in transcript.split(".") if s.strip()]

    for sentence in sentences:
        words = sentence.split()
        if not words:
            continue

        # First word = owner
        owner = words[0]

        # Extract deadline
        deadline = "Not specified"
        if "by" in sentence.lower():
            # Find "by" and take words after it
            by_index = sentence.lower().find("by")
            after_by = sentence[by_index + 2:].strip()
            deadline_words = after_by.split()[:3]  # Take first 3 words
            deadline = " ".join(deadline_words)
        elif "tomorrow" in sentence.lower():
            deadline = "Tomorrow"
        elif "tonight" in sentence.lower():
            deadline = "Tonight"

        # Create task object
        task = {
            "task": sentence,
            "owner": owner,
            "deadline": deadline,
            "status": "Pending"
        }
        tasks.append(task)

    return {"tasks": tasks}