#!/usr/bin/env python3
"""
Keep-Alive Script for Render Free Services
Pings your services every 10 minutes to prevent sleep
"""

import requests
import time
import threading
from datetime import datetime

# Your Render service URLs
SERVICES = [
    "https://price-tracker-frontend-cm6t.onrender.com",
    "https://tanzania-stock-frontend.onrender.com"
]

def ping_service(url):
    """Ping service to keep it awake"""
    try:
        response = requests.get(url, timeout=30)
        print(f"✅ {datetime.now()}: {url} - Status: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ {datetime.now()}: {url} - Error: {str(e)}")
        return False

def keep_alive():
    """Keep services alive by pinging every 10 minutes"""
    while True:
        for service in SERVICES:
            ping_service(service)
        
        print(f"⏰ {datetime.now()}: Sleeping for 10 minutes...")
        time.sleep(600)  # 10 minutes

if __name__ == "__main__":
    print("🚀 Starting Keep-Alive Service...")
    print(f"Monitoring {len(SERVICES)} services")
    
    # Start in background thread
    keep_alive_thread = threading.Thread(target=keep_alive, daemon=True)
    keep_alive_thread.start()
    
    # Keep main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Keep-Alive service stopped")
