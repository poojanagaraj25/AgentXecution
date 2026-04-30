import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [approved, setApproved] = useState(false);

  function generateTasks() {
    if (transcript.trim() === "") {
      setError("Please enter meeting transcript");
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
      } else if (text.includes("tomorrow")) {
        deadline = "Tomorrow";
      } else if (text.includes("tonight")) {
        deadline = "Tonight";
      }

      extractedTasks.push({
        task: text,
        owner,
        deadline,
        status: "Pending",
      });
    });

    setTasks(extractedTasks);

    const emailContent = extractedTasks
      .map((t) => `${t.task} (Owner: ${t.owner}, Deadline: ${t.deadline})`)
      .join("\n");

    setEmailDraft(`Subject: Task Update from Meeting

Dear Team,

Based on our meeting, here are the tasks:

${emailContent}

Best regards,
AgentXecution`);
  }

  const missingDeadline = tasks.some((t) => t.deadline === "Not specified");

  return (
    <div style={styles.page}>
      <div style={styles.heroGlow}></div>

      <h1 style={styles.title}>AgentXecution</h1>
      <p style={styles.subtitle}>From meeting discussions to completed tasks</p>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Meeting Transcript</h2>

        <textarea
          style={styles.textarea}
          placeholder="Paste meeting transcript here... Example: Rahul will prepare PPT by 7 PM. Priya will review it by 8 PM."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        <button style={styles.button} onClick={generateTasks}>
          Generate Tasks
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      {tasks.length > 0 && (
        <>
          <div style={styles.dashboard}>
            <div style={styles.smallCard}>
              <h3>Total</h3>
              <p>{tasks.length}</p>
            </div>

            <div style={styles.smallCard}>
              <h3>Pending</h3>
              <p>{tasks.filter((t) => t.status === "Pending").length}</p>
            </div>

            <div style={styles.smallCard}>
              <h3>Completed</h3>
              <p>{tasks.filter((t) => t.status === "Completed").length}</p>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>AI Execution Preview</h2>

            <div style={styles.previewBox}>
              <p>
                <b>Detected Workflow:</b>{" "}
                {tasks.map((t) => t.task).join(" → ")}
              </p>

              <p>
                <b>AI Action:</b> Email draft ready for approval
              </p>

              <p style={missingDeadline ? styles.warning : styles.success}>
                <b>Risk Alert:</b>{" "}
                {missingDeadline
                  ? "Deadline missing for one or more tasks ⚠️"
                  : "All deadlines detected ✅"}
              </p>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Generated Tasks</h2>

            {tasks.map((t, index) => (
              <div key={index} style={styles.taskBox}>
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
                  <b>Status:</b> {t.status}
                </p>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Workflow View</h2>

            <div style={styles.workflow}>
              {tasks.map((t, index) => (
                <span key={index} style={styles.workflowTask}>
                  {t.task}
                  {index < tasks.length - 1 && (
                    <span style={styles.arrow}> → </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Email Draft Preview</h2>

            <textarea style={styles.emailTextarea} value={emailDraft} readOnly />

            <div style={styles.buttonGroup}>
              <button
                style={styles.approveButton}
                onClick={() => setApproved(true)}
              >
                Approve
              </button>

              <button
                style={styles.undoButton}
                onClick={() => setEmailDraft("")}
              >
                Undo
              </button>
            </div>

            {approved && (
              <p style={styles.success}>✅ Email approved successfully</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1e1b4b 0%, #0f0f0f 45%, #050505 100%)",
    color: "white",
    padding: "60px 30px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    position: "relative",
    overflowX: "hidden",
  },

  heroGlow: {
    position: "absolute",
    top: "80px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "400px",
    height: "200px",
    background: "rgba(139, 92, 246, 0.25)",
    filter: "blur(90px)",
    zIndex: 0,
  },

  title: {
    fontSize: "64px",
    marginBottom: "12px",
    color: "#8b5cf6",
    textShadow: "0 0 30px rgba(139, 92, 246, 0.7)",
    position: "relative",
    zIndex: 1,
  },

  subtitle: {
    color: "#d1d5db",
    marginBottom: "55px",
    fontSize: "20px",
    position: "relative",
    zIndex: 1,
  },

  card: {
    background: "rgba(26, 26, 26, 0.85)",
    backdropFilter: "blur(12px)",
    padding: "35px",
    borderRadius: "24px",
    maxWidth: "900px",
    margin: "28px auto",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 35px rgba(139, 92, 246, 0.18)",
    position: "relative",
    zIndex: 1,
  },

  sectionTitle: {
    fontSize: "30px",
    marginBottom: "25px",
  },

  textarea: {
    width: "100%",
    height: "170px",
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "#0f0f0f",
    color: "white",
    border: "1px solid #444",
    fontSize: "16px",
    resize: "none",
    outline: "none",
  },

  button: {
    marginTop: "25px",
    padding: "14px 36px",
    borderRadius: "14px",
    background: "linear-gradient(90deg,#2563eb,#9333ea)",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "bold",
    boxShadow: "0 0 22px rgba(139,92,246,0.7)",
  },

  dashboard: {
    display: "flex",
    justifyContent: "center",
    gap: "22px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
  },

  smallCard: {
    background: "rgba(26, 26, 26, 0.9)",
    padding: "24px",
    borderRadius: "18px",
    width: "170px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 20px rgba(37, 99, 235, 0.18)",
  },

  taskBox: {
    backgroundColor: "#111",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "14px",
    textAlign: "left",
    border: "1px solid #333",
  },

  previewBox: {
    backgroundColor: "#111",
    padding: "22px",
    borderRadius: "14px",
    textAlign: "left",
    border: "1px solid #333",
    lineHeight: "1.8",
  },

  workflow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
  },

  workflowTask: {
    backgroundColor: "#111",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #333",
  },

  arrow: {
    color: "#8b5cf6",
    fontWeight: "bold",
  },

  emailTextarea: {
    width: "100%",
    height: "220px",
    padding: "18px",
    marginTop: "10px",
    backgroundColor: "#111",
    color: "white",
    borderRadius: "14px",
    border: "1px solid #444",
    resize: "none",
  },

  buttonGroup: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "center",
    gap: "14px",
  },

  approveButton: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  undoButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  success: {
    color: "#10b981",
    marginTop: "14px",
  },

  warning: {
    color: "#facc15",
  },

  error: {
    color: "#ff5c5c",
    marginTop: "14px",
  },
};

export default App;