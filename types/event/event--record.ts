export interface NewEventEntity extends Omit<EventEntity, 'id'> {
  id?: string;
  created_at: Date;
}

export interface EventSimpleEntity {
  id?: string;
  title: string;
  created_at: Date;
  price: number | 'free';
  date?: Date;
  status: 'planed' | 'ongoing' | 'completed';
}

export interface EventEntity extends EventSimpleEntity {
  description?: string;
  url?: string;
  lat?: number;
  lon?: number;
  category: string;
  duration?: string;
  reminder?: number;
  creator_id: string;
}
