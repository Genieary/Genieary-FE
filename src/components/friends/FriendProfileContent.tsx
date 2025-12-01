import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || '';

type GiftPreviewDto = {
  giftId: number;
  name: string;
  imageUrl?: string | null;
};

type FriendProfile = {
  friendId: number;
  nickname: string;
  email: string;
  profileImage?: string | null; // presigned URL
  giftLikes?: GiftPreviewDto[];
};

type FriendGift = {
  id: number;
  name: string;
  imageUrl?: string | null;
  description?: string | null;
  updatedAt?: string | null;
};

type MaybeWrapped<T> = { result?: T; data?: T } | T;
const unwrap = <T,>(payload: MaybeWrapped<T>): T =>
  ((payload as any)?.result ?? (payload as any)?.data ?? payload) as T;

const FriendProfileContent: React.FC = () => {
  const navigate = useNavigate();

  const params = useParams();
  const friendIdParam = (params.friendId ?? params.id) as string | undefined;

  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [gifts, setGifts] = useState<FriendGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const headerName = useMemo(() => {
    if (profile?.nickname) return profile.nickname;
    if (friendIdParam) return `user #${friendIdParam}`;
    return '친구';
  }, [profile?.nickname, friendIdParam]);

  useEffect(() => {
    if (!friendIdParam) {
      setErr('잘못된 친구 정보입니다. (URL 파라미터 없음)');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let cancelled = false;

    (async () => {
      try {
        // 1) 친구 프로필 (닉네임/이미지/미리보기 좋아요) 우선 로드
        let profRes = await fetch(`${API_BASE}/friend/${friendIdParam}`, { headers });
        if (!profRes.ok && (profRes.status === 403 || profRes.status === 404)) {
          profRes = await fetch(`${API_BASE}/users/${friendIdParam}`, { headers });
        }
        if (!profRes.ok) {
          const msg = `프로필 응답 오류 (HTTP ${profRes.status})`;
          throw new Error(msg);
        }
        const profBody = unwrap<FriendProfile>(await profRes.json());
        if (cancelled) return;

        setProfile(profBody);

        // 프로필의 giftLikes를 먼저 화면에 보여주기
        const initial = (profBody.giftLikes ?? []).map<FriendGift>((g) => ({
          id: g.giftId,
          name: g.name,
          imageUrl: g.imageUrl ?? null,
        }));
        setGifts(initial);

        // 2) 공개 좋아요 목록이 따로 있으면 덮어쓰기 (성공 시)
        try {
          let recRes = await fetch(`${API_BASE}/friend/${friendIdParam}/recommendations?page=0&size=20`, { headers });
          if (!recRes.ok && (recRes.status === 403 || recRes.status === 404)) {
            recRes = await fetch(`${API_BASE}/users/${friendIdParam}/recommendations?page=0&size=20`, { headers });
          }
          if (recRes.ok) {
            const recBody = unwrap<any[]>(await recRes.json());
            if (!cancelled && Array.isArray(recBody)) {
              const mapped = recBody.map<FriendGift>((r: any) => ({
                // recommendId나 giftId 어떤 키가 오든 id로 정규화
                id: r.recommendId ?? r.giftId ?? r.id,
                name: r.name ?? r.contentName ?? '이름 없음',
                imageUrl: r.imageUrl ?? r.contentImage ?? null,
                
              }));
              setGifts(mapped);
            }
          }
        } catch {
        }

        setErr(null);
      } catch (e: any) {
        setErr(e?.message || '목록을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [friendIdParam]);

  return (
    <ListWrapper>
      <Section>
        <SectionHeader>
          <BackWrapper onClick={() => navigate('/friends')}>
            <BackIcon />
            <BackText>친구 목록</BackText>
          </BackWrapper>
        </SectionHeader>

        <ProfileBlock>
          <Left>
            {profile?.profileImage ? (
              <ProfileImg
                src={profile.profileImage}
                alt={`${headerName} 프로필 이미지`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <ProfileCircle />
            )}
            <NameBlock>
              <Name>{profile?.nickname ?? `user #${friendIdParam}`}</Name>
              <UserId>{profile?.email ?? ''}</UserId>
            </NameBlock>
          </Left>

          <Right>
            <LampIllustration />
            <RecommendButton onClick={() => navigate(`/recommend/friend/${friendIdParam ?? ''}`)}>
              친구 맞춤 선물 추천 받으러가기
            </RecommendButton>
          </Right>
        </ProfileBlock>
      </Section>

      <Divider />

      <Section>
        <SectionTitle>친구의 선물 좋아요 리스트</SectionTitle>

        {loading && <SmallText>불러오는 중…</SmallText>}
        {!loading && err && <SmallText style={{ color: '#E85C5A' }}>{err}</SmallText>}

        {!loading && !err && gifts.length === 0 && (
          <SmallText>공개로 설정된 좋아요 선물이 없어요.</SmallText>
        )}

        {!loading && !err && gifts.length > 0 && (
          <GiftList>
            {gifts.map((g) => (
              <GiftCardContainer key={g.id}>
                <GiftImage
                  src={g.imageUrl || '/images/placeholder.png'}
                  alt={g.name}
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                />
                <GiftLabel>{g.name}</GiftLabel>
                {g.updatedAt && <GiftMeta>{new Date(g.updatedAt).toLocaleString()}</GiftMeta>}
                {g.description && <GiftDesc title={g.description}>{g.description}</GiftDesc>}
              </GiftCardContainer>
            ))}
          </GiftList>
        )}
      </Section>
    </ListWrapper>
  );
};

export default FriendProfileContent;

const ListWrapper = styled.div`
  flex-grow: 1;
  background-color: white;
  border-radius: 16px;
  padding: 8px 32px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #555;
  cursor: pointer;
`;

const GiftProfileButton = styled.button`
  background: #fff0f0;
  border: 2px solid #ff4d4f;
  color: #ff4d4f;
  font-weight: 700;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const ProfileBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 24px;
`;

const ProfileCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #fff3bf;
  margin-left: 20px;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 12px;
`;


const Name = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const UserId = styled.div`
  font-size: 14px;
  color: #888;
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  color: #000;
  font-size: 16px;
  font-weight: 700;
`;

const SmallText = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const GiftList = styled.div`
  display: flex;
  gap: 40px;
`;

const GiftCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
`;

const GiftImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 12px;
  background-color: #f9f9f9;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GiftLabel = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #000;
  width: 100%;
  text-align: left;
`;

const GiftMeta = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #999;
`;

const GiftDesc = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BackWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 16px 0 0;
  margin-bottom: 8px;
`;

const BackText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1D1B20;
`;

const BackIcon = () => (
  <svg width="10" height="16" viewBox="0 0 14 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.25 11.5L13.875 20.125L11.25 22.75L0 11.5L11.25 0.25L13.875 2.875L5.25 11.5Z" fill="#1D1B20" />
  </svg>
);

const LampIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 215 209" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_343_673)">
        <path d="M116.895 56.5137C102.921 56.5137 90.677 63.6972 83.8457 74.4734H149.941C143.11 63.6972 130.869 56.5137 116.895 56.5137Z" fill="#FFF3BF"/>
        <path d="M116.895 52.8325C121.651 52.8325 125.506 49.082 125.506 44.4587C125.506 39.8362 121.651 36.0889 116.895 36.0889C112.14 36.0889 108.285 39.8362 108.285 44.4587C108.285 49.082 112.14 52.8325 116.895 52.8325Z" fill="#FFF3BF"/>
        <path d="M191.469 67.7767C172.249 69.3066 164.858 84.8159 162.684 90.274L149.789 80.1636H83.6558C79.1778 84.5167 69.1874 92.5542 58.167 90.5442C47.1428 88.5375 30.5114 60.9405 15.4542 58.0655C-3.83446 54.3811 -1.42453 59.4032 3.39995 62.7545C6.0421 64.5915 14.8118 79.8419 34.0551 99.2499C60.1671 125.587 75.3884 146.13 114.999 146.13C137.09 146.13 155.633 131.825 164.859 120.883C174.595 124.079 190.508 123.425 204.904 110.636C224.879 92.8905 212.479 66.1026 191.469 67.7767ZM195.608 100.746C187.83 107.657 180.379 109.106 175.499 109.106C173.872 109.106 172.495 108.95 171.359 108.732C171.872 105.292 173.397 100.196 174.891 96.7411C174.978 96.5378 175.061 96.3309 175.138 96.1272C178.62 86.8153 184.493 81.7707 192.594 81.1241C192.845 81.1053 193.092 81.0947 193.336 81.0947C198.087 81.0947 200.026 85.0339 200.509 86.2421C202.382 90.9357 200.55 96.3566 195.608 100.746Z" fill="#FFF3BF"/>
        <path d="M130.846 149.248C125.783 150.409 120.472 151.085 114.998 151.085C108.927 151.085 103.146 150.664 97.6374 149.902C89.6198 155.834 82.2754 163.568 82.2754 172.91H114.69H147.11C147.109 163.22 139.206 155.257 130.846 149.248Z" fill="#FFF3BF"/>
        <path d="M135.5 111.5V135.25H97.5V111.5M116.5 135.25V99.625M116.5 99.625H105.812C104.238 99.625 102.728 98.9994 101.614 97.8859C100.501 96.7724 99.875 95.2622 99.875 93.6875C99.875 92.1128 100.501 90.6026 101.614 89.4891C102.728 88.3756 104.238 87.75 105.812 87.75C114.125 87.75 116.5 99.625 116.5 99.625ZM116.5 99.625H127.188C128.762 99.625 130.272 98.9994 131.386 97.8859C132.499 96.7724 133.125 95.2622 133.125 93.6875C133.125 92.1128 132.499 90.6026 131.386 89.4891C130.272 88.3756 128.762 87.75 127.188 87.75C118.875 87.75 116.5 99.625 116.5 99.625ZM92.75 99.625H140.25V111.5H92.75V99.625Z" stroke="#E85C5A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
        <clipPath id="clip0_343_673">
            <rect width="215" height="209" fill="white"/>
        </clipPath>
    </defs>
  </svg>
);

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  gap: 0px;
`;

const RecommendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e0e6ff;
  border: 1.5px solid #4A6CF6;
  color: #4A6CF6;
  padding: 2px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: -8px;
`;

const Divider = styled.hr`
  margin: 32px 0;
  border: none;
  height: 2px;
  background-color: #eee;
`;

const ProfileImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f0f0f0;
`;
