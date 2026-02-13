from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    tg_id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=True)  # Username for both web and Telegram
    first_name = Column(String, nullable=True)  # From Telegram
    last_name = Column(String, nullable=True)   # From Telegram
    avatar_url = Column(String, nullable=True)  # From Telegram
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_banned = Column(Boolean, default=False)
    email = Column(String, unique=True, nullable=True)  # For web registration
    password_hash = Column(String, nullable=True)  # For web authentication
    is_verified = Column(Boolean, default=False)  # Email verification
    last_login = Column(DateTime, nullable=True)  # Last login timestamp
    is_admin = Column(Boolean, default=False)    # Admin access flag

    subscriptions = relationship("Subscription", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.tg_id"))
    tariff_name = Column(String)
    expiry_date = Column(DateTime)
    config_link = Column(String)

    user = relationship("User", back_populates="subscriptions")

class SiteConfig(Base):
    __tablename__ = "site_configs"

    id = Column(Integer, primary_key=True)
    bot_welcome_message = Column(String, default="Здравствуйте! Ваш доступ в свободный интернет под надежной защитой TssVPN.")
    site_title = Column(String, default="TssVPN - Надежный VPN сервис")
    site_announcement = Column(String, nullable=True)
    support_link = Column(String, default="https://t.me/tssvpn_support_bot")

class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String)
    ip_address = Column(String)
    status = Column(String, default="Online")
    load_percentage = Column(Float, default=0.0)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.tg_id"))
    amount = Column(Float)
    payment_method = Column(String)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")
