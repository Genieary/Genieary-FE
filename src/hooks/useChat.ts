import { useState, useEffect, useCallback } from 'react';
import { ChatApi } from '../api/chatApi';
import { ChatRoomResponse, ChatMessageResponse, PaginatedResponse } from '../types/chat';

export const useChat = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoomResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatApi = new ChatApi();

  // 채팅방 목록 조회
  const fetchChatRooms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApi.getUserChatRooms();
      
      if (response.error) {
        setError(response.error);
        return [];
      }

      if (response.data) {
        setChatRooms(response.data);
        return response.data;
      }
      
      return [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅방 목록을 불러오는데 실패했습니다.';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 채팅방 생성 또는 조회
  const createOrGetChatRoom = async (friendId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatApi.createOrGetChatRoom(friendId);
      
      if (response.error) {
        setError(response.error);
        return null;
      }

      if (response.data) {
        // 새 채팅방이 생성되거나 조회되면 목록을 업데이트
        await fetchChatRooms();
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅방 생성에 실패했습니다.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    chatRooms,
    loading,
    error,
    fetchChatRooms,
    createOrGetChatRoom
  };
};

// 채팅 메시지 관리를 위한 별도 훅
export const useChatMessages = (roomUuid: string | null) => {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const chatApi = new ChatApi();

  // 메시지 조회
  const fetchMessages = useCallback(async (page: number = 0, append: boolean = false) => {
    if (!roomUuid) return;

    setLoading(true);
    setError(null);

    try {
      const response = await chatApi.getChatMessages(roomUuid, page, 20);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        const newMessages = response.data.content;
        
        if (append) {
          setMessages(prev => [...prev, ...newMessages]);
        } else {
          setMessages(newMessages);
        }
        
        setCurrentPage(page);
        setHasMore(page < response.data.totalPages - 1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '메시지를 불러오는데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [roomUuid]);

  // 더 많은 메시지 로드 (무한 스크롤용)
  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loading) {
      fetchMessages(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, fetchMessages]);

  // roomUuid 변경 시 초기화 및 메시지 로드
  useEffect(() => {
    if (roomUuid) {
      setMessages([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchMessages(0, false);
    }
  }, [roomUuid, fetchMessages]);

  return {
    messages,
    loading,
    error,
    hasMore,
    fetchMessages,
    loadMoreMessages
  };
};
