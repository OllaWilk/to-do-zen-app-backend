export interface NewEventEntity
  extends Omit<EventEntity, 'id' | 'created_at'> {}

export interface EventSimpleEntity {
  id: string;
  title: string;
  status: 'planed' | 'ongoing' | 'completed';
  created_at: Date;
  price?: number | null;
  date?: Date | null;
  description?: string;
}

export interface EventEntity extends EventSimpleEntity {
  // url?: string;
  lat?: number | null;
  lon?: number | null;
  category: string;
  duration?: string;
  reminder?: number | null;
  creator_id: string;
}
