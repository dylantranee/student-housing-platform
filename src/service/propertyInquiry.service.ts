import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/property-inquiries`;

// Helper function to get auth token
const getAuthToken = (): string => {
  let token = localStorage.getItem('access_token') || '';
  if (!token) {
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (match) token = match[1];
  }
  return token;
};

export interface PropertyInquiry {
  _id: string;
  propertyId: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  message: string;
  moveInDate: string;
  status: 'pending' | 'contacted' | 'viewed' | 'rejected';
  linkedRoommateId?: string;
  linkedRoommateName?: string;
  linkedRoommateEmail?: string;
  linkedRoommatePhone?: string;
  linkedRoommateConfirmed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InquirySubmission {
  propertyId: string;
  message: string;
  moveInDate: string;
  tenantPhone?: string;
  linkedRoommateId?: string;
}

export const submitInquiry = async (data: InquirySubmission): Promise<PropertyInquiry> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(API_URL, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.inquiry;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
};

export const getMyInquiries = async (): Promise<PropertyInquiry[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/my-inquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my inquiries:', error);
    throw error;
  }
};

export const getPropertyInquiries = async (propertyId: string): Promise<PropertyInquiry[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/property/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching property inquiries:', error);
    throw error;
  }
};

export const confirmLinkedInquiry = async (inquiryId: string): Promise<PropertyInquiry> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${inquiryId}/confirm`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.inquiry;
  } catch (error) {
    console.error('Error confirming linked inquiry:', error);
    throw error;
  }
};

export const checkExistingInquiry = async (propertyId: string): Promise<PropertyInquiry | null> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/my-inquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Find an inquiry for this specific property
    const inquiries = Array.isArray(response.data) ? response.data : [];
    const existing = inquiries.find((inq: any) => 
      (inq.propertyId?._id === propertyId || inq.propertyId === propertyId)
    );
    
    return existing || null;
  } catch (error) {
    console.error('Error checking existing inquiry:', error);
    return null;
  }
};

export const withdrawInquiry = async (inquiryId: string): Promise<PropertyInquiry> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(`${API_URL}/${inquiryId}/withdraw`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.inquiry;
  } catch (error) {
    console.error('Error withdrawing inquiry:', error);
    throw error;
  }
};
