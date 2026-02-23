import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const API_URL = `${API_BASE_URL}/match-requests`;

const getAuthToken = (): string => {
  let token = localStorage.getItem('access_token') || '';
  if (!token) {
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (match) token = match[1];
  }
  return token;
};

export interface SendRequestData {
  receiverId: string;
  message: string;
  propertyLink?: string;
}

export interface MatchRequest {
  _id: string;
  senderId: any;
  receiverId: any;
  message: string;
  propertyLink?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
  otherUserProfile?: {
    profilePhoto?: string;
    university?: string;
  };
}

export interface MyRequestsData {
  incoming: MatchRequest[];
  outgoing: MatchRequest[];
}

export const sendMatchRequest = async (data: SendRequestData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending match request:', error);
    throw error;
  }
};

export const cancelMatchRequest = async (requestId: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${requestId}/cancel`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling match request:', error);
    throw error;
  }
};

export const getMyRequests = async (): Promise<MyRequestsData> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/my-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching match requests:', error);
    throw error;
  }
};

export const respondToMatchRequest = async (requestId: string, status: 'accepted' | 'declined') => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${requestId}/respond`, { status }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error responding to match request:', error);
    throw error;
  }
};
