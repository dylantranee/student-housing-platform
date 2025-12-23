import { request } from '../util/request';
import type { RoommateProfile } from '../types/roommateProfile.types';

export const browseRoommates = async (): Promise<RoommateProfile[]> => {
  return request<RoommateProfile[]>('/api/roommate-profile/browse');
};
