import re
import random

def extract_tasks(text):
    tasks = []
    lines = text.split(".")

    for line in lines:
        match = re.search(r"(\w+) will (.+?) by (.+)", line)
        if match:
            tasks.append({
                "task": match.group(2),
                "owner": match.group(1),
                "deadline": match.group(3),
                "status": "Pending"
            })
    return tasks


def calculate_risk(deadline):
    d = deadline.lower()
    if "today" in d: return "High"
    if "tomorrow" in d: return "Medium"
    return "Low"


def predict_delay(task):
    if "review" in task.lower():
        return "Possible delay"
    return "On time"


def deadline_probability():
    return f"{random.randint(60,90)}% chance of delay"


def meeting_quality_analysis(text):
    total = len(text.split("."))
    vague = text.lower().count("soon") + text.lower().count("later")

    return {
        "efficiency": f"{100 - vague*10}%",
        "vague": vague,
        "total": total
    }


def scenario_simulation(tasks):
    if any(t["risk"] == "High" for t in tasks):
        return "⚠️ Project may slip by 2 days"
    return "✅ Project on track"