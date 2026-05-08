from openai import OpenAI
import json

client = OpenAI(api_key="YOUR_API_KEY")

def call_llm(prompt):
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # replace with OpenCLAW model if given
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


# 🔹 Variant 1: Task Extraction
def extract_tasks_llm(text):
    prompt = f"""
    Extract tasks from this transcript.
    Return JSON array with task, owner, deadline.

    {text}
    """
    return call_llm(prompt)


# 🔹 Variant 2: Risk Analysis
def risk_analysis_llm(tasks):
    prompt = f"""
    Analyze risk level (High, Medium, Low) for each task:

    {tasks}
    """
    return call_llm(prompt)


# 🔹 Variant 3: Reviewer Agent
def reviewer_llm(tasks):
    prompt = f"""
    Check tasks and find issues like:
    - missing deadline
    - unclear task

    {tasks}
    """
    return call_llm(prompt)