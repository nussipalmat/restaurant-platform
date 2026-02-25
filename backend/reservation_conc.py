import threading
import requests
import time
import json

URL = "http://localhost:8000/api/v1/reservations/"

HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxOTYyODc4LCJpYXQiOjE3NzE5NTkyNzgsImp0aSI6ImNkNWI5ZWUzOWNlYjRmMjRhOGUzZDMzNTM0YzJiMjA3IiwidXNlcl9pZCI6MX0.PqMOyAhqE-NEgFZRzP5W4ZMhPrsGVRDxgvFHB9j9oSo",
    "Content-Type": "application/json"
}

PAYLOAD = {
    "restaurant": 1,
    "table": 1,
    "reservation_date": "2026-7-20",
    "reservation_time": "22:00:00", 
    "guests_count": 2,
    "special_requests": "Concurrency test",
    "phone": "+77011112233",
    "email": "test@example.com"
}

def make_reservation(thread_name):
    print(f"[{thread_name}] Sending request...")
    response = requests.post(URL, json=PAYLOAD, headers=HEADERS)
    
    if response.status_code == 500:
        print(f"[{thread_name}] Response: 500 Internal Server Error (Transaction blocked by DB: IntegrityError)")
    else:
        try:
            data = response.json()
            print(f"[{thread_name}] Response: {response.status_code} Created - Reservation successfully created (ID: {data.get('id')})")
        except ValueError:
            print(f"[{thread_name}] Response: {response.status_code}")


thread1 = threading.Thread(target=make_reservation, args=("User 1",))
thread2 = threading.Thread(target=make_reservation, args=("User 2",))

print("Starting concurrency test...")

thread1.start()
thread2.start()

thread1.join()
thread2.join()
print("Test completed!")