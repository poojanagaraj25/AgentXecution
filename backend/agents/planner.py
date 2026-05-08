from llm_engine import extract_tasks_llm
from ai_logic import extract_tasks
import json

def plan(text):
    try:
        res = extract_tasks_llm(text)
        return json.loads(res)
    except:
        return extract_tasks(text)