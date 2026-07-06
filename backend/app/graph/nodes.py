from typing import Dict, Any
import unicodedata


def _normalize(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text.replace("’", "'")).lower()
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def detect_case_type(state: Dict[str, Any]) -> Dict[str, Any]:
    transcript = state.get("transcript", "") or ""
    t = _normalize(transcript)

    if any(keyword in t for keyword in ["licenciement", "employeur", "travail", "salaire"]):
        return {"case_type": "droit_du_travail"}

    if any(keyword in t for keyword in ["divorce", "garde", "enfant", "pension"]):
        return {"case_type": "droit_de_la_famille"}

    if any(keyword in t for keyword in ["loyer", "bail", "proprietaire", "locataire"]):
        return {"case_type": "immobilier"}

    return {"case_type": "general"}


def detect_urgency(state: Dict[str, Any]) -> Dict[str, Any]:
    transcript = state.get("transcript", "") or ""
    t = _normalize(transcript)

    if any(keyword in t for keyword in ["urgent", "demain", "aujourd'hui", "audience", "expulsion", "delai"]):
        return {"urgency": "high"}

    return {"urgency": "normal"}


def generate_documents(state: Dict[str, Any]) -> Dict[str, Any]:
    case_type = state.get("case_type", "general")

    if case_type == "droit_du_travail":
        docs = [
            "Contrat de travail",
            "Bulletins de salaire",
            "Courriers avec l’employeur",
            "Lettre de licenciement",
            "Preuves ou captures d’écran",
        ]
        return {"required_documents": docs}

    if case_type == "droit_de_la_famille":
        docs = [
            "Pièce d’identité",
            "Livret de famille",
            "Jugement précédent",
            "Justificatifs de revenus",
            "Échanges pertinents",
        ]
        return {"required_documents": docs}

    if case_type == "immobilier":
        docs = [
            "Contrat de bail",
            "État des lieux",
            "Courriers avec le propriétaire ou locataire",
            "Photos ou preuves",
            "Quittances de loyer",
        ]
        return {"required_documents": docs}

    docs = [
        "Pièce d’identité",
        "Tout document lié au dossier",
        "Échanges écrits pertinents",
        "Chronologie des faits",
    ]
    return {"required_documents": docs}


def generate_summary(state: Dict[str, Any]) -> Dict[str, Any]:
    case_type = state.get("case_type", "general")
    urgency = state.get("urgency", "normal")
    summary = (
        f"Résumé automatique: le prospect a contacté le cabinet concernant {case_type}. "
        f"Niveau d’urgence: {urgency}. Le contexte sera vérifié par l’équipe juridique avant la consultation."
    )
    return {"summary": summary}


def assign_status(state: Dict[str, Any]) -> Dict[str, Any]:
    urgency = state.get("urgency", "normal")
    status = "urgent" if urgency == "high" else "to_qualify"
    return {"status": status}
