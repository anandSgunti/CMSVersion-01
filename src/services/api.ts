// Enterprise API Service Layer
class ApiService {
  private baseURL: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    this.wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
  }

  // HTTP Client with retry logic and caching
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Real-time WebSocket connection
  connectWebSocket(onMessage: (data: any) => void) {
    this.ws = new WebSocket(this.wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      // Auto-reconnect logic
      setTimeout(() => this.connectWebSocket(onMessage), 3000);
    };
  }

  // Document operations
  async getDocuments(params?: any) {
    return this.request('/api/documents', { 
      method: 'GET',
      headers: params ? { 'X-Query-Params': JSON.stringify(params) } : {}
    });
  }

  async createDocument(data: any) {
    return this.request('/api/documents', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateDocument(id: string, data: any) {
    return this.request(`/api/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Authentication
  async login(credentials: any) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // Real-time document collaboration
  sendDocumentUpdate(docId: string, content: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'document_update',
        doc_id: docId,
        content: content,
        timestamp: Date.now()
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const apiService = new ApiService();