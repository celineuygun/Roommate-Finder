import type { User } from './user';

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  listing: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}