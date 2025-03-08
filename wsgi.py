from supabase import create_client
import talib
from server.api import app

# Initialize with unlimited storage capacity
supabase = create_client(
    supabase_url="https://nujudloxgdbuohbahzlt.supabase.co",
    supabase_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51anVkbG94Z2RidW9oYmFoemx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExODU4NzYsImV4cCI6MjA1Njc2MTg3Nn0.lyWm0CAPkA6P494lbyBqB-ZdWdQUFQhkc5jbbJFLPZU",
    options={
        'db_pool_size': 500,  # Handle large concurrent operations
        'realtime': True      # Real-time data sync
    }
)

if __name__ == "__main__":
    from waitress import serve
    serve(app, host='0.0.0.0', port=8000)
