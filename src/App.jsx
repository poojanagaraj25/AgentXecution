import { useState } from "react";

function App() {

  const [transcript, setTranscript] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [approved, setApproved] = useState(false);

  const [history, setHistory] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);

  // 🎤 VOICE ASSIST
  const startVoice = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice Recognition Not Supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {

      const speech = event.results[0][0].transcript;

      // 🎧 LISTENER AGENT
      setTranscript((prev) => prev + " " + speech);

      const command = speech.toLowerCase();

      // ⚡ VOICE COMMAND
      if (command.includes("assign to")) {

        const name = command.split("assign to")[1]?.trim();

        const updatedTasks = tasks.map((task, index) => {

          if (index === 0) {
            return {
              ...task,
              owner: name
            };
          }

          return task;
        });

        setTasks(updatedTasks);
      }

      alert("🎤 Voice Captured: " + speech);
    };

    recognition.start();
  };

  // 🚀 GENERATE TASKS
  function generateTasks() {

    if (transcript.trim() === "") {
      setError("Please enter transcript");
      return;
    }

    setError("");
    setApproved(false);

    const sentences = transcript.split(".");
    const extractedTasks = [];

    sentences.forEach((line) => {

      const text = line.trim();

      if (!text) return;

      let owner = text.split(" ")[0];

      let deadline = "Not specified";

      if (text.includes("by")) {
        deadline = text.split("by")[1].trim();
      }
      else if (text.includes("today")) {
        deadline = "Today";
      }
      else if (text.includes("tomorrow")) {
        deadline = "Tomorrow";
      }
      else if (text.includes("tonight")) {
        deadline = "Tonight";
      }

      // 🛡 RISK ENGINE
      let riskScore = 20;
      let reason = "Normal";

      if (deadline === "Not specified") {
        riskScore += 50;
        reason = "Missing deadline";
      }

      if (text.length < 15) {
        riskScore += 20;
        reason = "Task too vague";
      }

      if (text.toLowerCase().includes("urgent")) {
        riskScore += 30;
        reason = "Urgent task";
      }

      if (
        text.toLowerCase().includes("today") ||
        text.toLowerCase().includes("tonight")
      ) {
        riskScore += 40;
        reason = "Insufficient execution time";
      }

      let risk = "Low";

      if (riskScore >= 71) {
        risk = "High";
      }
      else if (riskScore >= 41) {
        risk = "Medium";
      }

      const delayProbability =
        Math.min(100, riskScore + 10);

      extractedTasks.push({
        task: text,
        owner,
        deadline,
        status: "Pending",
        risk,
        riskScore,
        reason,
        delayProbability,
        prediction:
          delayProbability > 80
            ? "⚠️ High chance of delay"
            : "✅ Likely to complete on time"
      });

    });

    // 🧠 WORKLOAD DETECTION
    const ownerCount = {};

    extractedTasks.forEach((t) => {
      ownerCount[t.owner] =
        (ownerCount[t.owner] || 0) + 1;
    });

    extractedTasks.forEach((t) => {

      if (ownerCount[t.owner] >= 3) {

        t.risk = "High";

        t.reason = "Owner overloaded";

        t.delayProbability = 95;

        t.prediction =
          "⚠️ Team workload overload detected";
      }

    });

    setTasks(extractedTasks);

    // ✅ REVIEWER AGENT
    const emailContent = extractedTasks
      .map(
        (t) =>
          `${t.task}

Owner: ${t.owner}
Deadline: ${t.deadline}
Risk: ${t.risk}
Delay Prediction: ${t.delayProbability}%`
      )
      .join("\n\n");

    setEmailDraft(`Subject: AI Execution Summary

${emailContent}`);
  }

  // ✅ MARK DONE
  const markDone = (i) => {

    setHistory((prev) => [
      ...prev,
      JSON.parse(JSON.stringify(tasks))
    ]);

    const updated = [...tasks];

    updated[i].status = "Completed";

    setTasks(updated);
  };

  // 🔁 UNDO
  const undoLastAction = () => {

    if (history.length === 0) {
      alert("Nothing to undo");
      return;
    }

    const previous =
      history[history.length - 1];

    setTasks(previous);

    setHistory(history.slice(0, -1));

    alert("↩️ Last action undone");
  };

  // ⚡ COMMAND SYSTEM
  const handleCommand = (e) => {

    if (e.key === "Enter") {

      const cmd =
        e.target.value.toLowerCase().trim();

      setHistory((prev) => [
        ...prev,
        JSON.parse(JSON.stringify(tasks))
      ]);

      // ⚡ ASSIGN
      if (cmd.includes("assign to")) {

        const name =
          cmd.split("assign to")[1]?.trim();

        const updatedTasks = tasks.map(
          (task, index) => {

            if (index === 0) {

              return {
                ...task,
                owner: name
              };
            }

            return task;
          }
        );

        setTasks(updatedTasks);

        alert(
          `⚡ Executor Agent assigned task to ${name}`
        );
      }

      // ✅ COMPLETE
      else if (
        cmd.includes("mark completed")
      ) {

        const updatedTasks = tasks.map(
          (task, index) => {

            if (index === 0) {

              return {
                ...task,
                status: "Completed"
              };
            }

            return task;
          }
        );

        setTasks(updatedTasks);

        alert("✅ Task completed");
      }

      // 🚨 PRIORITY
      else if (
        cmd.includes("high priority") ||
        cmd.includes("increase priority")
      ) {

        const updatedTasks = tasks.map(
          (task, index) => {

            if (index === 0) {

              return {
                ...task,
                risk: "Critical",
                delayProbability: 99,
                reason:
                  "Executor Agent escalated priority"
              };
            }

            return task;
          }
        );

        setTasks(updatedTasks);

        alert("🚨 Priority escalated");
      }

      // ⏰ DEADLINE
      else if (
        cmd.includes(
          "move deadline to tomorrow"
        )
      ) {

        const updatedTasks = tasks.map(
          (task, index) => {

            if (index === 0) {

              return {
                ...task,
                deadline: "Tomorrow"
              };
            }

            return task;
          }
        );

        setTasks(updatedTasks);

        alert("⏰ Deadline updated");
      }

      // ❌ CANCEL
      else if (
        cmd.includes("cancel task")
      ) {

        const updatedTasks = tasks.map(
          (task, index) => {

            if (index === 0) {

              return {
                ...task,
                status: "Cancelled"
              };
            }

            return task;
          }
        );

        setTasks(updatedTasks);

        alert("❌ Task cancelled");
      }

      // 🔥 SIMULATE
      else if (
        cmd.includes("simulate delay")
      ) {

        const updatedTasks = tasks.map(
          (task, index) => {

            if (index === 0) {

              return {
                ...task,
                prediction:
                  "⚠️ If delayed by 2 days, project completion slips by 4 days.",
                risk: "Critical",
                delayProbability: 99
              };
            }

            return task;
          }
        );

        setTasks(updatedTasks);

        alert(
          "📈 Scenario simulation generated"
        );
      }

      else {
        alert("Command not recognized");
      }

      e.target.value = "";
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.heroGlow}></div>

      <h1 style={styles.title}>
        AgentXecution
      </h1>

      <p style={styles.subtitle}>
        AI Multi-Agent Execution Operating System
      </p>

      <p style={styles.time}>
        {new Date().toLocaleString()}
      </p>

      {/* INPUT */}
      <div style={styles.card}>

        <textarea
          style={styles.textarea}
          value={transcript}
          onChange={(e) =>
            setTranscript(e.target.value)
          }
          placeholder="Paste transcript..."
        />

        <div style={styles.buttonRow}>

          <button
            style={styles.button}
            onClick={generateTasks}
          >
            Generate
          </button>

          <button
            style={styles.voiceButton}
            onClick={startVoice}
          >
            🎤 Voice Assist
          </button>

          <button
            style={styles.undoButton}
            onClick={undoLastAction}
          >
            ↩️ Undo
          </button>

        </div>

        <input
          style={styles.command}
          placeholder="assign to Priya"
          onKeyDown={handleCommand}
        />

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

      </div>

      {/* 🤖 AGENTS */}
      <div style={styles.agentPanel}>

        <div style={styles.agent}>
          🎧 Listener Agent
          <p style={styles.agentStatus}>
            {transcript
              ? "Transcript captured"
              : "Waiting for transcript"}
          </p>
        </div>

        <div style={styles.agent}>
          🧠 Planner Agent
          <p style={styles.agentStatus}>
            {tasks.length > 0
              ? "Workflow generated"
              : "Waiting for planning"}
          </p>
        </div>

        <div style={styles.agent}>
          🛡 Risk Agent
          <p style={styles.agentStatus}>
            {tasks.some(
              (t) => t.risk === "High"
            )
              ? "High risk detected"
              : "Monitoring risks"}
          </p>
        </div>

        <div style={styles.agent}>
          ✅ Reviewer Agent
          <p style={styles.agentStatus}>
            {emailDraft
              ? "Execution reviewed"
              : "Awaiting review"}
          </p>
        </div>

        <div style={styles.agent}>
          ⚡ Executor Agent
          <p style={styles.agentStatus}>
            {approved
              ? "Workflow approved"
              : "Awaiting execution"}
          </p>
        </div>

      </div>

      {/* DASHBOARD */}
      {tasks.length > 0 && (
        <>

          <div style={styles.dashboard}>

            <div style={styles.smallCard}>
              <h3>Total Tasks</h3>
              <p>{tasks.length}</p>
            </div>

            <div style={styles.smallCard}>
              <h3>Completed</h3>
              <p>
                {
                  tasks.filter(
                    (t) =>
                      t.status === "Completed"
                  ).length
                }
              </p>
            </div>

            <div style={styles.smallCard}>
              <h3>High Risk</h3>
              <p>
                {
                  tasks.filter(
                    (t) =>
                      t.risk === "High"
                  ).length
                }
              </p>
            </div>

          </div>

          {/* GRAPH */}
          <div style={styles.graph}>

            <div
              style={{
                ...styles.bar,
                height:
                  tasks.filter(
                    (t) =>
                      t.status === "Completed"
                  ).length * 60
              }}
            ></div>

            <div
              style={{
                ...styles.bar,
                background: "#facc15",
                height:
                  tasks.filter(
                    (t) =>
                      t.status === "Pending"
                  ).length * 60
              }}
            ></div>

            <div
              style={{
                ...styles.bar,
                background: "#ef4444",
                height:
                  tasks.filter(
                    (t) =>
                      t.risk === "High"
                  ).length * 60
              }}
            ></div>

          </div>

          {/* TASKS */}
          {tasks.map((t, i) => (

            <div
              key={i}
              style={styles.task}
            >

              <p>
                <b>Task:</b> {t.task}
              </p>

              <p>
                <b>Owner:</b> {t.owner}
              </p>

              <p>
                <b>Deadline:</b> {t.deadline}
              </p>

              <p>
                <b>Risk:</b> {t.risk}
              </p>

              <p>
                <b>Reason:</b> {t.reason}
              </p>

              <p>
                <b>Delay Prediction:</b>{" "}
                {t.delayProbability}%
              </p>

              <p>
                <b>AI Prediction:</b>{" "}
                {t.prediction}
              </p>

              <p>
                <b>Status:</b> {t.status}
              </p>

              {t.status !== "Completed" && (
                <button
                  style={styles.done}
                  onClick={() =>
                    markDone(i)
                  }
                >
                  Done
                </button>
              )}

            </div>

          ))}

          {/* REVIEWER */}
          <div style={styles.card}>

            <h2>Email Preview</h2>

            <textarea
              style={styles.email}
              value={emailDraft}
              readOnly
            />

            <div style={styles.buttonRow}>

              <button
                style={styles.approve}
                onClick={() => {

                  setEmailHistory(
                    (prev) => [
                      ...prev,
                      emailDraft
                    ]
                  );

                  setApproved(true);
                }}
              >
                Approve
              </button>

            </div>

            {approved && (
              <p style={styles.success}>
                ✅ Workflow Approved
              </p>
            )}

          </div>

        </>
      )}

    </div>
  );
}

