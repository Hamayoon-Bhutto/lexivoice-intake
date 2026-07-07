from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import supabase
from app.routers import leads
from app.routers import demo

app = FastAPI(title="LexiVoice Intake API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads.router, prefix="/leads", tags=["Leads"])
app.include_router(demo.router, prefix="/demo", tags=["Demo"])


@app.get("/")
def home():
    return {
        "message": "LexiVoice Intake backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/test-db")
def test_db():
    try:
        response = supabase.table("leads").select("*").limit(5).execute()

        return {
            "message": "Supabase connected successfully",
            "data": response.data,
        }

    except Exception as e:
        return {
            "message": "Supabase connection failed",
            "error": str(e),
            "hint": "Check backend/.env. SUPABASE_URL must look like https://project-id.supabase.co and should not include /rest/v1/. Use sb_publishable key, not sb_secret.",
        }
