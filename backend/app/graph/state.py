from typing import TypedDict, Optional, List


class IntakeState(TypedDict, total=False):
    transcript: str
    caller_phone: Optional[str]
    recording_url: Optional[str]
    case_type: Optional[str]
    urgency: Optional[str]
    required_documents: List[str]
    summary: Optional[str]
    status: Optional[str]
