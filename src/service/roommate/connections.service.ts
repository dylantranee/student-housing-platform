import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';

const API_URL = `${API_BASE_URL}/match-requests`;

// Helper function to get auth token
const getAuthToken = (): string => {
  let token = localStorage.getItem('access_token') || '';
  if (!token) {
    const match = document.cookie.match(/access_token=([^;]+)/);
    if (match) token = match[1];
  }
  return token;
};

export interface ConnectedRoommate {
  _id: string;
  name: string;
  email: string;
}

export const getAcceptedConnections = async (): Promise<ConnectedRoommate[]> => {
  try {
    const token = getAuthToken();
    
    // First, get current user's ID
    const userResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const currentUserId = userResponse.data.data?._id || userResponse.data._id;
    console.log('Current user ID:', currentUserId);
    
    // Then get all match requests
    const response = await axios.get(`${API_URL}/my-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Match requests API response:', response.data);
    
    // Backend returns {outgoing: [...], incoming: [...]}
    const outgoing = response.data.outgoing || [];
    const incoming = response.data.incoming || [];
    const requests = [...outgoing, ...incoming];
    
    console.log('Extracted requests array:', requests);
    
    // Filter for accepted connections only
    const acceptedConnections = requests.filter((req: any) => req.status === 'accepted');
    console.log('Accepted connections:', acceptedConnections);
    
    const connections: ConnectedRoommate[] = acceptedConnections.map((req: any) => {
      // The backend returns populated senderId/receiverId
      // In outgoing requests, receiverId is populated. In incoming, senderId is populated.
      // We want the one that is NOT the current user.
      
      const senderId = typeof req.senderId === 'object' ? req.senderId._id : req.senderId;
      
      const isSender = senderId.toString() === currentUserId.toString();
      const roommate = isSender ? req.receiverId : req.senderId;
      
      console.log('Mapped roommate:', roommate);
      
      return {
        _id: typeof roommate === 'object' ? roommate._id : roommate,
        name: roommate.name || 'Roommate',
        email: roommate.email || ''
      };
    });
    
    console.log('Final connections array:', connections);
    return connections;
  } catch (error) {
    console.error('Error fetching accepted connections:', error);
    return [];
  }
};
