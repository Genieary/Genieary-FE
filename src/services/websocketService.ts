// src/services/websocketService.ts
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './authService';

export interface WebSocketMessage {
  message: string;
  messageType: 'CHAT' | 'READ';
  senderId: number;
  roomUuid: string;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private client: Client | null = null;
  private isConnected = false;
  private messageCallbacks: Map<string, (message: any) => void> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.client) {
        resolve();
        return;
      }
      
      const token = AuthService.getAccessToken();
      if (!token) {
        reject(new Error('No access token available'));
        return;
      }

      const socket = new SockJS('http://localhost:8080/ws');
      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`
        },
        onConnect: () => {
          this.isConnected = true;
          resolve();
        },
        onStompError: (error) => {
          this.isConnected = false;
          reject(error);
        },
        onWebSocketError: (error) => {
          this.isConnected = false;
          reject(error);
        }
      });

      this.client.activate();
    });
  }

  subscribeToRoom(roomUuid: string, callback: (message: any) => void): void {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const destination = `/topic/chat/${roomUuid}`;
    
    this.client.subscribe(destination, (message: IMessage) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.messageCallbacks.set(roomUuid, callback);
  }

  sendMessage(roomUuid: string, message: string): void {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const userId = AuthService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const messageData: WebSocketMessage = {
      message,
      messageType: 'CHAT',
      senderId: userId,
      roomUuid
    };

    this.client.publish({
      destination: `/app/chat/${roomUuid}`,
      body: JSON.stringify(messageData)
    });
  }

  markAsRead(roomUuid: string): void {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.client.publish({
      destination: `/app/chat/${roomUuid}/read`,
      body: JSON.stringify({})
    });
  }

  unsubscribeFromRoom(roomUuid: string): void {
    if (this.messageCallbacks.has(roomUuid)) {
      this.messageCallbacks.delete(roomUuid);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.messageCallbacks.clear();
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected && this.client?.connected === true;
  }
}
