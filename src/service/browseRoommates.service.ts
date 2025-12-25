import { request } from '../util/request';
import type { RoommateProfile } from '../types/roommateProfile.types';

export interface BrowseRoommatesResponse {
  profiles: RoommateProfile[];
  requiresProfile?: boolean;
  message?: string;
}

export const browseRoommates = async (strategy: string = 'balanced'): Promise<BrowseRoommatesResponse> => {
  const res = await request<any>(`/api/roommate-profile/browse?strategy=${strategy}`);
  
  // Backward compatibility: If it returns an array directly
  if (Array.isArray(res)) {
    return { profiles: res };
  }
  
  // New format: { profiles: [], requiresProfile: true, ... }
  return {
    profiles: res.profiles || [],
    requiresProfile: res.requiresProfile || false,
    message: res.message
  };
};
