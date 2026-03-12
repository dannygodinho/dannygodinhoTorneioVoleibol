import { Timestamp } from 'firebase/firestore';

export interface Player {
  name: string;
  studentNumber: string;
}

export interface Registration {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  teamName?: string;
  players: Player[];
  createdAt: Timestamp;
}
