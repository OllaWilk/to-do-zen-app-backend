export interface UserEntity {
  id?: string;
  username?: string | null;
  email: string;
  created_at?: Date;
  password_hash: string;
}
