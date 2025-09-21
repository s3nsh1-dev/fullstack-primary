import type {
  TweetType,
  UserLoginAuthDataType,
  LikedType,
  VideoType,
  VideoPaginationType,
  UserSubscriberListType,
} from "./dataTypes";

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

export interface UserVideosAPIResponse {
  statusCode: number;
  data: {
    videos: VideoType[];
    pagination: VideoPaginationType;
  };
  message: string;
  success: boolean;
}

export interface UserSubscribersAPIResponse {
  statusCode: number;
  data: {
    subscribers: UserSubscriberListType[];
    length: number;
  };
  message: string;
  success: boolean;
}
