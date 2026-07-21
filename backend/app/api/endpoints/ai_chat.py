from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import verify_token
from app.services.ai_coordinator import process_chat_message

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("", response_model=ChatResponse)
async def chat_with_coordinator(
    request: ChatRequest,
    user: dict = Depends(verify_token)
):
    try:
        reply = await process_chat_message(request.message)
        return {"reply": reply}
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
