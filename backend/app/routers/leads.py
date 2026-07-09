from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import supabase, supabase_admin

router = APIRouter()


class LeadCreate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    case_type: Optional[str] = None
    urgency: Optional[str] = None
    location: Optional[str] = None
    objective: Optional[str] = None
    status: Optional[str] = "new"
    origin_channel: Optional[str] = "demo"


@router.post("/")
def create_lead(lead: LeadCreate):
    try:
        # Use admin client to bypass RLS policies
        response = supabase_admin.table("leads").insert(lead.model_dump()).execute()

        return {
            "message": "Lead created successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def get_leads():
    try:
        response = (
            supabase
            .table("leads")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "message": "Leads fetched successfully",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
