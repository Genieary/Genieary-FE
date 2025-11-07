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
        await wsService.current.connect();
        setIsConnected(true);
      } catch (error) {
        setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      wsService.current.disconnect();
    };
  }, []);

  return {
    sendMessage: (roomUuid: string, message: string) => 
      wsService.current.sendMessage(roomUuid, message),
    subscribeToRoom: (roomUuid: string, callback: (message: any) => void) =>
      wsService.current.subscribeToRoom(roomUuid, callback),
    unsubscribeFromRoom: (roomUuid: string) =>
      wsService.current.unsubscribeFromRoom(roomUuid),
    markAsRead: (roomUuid: string) =>
      wsService.current.markAsRead(roomUuid),
    isConnected,
    connectionError
  };
};
