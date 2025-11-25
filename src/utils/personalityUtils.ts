// 영어 ENUM → 한국어
export const personalityToKorean: Record<string, string> = {
    PLANNED: "계획적인",
    ENERGETIC: "활기있는",
    SOCIABLE: "사교적인",
    CALM: "차분한",
    ANALYTICAL: "분석적인",
    IMPULSIVE: "충동적인",
    SERIOUS: "진지한",
    PASSIONATE: "열정적인",
    PERFECTIONIST: "완벽주의자",
    HONEST: "솔직한",
    RESTRAINED: "절제된",
    AGGRESSIVE: "공격적인",
    NEAT: "깔끔한",
    JEALOUS: "질투많은",
    FRUGAL: "검소한",
    MELANCHOLIC: "우울한",
    CARELESS: "덜렁이",
    GREEDY: "욕심쟁이",
    INTROVERTED: "내성적",
    EXTROVERTED: "외향적",
    SIMPLE: "단순적",
    LONER: "외톨이",
  };
  
  // 한국어 → 영어 ENUM 
  export const koreanToPersonality = Object.fromEntries(
    Object.entries(personalityToKorean).map(([eng, kor]) => [kor, eng])
  ) as Record<string, string>;
  
  // 한국어 키워드 리스트
  export const PERSONALITY_KEYWORDS = Object.values(personalityToKorean);
  