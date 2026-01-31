import asyncio
import logging
import os
import sys
from aiogram import Bot, Dispatcher, types
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message
from aiogram.client.default import DefaultBotProperties
import aiohttp
import json

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize Bot
BOT_TOKEN = os.getenv("BOT_TOKEN")
BACKEND_URL = os.getenv("BACKEND_URL", "http://tss_site_backend:8000")

dp = Dispatcher()
bot = None

async def ensure_user_exists(user_id: int, first_name: str = "", last_name: str = "", username: str = ""):
    """
    Ensure user exists in the database via backend API
    """
    if not BACKEND_URL:
        logging.error("BACKEND_URL is not set")
        return None

    try:
        async with aiohttp.ClientSession() as session:
            # Make request to backend to check if user exists
            async with session.get(f"{BACKEND_URL}/users/check/{user_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    return data
                else:
                    # User doesn't exist, return None to indicate this
                    return None
    except Exception as e:
        logging.error(f"Error checking user existence: {e}")
        return None


async def create_or_update_user_in_backend(user_info):
    """
    Create or update user in the backend database
    """
    if not BACKEND_URL:
        logging.error("BACKEND_URL is not set")
        return None

    try:
        async with aiohttp.ClientSession() as session:
            # Prepare data for Telegram auth callback (this will create/update the user)
            auth_data = {
                'id': str(user_info.id),
                'first_name': user_info.first_name or '',
                'last_name': user_info.last_name or '',
                'username': user_info.username or '',
                'photo_url': getattr(user_info, 'photo_url', ''),
                # We'll generate a temporary auth_date and hash for internal processing
                # The actual validation happens when users come from the web
            }
            
            # We'll store the user data temporarily and return a special login URL
            # The real authentication will happen when the user visits the web page
            return f"{BACKEND_URL}/auth/telegram/callback"
    except Exception as e:
        logging.error(f"Error preparing user data: {e}")
        return None

@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    """
    This handler receives messages with `/start` command
    """
    # Check if this is a login command
    command_parts = message.text.split('_')
    if len(command_parts) > 1 and command_parts[0] == '/start login':
        # This is a login request from the website
        login_url = f"{os.getenv('FRONTEND_URL', 'http://n8n.kavada.ru:8080')}/login"
        await message.answer(
            f"Товарищ {message.from_user.full_name}, для завершения авторизации на сайте перейдите по ссылке:\n\n{login_url}\n\n"
            f"Нажмите на кнопку 'Войти через Telegram' и подтвердите авторизацию."
        )
        return
    
    # Regular start command
    greeting_text = f"Товарищ {message.from_user.full_name}, твоя связь под защитой! ☭\n\nИспользуй меню для управления подписками."
    await message.answer(greeting_text)


@dp.message(lambda message: message.text and 'login' in message.text.lower())
async def handle_login_request(message: Message) -> None:
    """
    Handle direct login requests
    """
    login_url = f"{os.getenv('FRONTEND_URL', 'http://n8n.kavada.ru:8080')}/login"
    await message.answer(
        f"Товарищ {message.from_user.full_name}, для авторизации на сайте перейдите по ссылке:\n\n{login_url}\n\n"
        f"Нажмите на кнопку 'Войти через Telegram' и подтвердите авторизацию."
    )

async def main() -> None:
    global bot
    if not BOT_TOKEN:
        logging.error("BOT_TOKEN is not set")
        return
        
    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
