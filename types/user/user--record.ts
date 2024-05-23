export interface UserEntity {
  id?: string;
  username: string;
  email: string;
  created_at?: Date;
  password_hash: string;
}
