from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

# Menambahkan path saat ini agar bisa import rag.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import fungsi ask_bot dari rag.py
# Pastikan rag.py tidak error saat diimport (sudah aman karena ada if __name__ == "__main__")
try:
    from rag import ask_bot
except ImportError as e:
    print(f"Error importing rag.py: {e}")
    ask_bot = None

app = FastAPI()

# Konfigurasi CORS (Cross-Origin Resource Sharing)
# Penting agar frontend (biasanya port 5173) diizinkan mengakses backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Izinkan semua origin (untuk development aman)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model data yang diterima dari frontend
class ChatRequest(BaseModel):
    message: str
    division: str = "IT" # Default divisi jika tidak dikirim

@app.get("/")
def read_root():
    return {"status": "Backend AI is running!"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if ask_bot is None:
        raise HTTPException(status_code=500, detail="RAG system failed to load.")
    
    try:
        # Panggil fungsi AI yang asli
        # Divisi bisa disesuaikan nanti dengan user yang login di dashboard
        response = ask_bot(request.message, request.division)
        return {"response": response}
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
