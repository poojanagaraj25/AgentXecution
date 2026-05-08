from agents.listener import listen
from agents.planner import plan
from agents.reviewer import review
from agents.executor import execute

from ai_logic import (
    calculate_risk,
    predict_delay,
    deadline_probability,
    meeting_quality_analysis,
    scenario_simulation
)

def run_system(text):
    clean = listen(text)
    tasks = plan(clean)

    for t in tasks:
        t["risk"] = calculate_risk(t["deadline"])
        t["prediction"] = predict_delay(t["task"])
        t["delay_probability"] = deadline_probability()

    warnings = review(tasks)
    simulation = scenario_simulation(tasks)
    quality = meeting_quality_analysis(text)
    execution = execute(tasks)

    return tasks, warnings, simulation, quality, execution