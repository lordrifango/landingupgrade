#!/usr/bin/env python3
import requests
import json
import time
import random
import string
import os
import sys

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

# Ensure we have a valid backend URL
if not BACKEND_URL:
    print("Error: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

# Add /api prefix for all API calls
API_URL = f"{BACKEND_URL}/api"

print(f"Using API URL: {API_URL}")

# Helper function to generate random test data
def generate_test_data():
    # Generate random phone number (10 digits)
    phone = ''.join(random.choices(string.digits, k=10))
    
    # Generate random email
    email = f"test_{random.randint(1000, 9999)}@example.com"
    
    # Generate random country code
    country_code = random.choice(["US", "FR", "UK", "CA", "DE"])
    
    # Generate full phone number with country code
    full_phone_number = f"+1{phone}" if country_code == "US" else f"+33{phone}"
    
    return {
        "phone": phone,
        "email": email,
        "country_code": country_code,
        "full_phone_number": full_phone_number,
        "ip_address": "127.0.0.1",
        "user_agent": "Mozilla/5.0 (Test User Agent)"
    }

# Test 1: Create a waitlist entry
def test_create_waitlist_entry():
    print("\n=== Testing POST /api/waitlist ===")
    
    # Generate test data
    test_data = generate_test_data()
    
    # Make the API request
    response = requests.post(f"{API_URL}/waitlist", json=test_data)
    
    # Check if the request was successful
    if response.status_code == 200:
        print("✅ Successfully created waitlist entry")
        
        # Parse the response
        data = response.json()
        
        # Verify that all required fields are present
        required_fields = ["id", "phone", "email", "referral_code", "position", 
                          "full_phone_number", "country_code", "ip_address", 
                          "user_agent", "timestamp"]
        
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            print(f"❌ Missing fields in response: {missing_fields}")
            return None
        
        # Verify that the data matches what we sent
        for field in ["phone", "email", "full_phone_number", "country_code"]:
            if data[field] != test_data[field]:
                print(f"❌ Field mismatch: {field} - Expected: {test_data[field]}, Got: {data[field]}")
                return None
        
        # Verify that referral code is generated (6 characters)
        if not data["referral_code"] or len(data["referral_code"]) != 6:
            print(f"❌ Invalid referral code: {data['referral_code']}")
            return None
        
        # Verify that position is a positive integer
        if not isinstance(data["position"], int) or data["position"] <= 0:
            print(f"❌ Invalid position: {data['position']}")
            return None
        
        print(f"✅ Referral code: {data['referral_code']}")
        print(f"✅ Position: {data['position']}")
        
        return data
    else:
        print(f"❌ Failed to create waitlist entry: {response.status_code}")
        print(f"Response: {response.text}")
        return None

# Test 2: Get all waitlist entries
def test_get_waitlist_entries():
    print("\n=== Testing GET /api/waitlist ===")
    
    # Make the API request
    response = requests.get(f"{API_URL}/waitlist")
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        
        if isinstance(data, list):
            print(f"✅ Successfully retrieved {len(data)} waitlist entries")
            
            # Verify that each entry has the required fields
            if data:
                required_fields = ["id", "phone", "email", "referral_code", "position", 
                                  "full_phone_number", "country_code", "ip_address", 
                                  "user_agent", "timestamp"]
                
                sample_entry = data[0]
                missing_fields = [field for field in required_fields if field not in sample_entry]
                
                if missing_fields:
                    print(f"❌ Missing fields in entries: {missing_fields}")
                else:
                    print("✅ All required fields are present in entries")
            
            return data
        else:
            print("❌ Expected a list of entries, got something else")
            return None
    else:
        print(f"❌ Failed to get waitlist entries: {response.status_code}")
        print(f"Response: {response.text}")
        return None

# Test 3: Get waitlist count
def test_get_waitlist_count():
    print("\n=== Testing GET /api/waitlist/count ===")
    
    # Make the API request
    response = requests.get(f"{API_URL}/waitlist/count")
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        
        if "count" in data and isinstance(data["count"], int):
            print(f"✅ Successfully retrieved waitlist count: {data['count']}")
            return data["count"]
        else:
            print("❌ Response does not contain a valid count")
            return None
    else:
        print(f"❌ Failed to get waitlist count: {response.status_code}")
        print(f"Response: {response.text}")
        return None

# Test 4: Export waitlist entries
def test_export_waitlist_entries():
    print("\n=== Testing GET /api/waitlist/export ===")
    
    # Make the API request
    response = requests.get(f"{API_URL}/waitlist/export")
    
    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        
        if "total_entries" in data and "entries" in data:
            print(f"✅ Successfully exported {data['total_entries']} waitlist entries")
            
            # Verify that the total_entries matches the length of entries
            if data["total_entries"] != len(data["entries"]):
                print(f"❌ Total entries mismatch: {data['total_entries']} vs {len(data['entries'])}")
            
            # Verify that each entry has the required fields
            if data["entries"]:
                required_fields = ["id", "phone", "email", "referral_code", "position", 
                                  "full_phone_number", "country_code", "ip_address", 
                                  "user_agent", "timestamp"]
                
                sample_entry = data["entries"][0]
                missing_fields = [field for field in required_fields if field not in sample_entry]
                
                if missing_fields:
                    print(f"❌ Missing fields in exported entries: {missing_fields}")
                else:
                    print("✅ All required fields are present in exported entries")
            
            return data
        else:
            print("❌ Response does not contain total_entries and entries")
            return None
    else:
        print(f"❌ Failed to export waitlist entries: {response.status_code}")
        print(f"Response: {response.text}")
        return None

# Test 5: Verify referral codes are unique
def test_referral_code_uniqueness():
    print("\n=== Testing Referral Code Uniqueness ===")
    
    # Create multiple waitlist entries
    entries = []
    for _ in range(3):
        entry = test_create_waitlist_entry()
        if entry:
            entries.append(entry)
            # Small delay to ensure different timestamps
            time.sleep(1)
    
    if len(entries) < 2:
        print("❌ Not enough entries created to test uniqueness")
        return False
    
    # Extract referral codes
    referral_codes = [entry["referral_code"] for entry in entries]
    
    # Check for uniqueness
    if len(referral_codes) == len(set(referral_codes)):
        print("✅ All referral codes are unique")
        return True
    else:
        print("❌ Duplicate referral codes found")
        return False

# Run all tests
def run_all_tests():
    print("Starting backend API tests...")
    
    # Test 1: Create a waitlist entry
    entry = test_create_waitlist_entry()
    
    # Test 2: Get all waitlist entries
    entries = test_get_waitlist_entries()
    
    # Test 3: Get waitlist count
    count = test_get_waitlist_count()
    
    # Test 4: Export waitlist entries
    export_data = test_export_waitlist_entries()
    
    # Test 5: Verify referral codes are unique
    referral_unique = test_referral_code_uniqueness()
    
    # Summary
    print("\n=== Test Summary ===")
    tests = [
        ("Create waitlist entry", entry is not None),
        ("Get waitlist entries", entries is not None),
        ("Get waitlist count", count is not None),
        ("Export waitlist entries", export_data is not None),
        ("Referral code uniqueness", referral_unique)
    ]
    
    all_passed = True
    for test_name, passed in tests:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status} - {test_name}")
        if not passed:
            all_passed = False
    
    if all_passed:
        print("\n🎉 All tests passed successfully!")
    else:
        print("\n❌ Some tests failed. See details above.")

if __name__ == "__main__":
    run_all_tests()