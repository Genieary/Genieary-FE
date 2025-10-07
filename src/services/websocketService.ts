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
  private subscriptions: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(): Promise<void> {
    if (this.isConnected && this.client?.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const token = AuthService.getAccessToken();
      if (!token) {
        reject(new Error('No access token available'));
        return;
      }

      const socket = new SockJS('http://localhost:8080/ws'); // 수정 필요한가?
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

    // 기존 구독 해제
    if (this.subscriptions.has(roomUuid)) {
      this.subscriptions.get(roomUuid).unsubscribe();
    }

    const subscription = this.client.subscribe(`/topic/chat/${roomUuid}`, (message: IMessage) => {
      try {
        callback(JSON.parse(message.body));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.subscriptions.set(roomUuid, subscription);
  }

  sendMessage(roomUuid: string, message: string): void {
    if (!this.client || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    const userId = AuthService.getUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    this.client.publish({
      destination: `/app/chat/${roomUuid}`,
      body: JSON.stringify({
        message,
        messageType: 'CHAT',
        senderId: userId,
        roomUuid
      })
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
    if (this.subscriptions.has(roomUuid)) {
      this.subscriptions.get(roomUuid).unsubscribe();
      this.subscriptions.delete(roomUuid);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected && this.client?.connected === true;
  }
}
