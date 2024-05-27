export interface UserEntity extends UserEntityForm {
  id?: string;
  created_at?: Date;
}

export interface UserEntityForm {
  username?: string | null;
  email: string;
  password: string;
}
