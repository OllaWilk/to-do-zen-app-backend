export type EventStatus = 'planned' | 'ongoing' | 'completed';

export interface NewEventEntity
  extends Omit<EventEntity, 'id' | 'created_at'> {}

export interface EventSimpleEntity {
  readonly id: string;
  readonly created_at: Date;
  title: string;
  status: EventStatus;
  price?: number | null;
  event_date?: Date | null;
  description?: string;
  lat?: number | null;
  lon?: number | null;
}

export interface EventEntity extends EventSimpleEntity {
  url?: string;
  category: string;
  duration?: string;
  reminder?: number | null;
  creator_id: string;
}

export interface EventTitleSearch {
  title: string;
}
