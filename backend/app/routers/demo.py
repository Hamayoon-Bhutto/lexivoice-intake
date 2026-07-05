from typing import Optional
import unicodedata

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db import supabase


router = APIRouter()


class DemoCallRequest(BaseModel):
    transcript: str
    caller_phone: Optional[str] = None
    recording_url: Optional[str] = None


def normalize_text(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text.replace("’", "'"))
    return "".join(character for character in normalized if not unicodedata.combining(character)).lower()


def detect_case_type(transcript: str) -> str:
    normalized_transcript = normalize_text(transcript)

    if any(keyword in normalized_transcript for keyword in ["licenciement", "employeur", "travail", "salaire"]):
        return "droit_du_travail"

    if any(keyword in normalized_transcript for keyword in ["divorce", "garde", "enfant", "pension"]):
        return "droit_de_la_famille"

    if any(keyword in normalized_transcript for keyword in ["loyer", "bail", "proprietaire", "locataire"]):
        return "immobilier"

    return "general"


def detect_urgency(transcript: str) -> str:
    normalized_transcript = normalize_text(transcript)

    if any(keyword in normalized_transcript for keyword in ["urgent", "demain", "aujourd'hui", "audience", "expulsion", "delai"]):
        return "high"

    return "normal"


def get_required_documents(case_type: str) -> list[str]:
    if case_type == "droit_du_travail":
        return [
            "Contrat de travail",
            "Bulletins de salaire",
            "Courriers avec l’employeur",
            "Lettre de licenciement",
            "Preuves ou captures d’écran",
        ]

    if case_type == "droit_de_la_famille":
        return [
            "Pièce d’identité",
            "Livret de famille",
            "Jugement précédent",
            "Justificatifs de revenus",
            "Échanges pertinents",
        ]

    if case_type == "immobilier":
        return [
            "Contrat de bail",
            "État des lieux",
            "Courriers avec le propriétaire ou locataire",
            "Photos ou preuves",
            "Quittances de loyer",
        ]

    return [
        "Pièce d’identité",
        "Tout document lié au dossier",
        "Échanges écrits pertinents",
        "Chronologie des faits",
    ]


def build_summary(case_type: str, urgency: str) -> str:
    return (
        f"Résumé automatique: le prospect a contacté le cabinet concernant {case_type}. "
        f"Niveau d’urgence: {urgency}. Objectif et contexte extraits du transcript."
    )


@router.post("/simulate-call")
def simulate_call(call_request: DemoCallRequest):
    try:
        case_type = detect_case_type(call_request.transcript)
        urgency = detect_urgency(call_request.transcript)
        required_documents = get_required_documents(case_type)
        summary = build_summary(case_type, urgency)
        lead_status = "urgent" if urgency == "high" else "to_qualify"

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

        lead_response = supabase.table("leads").insert(lead_payload).execute()

        if not lead_response.data:
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

        supabase.table("calls").insert(call_payload).execute()

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
            supabase.table("documents").insert(document_rows).execute()

        return {
            "message": "Demo call simulated successfully",
            "lead": lead,
            "call_summary": summary,
            "required_documents": required_documents,
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))