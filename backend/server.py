from fastapi import FastAPI, APIRouter, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import random
import string


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class WaitlistEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str
    email: str = ""
    referral_code: str
    position: int
    full_phone_number: str
    country_code: str = ""
    ip_address: str = ""
    user_agent: str = ""
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class WaitlistEntryCreate(BaseModel):
    phone: str
    email: str = ""
    full_phone_number: str
    country_code: str = ""
    ip_address: str = ""
    user_agent: str = ""

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

def generate_referral_code():
    """Generate a unique 6-character referral code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def generate_user_position():
    """Generate a user position based on current waitlist count + some randomness"""
    base_number = 2518
    now = datetime.utcnow()
    start_of_day = datetime(now.year, now.month, now.day)
    seconds_since_midnight = int((now - start_of_day).total_seconds())
    position = base_number + (seconds_since_midnight // 10)
    return position

@api_router.post("/waitlist", response_model=WaitlistEntry)
async def create_waitlist_entry(input: WaitlistEntryCreate, request: Request):
    """Create a new waitlist entry with phone number capture"""
    # Generate referral code and position
    referral_code = generate_referral_code()
    position = generate_user_position()
    
    # Get client IP
    client_ip = request.client.host if request.client else "unknown"
    
    # Get user agent
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Create waitlist entry
    waitlist_data = input.dict()
    waitlist_data.update({
        "referral_code": referral_code,
        "position": position,
        "ip_address": client_ip,
        "user_agent": user_agent
    })
    
    waitlist_obj = WaitlistEntry(**waitlist_data)
    
    # Save to database
    await db.waitlist_entries.insert_one(waitlist_obj.dict())
    
    return waitlist_obj

@api_router.get("/waitlist", response_model=List[WaitlistEntry])
async def get_waitlist_entries():
    """Get all waitlist entries - for admin purposes"""
    entries = await db.waitlist_entries.find().sort("timestamp", -1).to_list(1000)
    return [WaitlistEntry(**entry) for entry in entries]

@api_router.get("/waitlist/count")
async def get_waitlist_count():
    """Get total count of waitlist entries"""
    count = await db.waitlist_entries.count_documents({})
    return {"count": count}

@api_router.get("/waitlist/export")
async def export_waitlist_entries():
    """Export all waitlist entries for download"""
    entries = await db.waitlist_entries.find().sort("timestamp", -1).to_list(10000)
    
    # Format for export
    export_data = []
    for entry in entries:
        export_data.append({
            "id": entry.get("id"),
            "phone": entry.get("phone"),
            "full_phone_number": entry.get("full_phone_number"),
            "email": entry.get("email"),
            "country_code": entry.get("country_code"),
            "referral_code": entry.get("referral_code"),
            "position": entry.get("position"),
            "ip_address": entry.get("ip_address"),
            "user_agent": entry.get("user_agent"),
            "timestamp": entry.get("timestamp").isoformat() if entry.get("timestamp") else ""
        })
    
    return {
        "total_entries": len(export_data),
        "entries": export_data
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
