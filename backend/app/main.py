from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import init_db
from app.routes import user_route, board_route, column_route, card_route
import os
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import status
from fastapi.requests import Request

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

if not os.path.exists("static"):
    os.makedirs("static", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.core_origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    errors = exc.errors()
    formatted_errors = []
    for error in errors:
        field = str(error["loc"][-1]) if len(error["loc"]) > 0 else "unknown"
        message = error["msg"]

        formatted_errors.append({
            "field": field,
            "message": message
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation error",
            "message": "Incorrect data was transmitted",
            "details": formatted_errors
        }
    )

app.include_router(user_route.router)
app.include_router(board_route.router)
app.include_router(column_route.router)
app.include_router(card_route.router)

@app.on_event("startup")
def startup_event():
    init_db()