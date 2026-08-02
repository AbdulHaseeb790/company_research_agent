import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function App() {
  const [companyName, setCompanyName] = useState("")
  const [report, setReport] = useState("")
  const [followup, setFollowup] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleResearch() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("https://companyresearchagent-production.up.railway.app/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: companyName })
      })
      if (!response.ok) throw new Error("Server error: " + response.status)
      const data = await response.json()
      if (!data) throw new Error("No response from agent")
      setReport(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleFollowup() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("https://companyresearchagent-production.up.railway.app/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "About " + companyName + ": " + followup })
      })
      if (!response.ok) throw new Error("Server error: " + response.status)
      const data = await response.json()
      if (!data) throw new Error("No response from agent")
      setReport(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#f3f4f6", padding: "32px", fontFamily: "sans-serif" }}>
      
      <h1 style={{ textAlign: "center", color: "#60a5fa", fontSize: "2rem", fontWeight: "bold", marginBottom: "32px" }}>
        Company Research Agent
      </h1>

      <div style={{ display: "flex", gap: "12px", maxWidth: "640px", margin: "0 auto 32px" }}>
        <input
          type="text"
          placeholder="Enter company name..."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          style={{ flex: 1, background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", padding: "8px 16px", color: "#f3f4f6", fontSize: "1rem" }}
        />
        <button
          onClick={handleResearch}
          style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "8px 24px", cursor: "pointer", fontSize: "1rem" }}
        >
          Search
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#60a5fa" }}>Researching... please wait</p>}
      {error && <p style={{ textAlign: "center", color: "#f87171" }}>{error}</p>}

      {report && (
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "32px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ br: () => <br /> }}>
            {report}
          </ReactMarkdown>
        </div>
      )}

      {report && (
        <div style={{ display: "flex", gap: "12px", maxWidth: "640px", margin: "24px auto 0" }}>
          <input
            type="text"
            placeholder="Ask a follow-up question..."
            value={followup}
            onChange={(e) => setFollowup(e.target.value)}
            style={{ flex: 1, background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", padding: "8px 16px", color: "#f3f4f6", fontSize: "1rem" }}
          />
          <button
            onClick={handleFollowup}
            style={{ background: "#374151", color: "white", border: "none", borderRadius: "8px", padding: "8px 24px", cursor: "pointer", fontSize: "1rem" }}
          >
            Ask
          </button>
        </div>
      )}

    </div>
  )
}

export default App
