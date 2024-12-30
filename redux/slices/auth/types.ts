// types.ts
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatar?: string;
}

interface UpdatePayload {
  userId?: string;
  username?: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}

interface User {
  userId?: string;
  username?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoadingUser: boolean;
  isErrorUser: boolean;
}

export type {LoginPayload, RegisterPayload, UpdatePayload, User, AuthState};
