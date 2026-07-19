from typing import Annotated
from fastapi import Depends
from app.core.security import verify_token

# Dependency to get current authenticated user
CurrentUser = Annotated[dict, Depends(verify_token)]
