// src/components/friends/FriendSearch.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import FriendSearchItem from './FriendSearchItem';
import { searchFriends, type FriendSearchResult } from '../../api/friends';
import { sendFriendRequest } from '../../api/friendRequests';

const PANEL_HEIGHT = 600;

const FriendSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<FriendSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitted(true);

    const q = keyword.trim();
    if (!q) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const list = await searchFriends(q);
      setResults(list);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.';
      setError(msg);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async (receiverId: number) => {
    try {
      await sendFriendRequest(receiverId);
      alert('친구 요청을 보냈어요!');
    } catch (err) {
      console.error(err);
      alert('친구 요청 중 오류가 발생했습니다.');
    }
  };

  const showEmpty =
    (!submitted && !loading) ||
    (submitted && !loading && !error && results.length === 0);

  return (
    <Card>
      <Panel style={{ height: PANEL_HEIGHT }}>
        <SearchForm onSubmit={onSubmit}>
          <SearchField>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="닉네임 검색"
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </SearchField>
          <Divider />
        </SearchForm>

        <ResultsArea>
          {loading && <Empty>검색 중...</Empty>}
          {error && <Empty style={{ color: '#e85c5a' }}>{error}</Empty>}

          {showEmpty ? (
            <Empty>
              {submitted ? '검색 결과가 없습니다.' : '검색어를 입력하고 엔터를 눌러주세요.'}
            </Empty>
          ) : (
            <List>
              {results.map((u) => (
                <FriendSearchItem
                  key={u.friendId}
                  name={u.nickname}
                  avatarUrl={u.profileImage ?? undefined}
                  onAdd={(/*name*/) => onAdd(u.friendId)} 
                />
              ))}
            </List>
          )}
        </ResultsArea>
      </Panel>
    </Card>
  );
};

export default FriendSearch;

const Card = styled.div`
  flex-grow: 1;
  background-color: #fff;
  border-radius: 16px;
  padding: 8px 32px 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const Panel = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
`;

const SearchForm = styled.form``;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  background: #f6f7fb;
  border: 1px solid #eef0f4;
  border-radius: 10px;
  padding: 10px 12px 10px 14px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 14px 0 0 0;
`;

const ResultsArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 10px;
`;

const List = styled.div``;

const Empty = styled.div`
  color: #999;
  padding: 18px 0;
  /* 필요시 중앙정렬하고 싶으면 아래 주석 해제
  display:flex; align-items:center; justify-content:center; height:100%;
  */
`;

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 21l-3.8-3.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
      stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
