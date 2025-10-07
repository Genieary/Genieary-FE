// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { WebSocketService } from '../services/websocketService';

export const useWebSocket = () => {
  const wsService = useRef(WebSocketService.getInstance());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        setConnectionError(null);
        await wsService.current.connect();
        setIsConnected(true);
        console.log('WebSocket connected successfully');
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      wsService.current.disconnect();
      setIsConnected(false);
    };
  }, []);

  const sendMessage = async (roomUuid: string, message: string) => {
    try {
      await wsService.current.sendMessage(roomUuid, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const subscribeToRoom = async (roomUuid: string, callback: (message: any) => void) => {
    try {
      await wsService.current.subscribeToRoom(roomUuid, callback);
    } catch (error) {
      console.error('Failed to subscribe to room:', error);
      throw error;
    }
  };

  const markAsRead = async (roomUuid: string) => {
    try {
      await wsService.current.markAsRead(roomUuid);
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  };

  const unsubscribeFromRoom = (roomUuid: string) => {
    wsService.current.unsubscribeFromRoom(roomUuid);
  };

  return {
    sendMessage,
    subscribeToRoom,
    unsubscribeFromRoom,
    markAsRead,
    isConnected,
    connectionError
  };
};
