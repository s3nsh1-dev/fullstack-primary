import type { TweetType, UserLoginAuthDataType, LikedType } from "./dataTypes";

export interface UserTweetsAPIResponse {
  statusCode: number;
  data: {
    tweets: TweetType[];
  };
  message: string;
  success: boolean;
}

export interface UserLoginResponseType {
  statusCode: number;
  data: UserLoginAuthDataType;
  message: string;
  success: boolean;
}
export interface LikedContentResponseType {
  statusCode: number;
  data: {
    likes: LikedType[];
  };
  message: string;
  success: boolean;
}
