export interface LoginResult {
  token: string;
  platformUserId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface PlatformUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
}
