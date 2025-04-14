import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI")

try:
    mongo_client = MongoClient(DATABASE_URI)
    db = mongo_client["storydb"]
    stories_collection = db["stories"]
    mongo_client.server_info()  # This checks the connection
    print("✅ Successfully connected to MongoDB")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {str(e)}")
    db = None
    stories_collection = None
