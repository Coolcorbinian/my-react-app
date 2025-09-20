// src/services/api.ts
const API_BASE_URL = import.meta.env.PROD
  ? '/api/v1'
  : 'http://localhost:3001/api/v1';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; environment: string; version: string }> {
    return this.request('/health');
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request('/users');
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Protected endpoint example
  async getProtectedData(token: string): Promise<{ message: string; timestamp: string }> {
    return this.request('/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService();