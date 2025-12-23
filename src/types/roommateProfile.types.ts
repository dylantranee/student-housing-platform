export interface RoommateProfile {
  _id: string;
  userId: string;
  profilePhoto?: string;
  bio?: string;
  studyProgram?: string;
  university?: string;
  moveInDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  // Lifestyle Preferences
  sleepSchedule?: 'Early Bird' | 'Night Owl' | 'Flexible';
  cleanliness?: number; // 1-3
  noiseTolerance?: 'Quiet' | 'Moderate' | 'Lively';
  smoking?: 'Yes' | 'No' | 'Outside only';
  socialPreference?: 'Very social' | 'Moderate' | 'Prefer privacy';
  studyHabits?: 'Study at home' | 'Library' | 'Both';
  // Roommate Requirements
  preferredUniversities?: string[];
  roommatesWanted?: number;
  roomType?: 'Private' | 'Shared' | 'Any';
  leaseLength?: '3 months' | '6 months' | '1 year' | 'Flexible';
  status: 'draft' | 'published' | 'paused';
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
  // Match score (only present in browse results)
  matchScore?: number;
  matchBreakdown?: {
    lifestyle: number;
    budget: number;
    schedule: number;
    social: number;
    cleanliness: number;
  };
  connectionStatus?: 'pending' | 'accepted' | null;
}

export interface RoommateProfileCreate {
  userId: string;
  profilePhoto?: string;
  bio?: string;
  studyProgram?: string;
  university?: string;
  moveInDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  // Lifestyle Preferences
  sleepSchedule?: 'Early Bird' | 'Night Owl' | 'Flexible';
  cleanliness?: number;
  noiseTolerance?: 'Quiet' | 'Moderate' | 'Lively';
  smoking?: 'Yes' | 'No' | 'Outside only';
  socialPreference?: 'Very social' | 'Moderate' | 'Prefer privacy';
  studyHabits?: 'Study at home' | 'Library' | 'Both';
  // Roommate Requirements
  preferredUniversities?: string[];
  roommatesWanted?: number;
  roomType?: 'Private' | 'Shared' | 'Any';
  leaseLength?: '3 months' | '6 months' | '1 year' | 'Flexible';
  status?: 'draft' | 'published';
}

export interface RoommateProfileUpdate {
  profilePhoto?: string;
  bio?: string;
  studyProgram?: string;
  university?: string;
  moveInDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  // Lifestyle Preferences
  sleepSchedule?: 'Early Bird' | 'Night Owl' | 'Flexible';
  cleanliness?: number;
  noiseTolerance?: 'Quiet' | 'Moderate' | 'Lively';
  smoking?: 'Yes' | 'No' | 'Outside only';
  socialPreference?: 'Very social' | 'Moderate' | 'Prefer privacy';
  studyHabits?: 'Study at home' | 'Library' | 'Both';
  // Roommate Requirements
  preferredUniversities?: string[];
  roommatesWanted?: number;
  roomType?: 'Private' | 'Shared' | 'Any';
  leaseLength?: '3 months' | '6 months' | '1 year' | 'Flexible';
  status?: 'draft' | 'published' | 'paused';
}
