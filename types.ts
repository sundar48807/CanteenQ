export enum TokenStatus {
  WAITING = 'WAITING',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
}

export interface Token {
  id: number;
  customerName: string;
  phoneNumber: string;
  status: TokenStatus;
  bookingTime: Date;
  statusChangeTime?: Date;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Dish {
    name: string;
    description: string;
}

export interface MenuItem {
  id: string;
  name:string;
  category: 'Sandwiches' | 'Pizza' | 'Salads' | 'Beverages';
  price: string;
  isAvailable: boolean;
}