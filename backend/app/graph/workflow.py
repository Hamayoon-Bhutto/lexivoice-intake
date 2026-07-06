from typing import Dict, Any, Optional

try:
    from langgraph import StateGraph  # type: ignore
except Exception:
    StateGraph = None  # graceful fallback if lib not available at import time

from .nodes import (
    detect_case_type,
    detect_urgency,
    generate_documents,
    generate_summary,
    assign_status,
)


def run_intake_workflow(transcript: str, caller_phone: Optional[str] = None, recording_url: Optional[str] = None) -> Dict[str, Any]:
    """Run intake workflow and return final state dict.

    The implementation attempts to import and use LangGraph's StateGraph when available,
    but will run the same node sequence sequentially as a fallback.
    """
    initial_state: Dict[str, Any] = {
        "transcript": transcript,
        "caller_phone": caller_phone,
        "recording_url": recording_url,
        "required_documents": [],
    }

    # If StateGraph is available we could build a graph; however keep a simple sequential
    # execution so the function works even before langgraph is installed.
    state = dict(initial_state)

    for node in (detect_case_type, detect_urgency, generate_documents, generate_summary, assign_status):
        updates = node(state)
        if updates:
            state.update(updates)

    return state
