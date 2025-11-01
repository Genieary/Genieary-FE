import axios from 'axios';

export const getRecommendGifts = async (date: string) => {
  const response = await axios.get('/api/recommend', {
    params: { date },
  });
  return response.data;
};
