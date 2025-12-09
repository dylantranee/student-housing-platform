import { request } from '../../util/request';

export const getProperties = async () => {
  const response = await request({
    method: 'GET',
    url: 'http://localhost:3000/api/houseDetail',
  });
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
};