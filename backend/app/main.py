from fastapi import FastAPI
from app.db import supabase
from app.routers import leads
from app.routers import demo

app = FastAPI(title="LexiVoice Intake API")

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
    response = supabase.table("leads").select("*").limit(5).execute()

    return {
        "message": "Supabase connected successfully",
        "data": response.data
    }
