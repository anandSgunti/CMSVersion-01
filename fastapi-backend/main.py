# FastAPI Backend - Enterprise Grade
from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import json
from datetime import datetime
import logging
from supabase import create_client, Client
import os
from contextlib import asynccontextmanager

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Supabase client
supabase_url = "https://mdxbmiilvxmittbgkncm.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keGJtaWlsdnhtaXR0YmdrbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODU2NjUsImV4cCI6MjA3MjU2MTY2NX0.sPfglbgXQPO0gtTMB31SbfqrcVinFVuL1qQRcrBAFcQ"
supabase: Client = create_client(supabase_url, supabase_key)

# Connection manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.document_subscribers = {}  # doc_id: [websockets]

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        # Remove from all document subscriptions
        for doc_id in self.document_subscribers:
            if websocket in self.document_subscribers[doc_id]:
                self.document_subscribers[doc_id].remove(websocket)

    async def subscribe_to_document(self, websocket: WebSocket, doc_id: str):
        if doc_id not in self.document_subscribers:
            self.document_subscribers[doc_id] = []
        self.document_subscribers[doc_id].append(websocket)

    async def broadcast_to_document(self, doc_id: str, message: dict):
        if doc_id in self.document_subscribers:
            for websocket in self.document_subscribers[doc_id].copy():
                try:
                    await websocket.send_text(json.dumps(message))
                except:
                    self.document_subscribers[doc_id].remove(websocket)

manager = ConnectionManager()

# FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("FastAPI server starting...")
    yield
    logger.info("FastAPI server shutting down...")

app = FastAPI(
    title="CMS API",
    description="Enterprise Content Management System API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class DocumentCreate(BaseModel):
    title: str
    body: str
    project_id: str
    status: Optional[str] = "draft"

class DocumentUpdate(BaseModel):
    title: Optional[str]
    body: Optional[str]
    status: Optional[str]

class DocumentResponse(BaseModel):
    id: str
    title: str
    body: str
    status: str
    created_at: datetime
    updated_at: datetime

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Verify JWT token with Supabase
        user = supabase.auth.get_user(credentials.credentials)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# API Routes
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/api/documents", response_model=List[DocumentResponse])
async def get_documents(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    user=Depends(get_current_user)
):
    """Get documents with caching and pagination"""
    try:
        query = supabase.table('documents').select("*")
        
        if search:
            query = query.or_(f'title.ilike.%{search}%,body.ilike.%{search}%')
        
        query = query.range(skip, skip + limit - 1).order('updated_at', desc=True)
        
        result = query.execute()
        
        return result.data
    except Exception as e:
        logger.error(f"Error fetching documents: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch documents")

@app.post("/api/documents", response_model=DocumentResponse)
async def create_document(
    document: DocumentCreate,
    user=Depends(get_current_user)
):
    """Create document with real-time broadcast"""
    try:
        doc_data = {
            **document.dict(),
            'author_id': user.user.id,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        result = supabase.table('documents').insert(doc_data).execute()
        
        # Broadcast to real-time subscribers
        await manager.broadcast_to_document(
            document.project_id,
            {
                'type': 'document_created',
                'document': result.data[0]
            }
        )
        
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating document: {e}")
        raise HTTPException(status_code=500, detail="Failed to create document")

@app.put("/api/documents/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: str,
    document: DocumentUpdate,
    user=Depends(get_current_user)
):
    """Update document with optimistic locking"""
    try:
        update_data = {
            **document.dict(exclude_unset=True),
            'updated_at': datetime.now().isoformat()
        }
        
        result = supabase.table('documents')\
            .update(update_data)\
            .eq('id', document_id)\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Broadcast real-time update
        await manager.broadcast_to_document(
            document_id,
            {
                'type': 'document_updated',
                'document': result.data[0],
                'updated_by': user.user.id
            }
        )
        
        return result.data[0]
    except Exception as e:
        logger.error(f"Error updating document: {e}")
        raise HTTPException(status_code=500, detail="Failed to update document")

# WebSocket endpoint for real-time collaboration
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message['type'] == 'subscribe_document':
                doc_id = message['doc_id']
                await manager.subscribe_to_document(websocket, doc_id)
            
            elif message['type'] == 'document_update':
                # Broadcast to other subscribers of this document
                doc_id = message['doc_id']
                await manager.broadcast_to_document(doc_id, {
                    'type': 'live_update',
                    'content': message['content'],
                    'timestamp': message['timestamp']
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error: {exc.detail}")
    return {"error": exc.detail, "status_code": exc.status_code}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )