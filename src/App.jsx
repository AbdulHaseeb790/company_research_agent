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
      const response = await fetch("http://localhost:8000/research", {
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
      const response = await fetch("http://localhost:8000/followup", {
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
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">

      <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
        Company Research Agent
      </h1>

      <div className="flex gap-3 max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Enter company name..."
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleResearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center text-blue-400 animate-pulse">Researching... please wait</p>}
      {error && <p className="text-center text-red-400 mt-4">{error}</p>}

      {report && (
        <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-8 prose prose-invert prose-table:text-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ br: () => <br /> }}
          >
            {report}
          </ReactMarkdown>
        </div>
      )}

      {report && (
        <div className="flex gap-3 max-w-2xl mx-auto mt-6">
          <input
            type="text"
            placeholder="Ask a follow-up question..."
            value={followup}
            onChange={(e) => setFollowup(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleFollowup}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Ask
          </button>
        </div>
      )}

    </div>
  )
}

export default App