export interface AuthResponse<T> {
  token: string;
  user: T;
}
