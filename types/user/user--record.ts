export interface UserEntity {
  id: string;
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface NewUserEntity extends Omit<UserEntity, 'id'> {
  id?: string;
}
