from pathlib import Path
import os
from dotenv import load_dotenv
from supabase import create_client, Client

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"

# Load environment specifically from backend/.env
load_dotenv(dotenv_path=ENV_PATH)

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "").strip()
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()

# Remove accidental REST API path if included
if SUPABASE_URL.endswith("/rest/v1/"):
    SUPABASE_URL = SUPABASE_URL.replace("/rest/v1/", "")

if SUPABASE_URL.endswith("/rest/v1"):
    SUPABASE_URL = SUPABASE_URL.replace("/rest/v1", "")

# Strip any trailing slash
SUPABASE_URL = SUPABASE_URL.rstrip("/")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from backend/.env")

if not SUPABASE_URL.startswith("https://"):
    raise ValueError("SUPABASE_URL must start with https://")

if not SUPABASE_URL.endswith(".supabase.co"):
    raise ValueError(
        "SUPABASE_URL must be the base Supabase project URL like https://project-id.supabase.co. Do not include /rest/v1/"
    )

if not SUPABASE_ANON_KEY:
    raise ValueError("SUPABASE_ANON_KEY is missing from backend/.env")

print(f"Loaded Supabase URL: {SUPABASE_URL}")
print(f"Loaded Supabase key prefix: {SUPABASE_ANON_KEY[:15]}...")

# Use service role key for admin operations (bypasses RLS), fallback to anon key
admin_key = SUPABASE_SERVICE_ROLE_KEY if SUPABASE_SERVICE_ROLE_KEY else SUPABASE_ANON_KEY
print(f"Using {'service role' if SUPABASE_SERVICE_ROLE_KEY else 'anon'} key for admin operations")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
supabase_admin: Client = create_client(SUPABASE_URL, admin_key)
