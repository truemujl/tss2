import httpx
import os
from typing import Optional, Dict, Any

class MarzbanAPI:
    def __init__(self):
        self.base_url = os.getenv("MARZBAN_URL")
        self.username = os.getenv("MARZBAN_USERNAME")
        self.password = os.getenv("MARZBAN_PASSWORD")
        self.token = None
        self.client = httpx.AsyncClient(base_url=self.base_url, verify=False)  # verify=False for self-signed certs

    async def login(self) -> bool:
        if not self.base_url:
            print("Marzban URL not set, skipping login (Mock Mode)")
            return False
            
        try:
            response = await self.client.post(
                "/api/admin/token",
                data={"username": self.username, "password": self.password},
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            response.raise_for_status()
            data = response.json()
            self.token = data.get("access_token")
            return True
        except Exception as e:
            print(f"Marzban Login Failed: {e}")
            return False

    async def create_user(self, username: str, expire: int = 0, data_limit: int = 0) -> Optional[str]:
        """
        Creates a user in Marzban and returns the subscription URL (VLESS).
        expire: timestamp
        """
        if not self.token:
            if not await self.login():
                return f"vless://mock-uuid@{self.base_url}:443?security=reality&sni=google.com&fp=chrome&pbk=mock-key&sid=mock-sid&type=grpc&serviceName=grpc#TssVPN_{username}"

        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {
            "username": username,
            "proxies": {"vless": {}},
            "expire": expire,
            "data_limit": data_limit,
            "status": "active"
        }
        
        try:
            # Note: Endpoint might vary based on Marzban version, using standard /api/user
            response = await self.client.post("/api/user", json=payload, headers=headers)
            response.raise_for_status()
            user_data = response.json()
            # Construct subscription link or extract from response
            return user_data.get("subscription_url", "")
        except Exception as e:
            print(f"Failed to create user in Marzban: {e}")
            return None

    async def get_user_stats(self, username: str) -> Dict[str, Any]:
        if not self.token:
            await self.login()
            
        # Implementation for stats
        return {}

marzban = MarzbanAPI()
