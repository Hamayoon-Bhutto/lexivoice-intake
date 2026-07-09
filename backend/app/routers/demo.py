from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db import supabase, supabase_admin
from app.graph.workflow import run_intake_workflow


router = APIRouter()


class DemoCallRequest(BaseModel):
    transcript: str
    caller_phone: Optional[str] = None
    recording_url: Optional[str] = None


@router.post("/simulate-call")
def simulate_call(call_request: DemoCallRequest):
    try:
        # Run the LangGraph intake workflow (fallback sequential implementation if lib not present)
        workflow_result = run_intake_workflow(
            call_request.transcript, call_request.caller_phone, call_request.recording_url
        )

        case_type = workflow_result.get("case_type")
        urgency = workflow_result.get("urgency")
        required_documents = workflow_result.get("required_documents", [])
        summary = workflow_result.get("summary")
        lead_status = "urgent" if workflow_result.get("status") == "urgent" else "to_qualify"

        lead_payload = {
            "full_name": "Demo Caller",
            "phone": call_request.caller_phone,
            "email": None,
            "case_type": case_type,
            "urgency": urgency,
            "location": None,
            "objective": "À qualifier à partir de l’appel",
            "status": lead_status,
            "origin_channel": "demo_call",
        }

        lead_response = supabase_admin.table("leads").insert(lead_payload).execute()

        if not getattr(lead_response, "data", None):
            raise HTTPException(status_code=500, detail="Lead creation failed")

        lead = lead_response.data[0]
        lead_id = lead.get("id")

        if not lead_id:
            raise HTTPException(status_code=500, detail="Lead ID missing after insert")

        call_payload = {
            "lead_id": lead_id,
            "call_id": "demo-call",
            "transcript": call_request.transcript,
            "summary": summary,
            "recording_url": call_request.recording_url,
        }

        supabase_admin.table("calls").insert(call_payload).execute()

        document_rows = [
            {
                "lead_id": lead_id,
                "document_name": document_name,
                "required": True,
                "received": False,
            }
            for document_name in required_documents
        ]

        if document_rows:
            supabase_admin.table("documents").insert(document_rows).execute()

        return {
            "message": "Demo call simulated successfully",
            "lead": lead,
            "call_summary": summary,
            "required_documents": required_documents,
            "workflow_result": workflow_result,
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))