export interface AuthToken {
  id: string;
  userId: string;
  sign_date: Date;
}

export const AuthToken = "_auth_token";
