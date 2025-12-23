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
    
    // Map to extract the OTHER person's details (not the current user)
    const connections: ConnectedRoommate[] = acceptedConnections.map((req: any) => {
      // Determine who is the OTHER person in the connection
      // Handle both 'sender'/'receiver' and 'senderId'/'receiverId' field names
      const sender = req.sender || req.senderId;
      const receiver = req.receiver || req.receiverId;
      let roommate;
      
      if (sender && sender._id === currentUserId) {
        // Current user is the sender, so the OTHER person is the receiver
        roommate = receiver;
      } else {
        // Current user is the receiver, so the OTHER person is the sender  
        roommate = sender;
      }
      
      console.log('Mapped roommate:', roommate);
      
      return {
        _id: roommate._id,
        name: roommate.name,
        email: roommate.email
      };
    });
    
    console.log('Final connections array:', connections);
    return connections;
  } catch (error) {
    console.error('Error fetching accepted connections:', error);
    return [];
  }
};
