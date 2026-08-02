from fastmcp import FastMCP
from tavily import TavilyClient
from dotenv import load_dotenv
import os
load_dotenv(dotenv_path=r'D:\proposal_agent\company_research_agent\.env')
mcp=FastMCP("company-research-server")
@mcp.tool()
def search_web(query:str)->str:
    """search the web for information about the company"""
    client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    result=client.search(query, max_results=1)
    output = ""
    for r in result["results"]:
        output += f"Title: {r['title']}\nURL: {r['url']}\nContent: {r['content']}\n\n"
    return output
if __name__=='__main__':
    mcp.run()