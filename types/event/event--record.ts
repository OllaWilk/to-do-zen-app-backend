export interface NewEventEntity extends Omit<EventEntity, 'id'> {
  id?: string;
  time: Date;
}
export interface EventSimpleEntity {
  id: string;
  title: string;
  time: Date;
  price: number | 'free';
  date: string;
  location: string;
  status: 'planed' | 'ongoing' | 'completed';
}

export interface EventEntity extends EventSimpleEntity {
  description?: string;
  url: string;
  lat: number;
  lon: number;
  participants: string[];
  category: string;
  duration: string;
  reminder?: string;
}
