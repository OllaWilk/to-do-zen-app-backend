export interface UserToken {
  token?: string;
}

export interface UserEntity extends UserEntityForm {
  id?: string;
  created_at?: Date;
}

export interface UserEntityForm {
  username?: string | null;
  email: string;
  password: string;
}

export interface CompleteUserEntity extends UserEntity, UserToken {}
