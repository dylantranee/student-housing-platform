import { request } from '../../util/request';
import type { RoommateProfile, RoommateProfileCreate, RoommateProfileUpdate } from '../../types/roommateProfile.types';

const API_URL = '/api/roommate-profile';

export const createRoommateProfile = async (data: RoommateProfileCreate): Promise<RoommateProfile> => {
  return request<RoommateProfile>(
    { method: 'POST', url: API_URL },
    data
  );
};

export const getRoommateProfile = async (userId: string): Promise<RoommateProfile> => {
  return request<RoommateProfile>(`${API_URL}/user/${userId}`);
};

export const updateRoommateProfile = async (id: string, data: RoommateProfileUpdate): Promise<RoommateProfile> => {
  return request<RoommateProfile>(
    { method: 'PATCH', url: `${API_URL}/${id}` },
    data
  );
};

export const deleteRoommateProfile = async (id: string): Promise<void> => {
  return request<void>({ method: 'DELETE', url: `${API_URL}/${id}` });
};

export const uploadProfilePhoto = async (id: string, file: File): Promise<RoommateProfile> => {
  const token = localStorage.getItem('access_token') || '';
  const formData = new FormData();
  formData.append('photo', file);
  
  // request utility doesn't support multipart/form-data yet, so we use fetch directly here
  // or we could update request.ts. Let's keep it simple for now.
  const response = await fetch(`${API_URL}/${id}/photo`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }
  return response.json();
};
