export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface Update {
  category: string;
  text: string;
}

export interface Member {
  id: string;
  name: string;
  photoUrl: string;
  subFamily: string; // Level 1: Household (e.g., "The Smith House")
  childGroup?: string; // Level 2: Branch (e.g., "The Grandkids")
  greeting: string;
  updates: Update[];
  reactions: Record<string, number>; // e.g., { '❤️': 5, '🎄': 2 }
  comments: Comment[];
}

export interface Family {
  id: string;
  name: string;
  code: string;
  adminEmail?: string;
  password?: string;
  members: Member[];
  subFamilies: string[]; // List of Household names for ordering
  isPremium: boolean;
}

export enum UserMode {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  NONE = 'NONE'
}

export interface UserSession {
  mode: UserMode;
  familyId: string | null;
}