const styles = {

  page: {
    background:
      "radial-gradient(circle at top, #1a0033, #000)",
    color: "#e0d7ff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial"
  },

  heroGlow: {
    position: "absolute",
    top: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "400px",
    height: "200px",
    background:
      "rgba(139,92,246,0.25)",
    filter: "blur(90px)"
  },

  title: {
    textAlign: "center",
    fontSize: "58px",
    color: "#8a2be2"
  },

  subtitle: {
    textAlign: "center",
    color: "#aaa"
  },

  time: {
    textAlign: "center",
    color: "#777"
  },

  card: {
    background:
      "rgba(20,20,20,0.85)",
    padding: "25px",
    borderRadius: "20px",
    marginTop: "20px"
  },

  textarea: {
    width: "100%",
    height: "140px",
    background: "#0f0f0f",
    color: "white",
    borderRadius: "14px",
    border: "1px solid #333",
    padding: "14px"
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "16px"
  },

  button: {
    background:
      "linear-gradient(90deg,#2563eb,#9333ea)",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer"
  },

  voiceButton: {
    background: "#111",
    color: "white",
    padding: "12px 24px",
    border:
      "1px solid #8a2be2",
    borderRadius: "12px",
    cursor: "pointer"
  },

  undoButton: {
    background: "#ef4444",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer"
  },

  command: {
    marginTop: "14px",
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #444",
    background: "#111",
    color: "white"
  },

  dashboard: {
    display: "flex",
    gap: "16px",
    marginTop: "25px",
    justifyContent: "center"
  },

  smallCard: {
    background: "#111",
    padding: "18px",
    borderRadius: "16px",
    width: "180px",
    textAlign: "center"
  },

  graph: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginTop: "30px",
    alignItems: "end",
    height: "240px"
  },

  bar: {
    width: "70px",
    background: "#10b981",
    borderRadius: "12px",
    transition: "0.5s"
  },

  task: {
    background: "#111",
    padding: "18px",
    borderRadius: "18px",
    marginTop: "18px",
    border:
      "1px solid #222"
  },

  done: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    marginTop: "12px"
  },

  email: {
    width: "100%",
    height: "220px",
    background: "#0f0f0f",
    color: "white",
    borderRadius: "14px",
    padding: "14px"
  },

  approve: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px"
  },

  success: {
    color: "#10b981",
    marginTop: "10px"
  },

  error: {
    color: "red"
  },

  agentPanel: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginTop: "25px"
  },

  agent: {
    background: "#111",
    padding: "14px 18px",
    borderRadius: "14px",
    border:
      "1px solid #8b5cf6",
    minWidth: "180px"
  },

  agentStatus: {
    color: "#10b981",
    fontSize: "12px",
    marginTop: "8px"
  }

};

export default App;