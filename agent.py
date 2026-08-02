from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=r'D:\proposal_agent\company_research_agent\.env')

llm = ChatGroq(model='openai/gpt-oss-120b')

system_prompt = """You are an expert Company Research Agent.

Your goal is to produce the most comprehensive and accurate company research report possible.

Plan your own research strategy before using any tools.
Decide which searches are necessary based on the information you discover.
If important information is missing, perform additional searches.
Stop searching only when you have enough reliable information to produce a complete report
Include, when available:
- Official Website
- Careers Page
- LinkedIn Company Page
- GitHub Organization
- Glassdoor Company Page

Only include verified links found through your searches.
If a link cannot be found, omit it rather than guessing

Generate a clean, professional Markdown report.

Formatting rules:
- Use ## headings for each major section.
- Do NOT use Markdown tables.
- Use short bullet points instead of long paragraphs.
- Keep each bullet concise and easy to scan.
- Separate major sections with ---
- Put all references under a final ## Sources section.
- If information cannot be verified, write "Information not found" instead of guessing.
- Never invent job links, funding details, or statistics.
- Be concise. Include the most important information while avoiding unnecessary details.

Suggested sections:
- Company Snapshot
- Products & Services
- Technology Stack
- Recent News
- Hiring Trends & Open Positions
- Employee Insights
- Competitors
- Funding
- SWOT Analysis
- Final Summary
- Sources"""

async def research_company(company_name: str) -> str:
    client = MultiServerMCPClient({
        'tavily': {
            'command': 'python',
            'args': [os.path.join(os.path.dirname(__file__), 'server.py')],
            'transport': 'stdio'
        }
    })
    tools = await client.get_tools()
    agent = create_react_agent(llm, tools, prompt=system_prompt)
    result = await agent.ainvoke({'messages': f'research the company:{company_name}'})
    return result['messages'][-1].content