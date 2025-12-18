export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  verificationCode: string;
  userData?: {
    username: string;
    password: string;
    email: string;
  } | null;
}

export interface UpdatePayload {
  username: string;
  avatar: string;
  description: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface FacebookLoginPayload {
  userId: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  description: string;
  createdAt: Date;
}
export interface UserState {
  ListUser: User[];
  isLoadingUser: boolean;
  isErrorUser: boolean;
}
export interface AuthState {
  user: User | null;
  viewedUser: User | null;
  isLoadingUser: boolean;
  isErrorUser: boolean;
}
