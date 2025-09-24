import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import FriendSearchItem from './FriendSearchItem';

const MOCK_USERS = [
  '고릴란 산', '고릴란 산책', '고릴란 산책러', '고릴란 산책러버',
  '정원쨩', '권아림', '아리무', '도카쨩',
];
const PANEL_HEIGHT = 600;

const FriendSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(() => {
    const q = keyword.trim();
    if (!q) return [];
    return MOCK_USERS.filter(name => name.toLowerCase().includes(q.toLowerCase()));
  }, [keyword]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setSubmitted(true);
  };

  const onAdd = (name: string) => {
    alert(`'${name}'에게 친구 신청 보냄 (stub)`);
  };

  const showEmpty = !submitted || (submitted && results.length === 0);

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
          {showEmpty ? (
            <Empty>검색어를 입력하고 엔터를 눌러주세요.</Empty>
          ) : (
            <List>
              {results.map((name) => (
                <FriendSearchItem key={name} name={name} onAdd={onAdd} />
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
