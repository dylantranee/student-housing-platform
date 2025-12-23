import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import type { RoommateProfile, RoommateProfileCreate, RoommateProfileUpdate } from '../../types/roommateProfile.types';

const API_URL = `${API_BASE_URL}/roommate-profile`;

// Helper function to get auth token (matches request.ts pattern)
const getAuthToken = (): string => {
  let token = localStorage.getItem('access_token') || '';
  if (!token) {
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (match) token = match[1];
  }
  return token;
};

export const createRoommateProfile = async (data: RoommateProfileCreate): Promise<RoommateProfile> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(API_URL, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating roommate profile:', error);
    throw error;
  }
};

export const getRoommateProfile = async (userId: string): Promise<RoommateProfile> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    // Don't log 404s as errors - it's expected when user hasn't created a profile yet
    if (error.response?.status !== 404) {
      console.error('Error fetching roommate profile:', error);
    }
    throw error;
  }
};

export const updateRoommateProfile = async (id: string, data: RoommateProfileUpdate): Promise<RoommateProfile> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating roommate profile:', error);
    throw error;
  }
};

export const deleteRoommateProfile = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting roommate profile:', error);
    throw error;
  }
};

export const uploadProfilePhoto = async (id: string, file: File): Promise<RoommateProfile> => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('profilePhoto', file);
    
    const response = await axios.post(`${API_URL}/${id}/photo`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};
