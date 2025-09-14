export interface UserLoginType {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  watchHistory: string[]; // can refine if you know the type of items in history
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v?: number;
}

export interface UserLoginAuthDataType {
  user: UserLoginType;
  accessToken: string;
  refreshToken: string;
}

export interface UserLoginResponseType {
  statusCode: number;
  data: UserLoginAuthDataType;
  message: string;
  success: boolean;
}
