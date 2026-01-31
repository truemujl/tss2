from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Use PostgreSQL DATABASE_URL from environment or fallback to SQLite for testing
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://marzban_user:marzban_password@tssvpn-db:5432/marzban")

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
