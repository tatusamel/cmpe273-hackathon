import { Message } from "./Message";

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}
