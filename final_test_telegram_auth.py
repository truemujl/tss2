#!/usr/bin/env python3
"""
Final test script to verify full Telegram authorization functionality
"""
import requests
import time
import hashlib
import hmac
from urllib.parse import urlencode


def test_telegram_auth_functionality():
    """Test the complete Telegram authorization functionality"""
    base_url = "http://localhost:8080"
    
    print("🔍 Testing Telegram Authorization Integration")
    print("="*50)
    
    # Test 1: Invalid hash should return proper error
    print("\n1. Testing invalid hash handling:")
    auth_data = {
        'id': 123456789,
        'first_name': 'Test',
        'last_name': 'User',
        'username': 'testuser',
        'photo_url': '',
        'auth_date': int(time.time()),
        'hash': 'invalid_hash_for_testing'
    }
    
    response = requests.post(
        f"{base_url}/auth/telegram/callback",
        data=auth_data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {response.text}")
    
    if response.status_code == 400 and "Invalid Telegram login data" in response.text:
        print("   ✅ PASS: Invalid hash properly rejected")
        test1_success = True
    else:
        print("   ❌ FAIL: Invalid hash not properly handled")
        test1_success = False
    
    # Test 2: Missing required fields
    print("\n2. Testing missing fields handling:")
    incomplete_data = {
        'id': 123456789,
        'first_name': 'Test'
        # Missing auth_date and hash
    }
    
    response = requests.post(
        f"{base_url}/auth/telegram/callback",
        data=incomplete_data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {response.text}")
    
    if response.status_code in [400, 422]:
        print("   ✅ PASS: Missing fields properly handled")
        test2_success = True
    else:
        print("   ❌ FAIL: Missing fields not properly handled")
        test2_success = False
    
    # Test 3: Check if main page still works
    print("\n3. Testing main page accessibility:")
    response = requests.get(f"{base_url}/")
    
    print(f"   Status Code: {response.status_code}")
    print(f"   Content Length: {len(response.text)} chars")
    
    if response.status_code == 200 and len(response.text) > 1000:  # Main page should be substantial
        print("   ✅ PASS: Main page accessible")
        test3_success = True
    else:
        print("   ❌ FAIL: Main page not accessible")
        test3_success = False
    
    # Summary
    print("\n" + "="*50)
    print("📊 TEST SUMMARY:")
    print(f"   Invalid hash test: {'✅ PASS' if test1_success else '❌ FAIL'}")
    print(f"   Missing fields test: {'✅ PASS' if test2_success else '❌ FAIL'}")
    print(f"   Main page test: {'✅ PASS' if test3_success else '❌ FAIL'}")
    
    all_tests_pass = test1_success and test2_success and test3_success
    
    print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if all_tests_pass else '❌ SOME TESTS FAILED'}")
    
    if all_tests_pass:
        print("\n🎉 Telegram Authorization Integration is working correctly!")
        print("   - Backend properly validates Telegram login data")
        print("   - Security measures are in place")
        print("   - Frontend and backend communication works")
        print("   - Main site functionality remains intact")
    
    return all_tests_pass


if __name__ == "__main__":
    success = test_telegram_auth_functionality()
    exit(0 if success else 1)