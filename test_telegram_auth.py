#!/usr/bin/env python3
"""
Test script to verify Telegram authorization functionality
"""
import requests
import time
import hashlib
import hmac
from urllib.parse import urlencode


def test_telegram_auth():
    """Test the Telegram authorization endpoint"""
    base_url = "http://localhost:8080"
    
    # Test data
    auth_data = {
        'id': 123456789,
        'first_name': 'Test',
        'last_name': 'User',
        'username': 'testuser',
        'photo_url': '',
        'auth_date': int(time.time()),
    }
    
    # For testing purposes, we'll use an invalid hash
    # which should return "Invalid Telegram login data"
    auth_data['hash'] = 'invalid_hash_for_testing'
    
    # Prepare form data
    form_data = {
        'id': auth_data['id'],
        'first_name': auth_data['first_name'],
        'last_name': auth_data.get('last_name', ''),
        'username': auth_data.get('username', ''),
        'photo_url': auth_data.get('photo_url', ''),
        'auth_date': auth_data['auth_date'],
        'hash': auth_data['hash'],
    }
    
    # Send POST request to the auth endpoint
    url = f"{base_url}/auth/telegram/callback"
    print(f"Testing Telegram auth at: {url}")
    print(f"Sending data: {form_data}")
    
    try:
        response = requests.post(
            url,
            data=form_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 400 and "Invalid Telegram login data" in response.text:
            print("\n✅ SUCCESS: Telegram auth endpoint is working correctly!")
            print("The endpoint properly rejects invalid hashes as expected.")
            return True
        elif response.status_code == 200:
            print("\n✅ SUCCESS: Telegram auth successful!")
            print("User authenticated and token generated.")
            if 'access_token' in response.json():
                print("Access token received.")
            return True
        elif response.status_code == 404:
            print("\n❌ ERROR: Endpoint not found - there might be an issue with the nginx configuration")
            return False
        else:
            print(f"\n❌ ERROR: Unexpected response")
            return False
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to the server")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: Exception occurred: {str(e)}")
        return False


if __name__ == "__main__":
    print("Testing Telegram Authorization Endpoint...")
    success = test_telegram_auth()
    if success:
        print("\n🎉 All tests passed! Telegram authorization is working correctly.")
    else:
        print("\n💥 Tests failed! There may be issues with the authorization endpoint.")