from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from database import engine, Base, get_db
from models import User
from contextlib import asynccontextmanager
import os
import hashlib
import hmac
from urllib.parse import parse_qs
from sqlalchemy import select
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="TssVPN API", lifespan=lifespan)

# CORS Configuration
origins = ["*"]  # For development; restrict in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    id: int
    username: str
    balance: float
    status: str
    keys_count: int
    is_admin: bool
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None

class VPNPlan(BaseModel):
    id: str
    name: str
    duration_days: int
    price: float
    description: str

class PurchaseRequest(BaseModel):
    plan_id: str

class VPNKey(BaseModel):
    id: str
    name: str
    status: str
    expires_at: str

class SiteConfigUpdate(BaseModel):
    bot_welcome_message: Optional[str] = None
    site_title: Optional[str] = None
    site_announcement: Optional[str] = None
    support_link: Optional[str] = None

class AdminStats(BaseModel):
    total_users: int
    active_subscriptions: int
    total_revenue: float

class UserUpdate(BaseModel):
    balance: Optional[float] = None
    is_admin: Optional[bool] = None
    is_banned: Optional[bool] = None

@app.get("/")
async def root():
    return {"message": "TssVPN Backend is running", "style": "Soviet"}

# --- AUTH IMPLEMENTATION ---
@app.post("/auth/register", response_model=Token)
async def register_new(user: UserRegister, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    stmt = select(User).where((User.username == user.username) | (User.email == user.email))
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this username or email already exists")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        tg_id=None,  # Will be filled when user connects Telegram account
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        created_at=datetime.utcnow()
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    # Generate JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.username), "type": "web"},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
async def login_new(user: UserLogin, db: AsyncSession = Depends(get_db)):
    # Find user by username
    stmt = select(User).where(User.username == user.username)
    result = await db.execute(stmt)
    db_user = result.scalar_one_or_none()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    db_user.last_login = datetime.utcnow()
    await db.commit()
    
    # Generate JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.username), "type": "web"},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# --- USER STUBS ---
oauth2_scheme = HTTPBearer()

def get_current_user_from_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    try:
        user_id_int = int(user_id)
    except ValueError:
        # If user_id is username (from web login), we might need to look it up 
        # But based on current logic, most are tg_id
        return user_id
    
    return user_id_int

async def get_current_admin(current_user_id = Depends(get_current_user_from_token), db: AsyncSession = Depends(get_db)):
    if isinstance(current_user_id, int):
        stmt = select(User).where(User.tg_id == current_user_id)
    else:
        stmt = select(User).where(User.username == current_user_id)
        
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# --- ADMIN ENDPOINTS ---
from sqlalchemy import func

@app.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user_count_stmt = select(func.count(User.tg_id))
    user_count = (await db.execute(user_count_stmt)).scalar()
    
    active_subs_stmt = select(func.count(Subscription.id)).where(Subscription.expiry_date > datetime.utcnow())
    active_subs = (await db.execute(active_subs_stmt)).scalar()
    
    revenue_stmt = select(func.sum(Transaction.amount)).where(Transaction.status == "Completed")
    revenue = (await db.execute(revenue_stmt)).scalar() or 0.0
    
    return AdminStats(
        total_users=user_count,
        active_subscriptions=active_subs,
        total_revenue=revenue
    )

@app.get("/admin/users", response_model=List[UserProfile])
async def get_admin_users(admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    stmt = select(User).order_by(User.created_at.desc())
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    profiles = []
    for user in users:
        profiles.append(UserProfile(
            id=user.tg_id or 0,
            username=user.username or f"user_{user.tg_id}",
            balance=user.balance,
            status="Active" if user.tg_id else "Inactive", # Simplified
            keys_count=0, # Simplified for list
            is_admin=user.is_admin,
            first_name=user.first_name,
            last_name=user.last_name,
            avatar_url=user.avatar_url,
            created_at=user.created_at.isoformat() if user.created_at else None
        ))
    return profiles

@app.get("/admin/config")
async def get_site_config(admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    stmt = select(SiteConfig).limit(1)
    result = await db.execute(stmt)
    config = result.scalar_one_or_none()
    
    if not config:
        config = SiteConfig()
        db.add(config)
        await db.commit()
        await db.refresh(config)
    
    return config

@app.post("/admin/config")
async def update_site_config(update: SiteConfigUpdate, admin: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    stmt = select(SiteConfig).limit(1)
    result = await db.execute(stmt)
    config = result.scalar_one_or_none()
    
    if not config:
        config = SiteConfig()
        db.add(config)
    
    if update.bot_welcome_message is not None:
        config.bot_welcome_message = update.bot_welcome_message
    if update.site_title is not None:
        config.site_title = update.site_title
    if update.site_announcement is not None:
        config.site_announcement = update.site_announcement
    if update.support_link is not None:
        config.support_link = update.support_link
        
    await db.commit()
    return {"message": "Config updated"}

@app.get("/users/me", response_model=UserProfile)
async def get_current_user(current_user_id: int = Depends(get_current_user_from_token), db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.tg_id == current_user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate subscription status and count
    import datetime
    now = datetime.datetime.now()
    sub_stmt = select(Subscription).where(Subscription.user_id == user.tg_id).order_by(Subscription.expiry_date.desc())
    sub_result = await db.execute(sub_stmt)
    latest_subscription = sub_result.scalar_one_or_none()
    
    status = "Inactive"
    keys_count = 0
    if latest_subscription and latest_subscription.expiry_date > now:
        keys_count = 1  # Assume 1 key per active subscription
        status = "Active"
    
    return UserProfile(
        id=user.tg_id,
        username=user.username or f"user_{user.tg_id}",
        balance=user.balance,
        status=status,
        keys_count=keys_count,
        is_admin=user.is_admin,
        first_name=user.first_name,
        last_name=user.last_name,
        avatar_url=user.avatar_url,
        created_at=user.created_at.isoformat() if user.created_at else None
    )

@app.get("/users/keys", response_model=List[VPNKey])
async def get_my_keys(current_user_id: int = Depends(get_current_user_from_token), db: AsyncSession = Depends(get_db)):
    # Fetch real subscriptions
    stmt = select(Subscription).where(Subscription.user_id == current_user_id).order_by(Subscription.expiry_date.desc())
    result = await db.execute(stmt)
    subscriptions = result.scalars().all()
    
    keys = []
    now = datetime.now()
    
    for sub in subscriptions:
        status_str = "Expired"
        if sub.expiry_date > now:
            status_str = "Active"
            
        keys.append(VPNKey(
            id=str(sub.id),
            name=sub.tariff_name,
            status=status_str,
            expires_at=sub.expiry_date.strftime("%Y-%m-%d")
        ))
        
    return keys

# --- SHOP STUBS ---
@app.get("/shop/plans", response_model=List[VPNPlan])
async def get_plans():
    return [
        VPNPlan(id="plan_1m", name="1 Month Pass", duration_days=30, price=100.0, description="Basic access for 30 days."),
        VPNPlan(id="plan_3m", name="3 Months Pass", duration_days=90, price=250.0, description="Standard access for 90 days. Save 16%."),
        VPNPlan(id="plan_1y", name="1 Year Pass", duration_days=365, price=900.0, description="Premium access for 365 days. Best value.")
    ]

@app.post("/shop/buy")
async def buy_plan(purchase: PurchaseRequest):
    # Mock purchase
    if purchase.plan_id == "error":
        raise HTTPException(status_code=400, detail="Purchase failed. Insufficient funds.")
    return {"message": f"Successfully purchased plan {purchase.plan_id}. Key issued."}


# --- TELEGRAM LOGIN ---
import hashlib
import hmac
import time
from urllib.parse import parse_qs

def verify_telegram_login(auth_data: dict, bot_token: str) -> bool:
    """
    Verifies the authenticity of the Telegram Login data.
    See: https://core.telegram.org/widgets/login#checking-authorization
    According to spec, we must include ALL parameters that are present in the login, 
    even those with empty values, except for 'hash'.
    """
    received_hash = auth_data.get('hash', '')
    if not received_hash:
        print("No hash in auth_data")
        return False

    # Create a copy to avoid modifying original
    auth_data_copy = auth_data.copy()
    # Remove hash from the copy for verification
    auth_data_copy.pop('hash', None)
    
    # Print for debugging
    print(f"Received auth_data: {auth_data}")
    print(f"Received hash: {received_hash}")
    
    # Sort the parameters alphabetically by key
    sorted_items = sorted(auth_data_copy.items())
    # Remove photo_url from data if it's an empty string. Telegram omits fields with empty values in the signature string.
    if 'photo_url' in auth_data_copy and not auth_data_copy['photo_url']:
        auth_data_copy.pop('photo_url')
    
    # Sort the parameters alphabetically by key
    sorted_items = sorted(auth_data_copy.items())
    # Join them with newline character as per Telegram Login specification
    # NOT with & as commonly mistaken
    data_check_string = '\n'.join([f'{k}={v}' for k, v in sorted_items])
    
    print(f"Data check string: {data_check_string}")

    # For Telegram Login Widget, create secret key using SHA256 of the bot token
    # according to original Telegram Login specification
    secret_key = hashlib.sha256(bot_token.encode()).digest()

    # Create HMAC-SHA256 signature of the data_check_string using the secret_key
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    print(f"Calculated hash: {calculated_hash}")
    print(f"Received hash: {received_hash}")

    # Compare the received hash with the calculated hash
    result = hmac.compare_digest(calculated_hash, received_hash)
    print(f"Verification result: {result}")
    
    return result


@app.post("/auth/telegram/callback")
async def telegram_auth_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Handles the Telegram Login callback.
    Expects form data from Telegram Login Widget.
    """
    # Get raw body to parse manually, as FastAPI's Request.form() might consume it once
    body_bytes = await request.body()
    body_str = body_bytes.decode()
    print(f"Raw request body: {body_str}")
    # Parse with keep_blank_values=True to preserve empty parameters like photo_url=
    parsed_data = parse_qs(body_str, keep_blank_values=True)
    print(f"Parsed data: {parsed_data}")

    # parse_qs returns values as lists, get the first item
    auth_data = {k: v[0] for k, v in parsed_data.items()}
    print(f"Final auth_data: {auth_data}")

    # Verify the login data
    bot_token = os.getenv("BOT_TOKEN") # Use the BOT_TOKEN from env
    if not bot_token:
        raise HTTPException(status_code=500, detail="Bot token not configured on server side.")

    if not verify_telegram_login(auth_data.copy(), bot_token): # Pass a copy to avoid modifying original
        raise HTTPException(status_code=400, detail="Invalid Telegram login data.")

    # Extract user info
    user_id = int(auth_data['id'])
    first_name = auth_data.get('first_name', '')
    last_name = auth_data.get('last_name', '')
    username = auth_data.get('username', '')
    photo_url = auth_data.get('photo_url', '')

    # Check if user exists in DB
    stmt = select(User).where(User.tg_id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        # Create user if doesn't exist
        user = User(
            tg_id=user_id,
            username=username,
            first_name=first_name,
            last_name=last_name,
            avatar_url=photo_url,
            created_at=datetime.utcnow()
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # Update user data if changed
        updated = False
        if user.first_name != first_name:
            user.first_name = first_name
            updated = True
        if user.last_name != last_name:
            user.last_name = last_name
            updated = True
        if user.username != username:
            user.username = username
            updated = True
        if user.avatar_url != photo_url:
            user.avatar_url = photo_url
            updated = True
        
        if updated:
            await db.commit()
            await db.refresh(user)

    # Generate JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.tg_id), "type": "telegram"},
        expires_delta=access_token_expires
    )

    return {
        "ok": True,
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.tg_id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "avatar_url": user.avatar_url,
            "balance": user.balance,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }


# --- COMPATIBILITY ENDPOINTS FOR OLD BOT (tssvpn-project/bot.py) ---
from sqlalchemy import select

@app.get("/users/check/{user_id}")
async def check_user_compatibility(user_id: int, db: AsyncSession = Depends(get_db)):
    """Check if user exists in DB."""
    stmt = select(User).where(User.tg_id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user:
        return {"exists": True, "tg_id": user.tg_id, "username": user.username}
    else:
        # Optionally create user here if needed upon first contact
        # For now, just return False
        return {"exists": False}


@app.get("/users/profile/{user_id}")
async def get_profile_compatibility(user_id: int, db: AsyncSession = Depends(get_db)):
    """Get user profile for old bot."""
    stmt = select(User).where(User.tg_id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate subscription expiry from Subscriptions table if exists
    # For now, mock values or get from related Subscription
    expiry_date = "No subscription"
    keys_count = 0
    status = "Inactive" # or Active if subscription is active

    # Get active subscription if any
    # Assuming latest non-expired sub is the active one
    import datetime
    now = datetime.datetime.now()
    sub_stmt = select(Subscription).where(Subscription.user_id == user_id).order_by(Subscription.expiry_date.desc())
    sub_result = await db.execute(sub_stmt)
    latest_subscription = sub_result.scalar_one_or_none()
    if latest_subscription and latest_subscription.expiry_date > now:
        expiry_date = latest_subscription.expiry_date.isoformat()
        keys_count = 1 # Assume 1 key per active sub for old bot logic
        status = "Active"

    profile_data = {
        "balance": user.balance,
        "status": status,
        "subscription_expiry": expiry_date,
        "keys_count": keys_count
    }
    return profile_data


@app.post("/shop/buy")
async def buy_plan_compatibility(tg_id: int, plan_id: str, db: AsyncSession = Depends(get_db)):
    """Handle purchase from old bot. Creates a subscription entry."""
    # Find the plan (this is mock, we can fetch from a static list or DB)
    # For compatibility, map plan_id to duration and price
    plan_mapping = {
        "plan_1m": {"duration_days": 30, "price": 100.0},
        "plan_3m": {"duration_days": 90, "price": 250.0},
        "plan_1y": {"duration_days": 365, "price": 900.0},
        "plan_12m": {"duration_days": 365, "price": 2490.0}, # Added for compatibility with tssvpn_bot
        # Add others if needed
    }
    plan_details = plan_mapping.get(plan_id)
    if not plan_details:
        raise HTTPException(status_code=400, detail="Plan not found")

    # Check if user exists, if not, create
    stmt = select(User).where(User.tg_id == tg_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        # Create user if doesn't exist
        user = User(tg_id=tg_id, username=f"user_{tg_id}")
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Calculate expiry date
    import datetime
    expiry_date = datetime.datetime.now() + datetime.timedelta(days=plan_details["duration_days"])

    # Create a subscription record
    subscription = Subscription(
        user_id=user.tg_id,
        tariff_name=plan_id,
        expiry_date=expiry_date,
        config_link="" # Will be generated by Marzban integration later
    )
    db.add(subscription)
    await db.commit()

    # TODO: Integrate with Marzban here to create the actual key/service
    # For now, just return a success message and a mock payment URL
    return {"message": f"Plan {plan_id} purchased successfully for user {tg_id}.", "url": f"http://mock-payment-success.com/{tg_id}/{plan_id}"}
