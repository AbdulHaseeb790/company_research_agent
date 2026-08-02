from fastapi import FastAPI
from agent import research_company
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://company-research-agent-woad.vercel.app",
        "https://company-research-agent-plfc4tl8c-wedev-015c.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)



)
class ResearchRequest(BaseModel):
    company_name:str
class FollowupRequest(BaseModel):
    question:str
@app.post('/research')
async def do_research(research:ResearchRequest):
    return await research_company(research.company_name)
@app.post('/follow')
async def do_follow(follow:FollowupRequest):
    return await research_company(follow.question)
    



