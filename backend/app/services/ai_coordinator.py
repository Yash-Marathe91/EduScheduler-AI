import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv() # Force reload environment variables

from langgraph.prebuilt import create_react_agent
from app.services.tools import ALL_TOOLS

# Helper to get the LLM with Fallbacks
def get_llm():
    llms = []
    if os.getenv("GEMINI_API_KEY"):
        llms.append(ChatGoogleGenerativeAI(model="gemini-3.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"), max_retries=1))
    if os.getenv("OPENAI_API_KEY"):
        llms.append(ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"), max_retries=1))
        
    if not llms:
        raise ValueError("No AI API Key found in environment variables.")
        
    if len(llms) > 1:
        # If both keys are present, use Gemini as primary and OpenAI as fallback
        return llms[0].with_fallbacks([llms[1]])
    
    return llms[0]

# Build the ReAct Agent Graph
def build_coordinator_graph():
    llm = get_llm()
    system_prompt = '''You are the Academic Coordinator AI for EduScheduler. 
You orchestrate the entire campus operations.
You have access to tools that query the live database to check faculty availability and information.

**Substitute Allocation Workflow:**
If a user asks to mark a faculty member absent:
1. Use `mark_faculty_absent` to record the absence and get the list of their classes that need substitutes.
2. For each class that needs a substitute, use `get_free_faculty` for that day and period.
3. Pick a suitable free faculty member and use `assign_substitute` to assign them.
4. Provide a final summary of all the substitutes assigned.

Always try to answer questions accurately using the tools provided.
When dealing with days of the week, assume 1=Monday, 2=Tuesday, etc.'''
    
    # create_react_agent handles the state, tool execution, and loops for us!
    try:
        return create_react_agent(llm, tools=ALL_TOOLS, prompt=system_prompt)
    except TypeError:
        # Fallback for older versions of langgraph
        return create_react_agent(llm, tools=ALL_TOOLS, state_modifier=system_prompt)

# Singleton instance
coordinator_app = build_coordinator_graph()

async def process_chat_message(user_message: str) -> str:
    """Entry point for the FastAPI route"""
    initial_state = {"messages": [HumanMessage(content=user_message)]}
    
    try:
        result = await coordinator_app.ainvoke(initial_state)
        
        # Extract the last AI message
        for msg in reversed(result["messages"]):
            if isinstance(msg, AIMessage) and msg.content:
                return msg.content
                
        return "I couldn't process that request."
    except Exception as e:
        import traceback
        error_msg = str(e).lower()
        if any(keyword in error_msg for keyword in ["429", "quota", "rate limit", "exhausted", "503", "unavailable", "high demand"]):
            return "⚠️ **System Notice:** I'm currently experiencing exceptionally high traffic and my AI quotas have been temporarily exhausted. Please try your request again in a few minutes."
        
        return f"⚠️ **System Error:** I encountered an unexpected error while processing your request. Please ensure the backend is properly configured. ({repr(e)})\n\nTraceback: {traceback.format_exc()}"
