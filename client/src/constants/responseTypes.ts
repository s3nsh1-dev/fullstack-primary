import type {
  TweetType,
  UserLoginAuthDataType,
  LikedType,
  // VideoType,
  // VideoPaginationType,
  UserSubscriberListType,
} from "./dataTypes";
import type { DeleteOneResponse } from "./genericTypes";

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
    videos: {
      _id: string;
      videoFile: string;
      thumbnail: string;
      title: string;
      description: string;
      duration: number;
      isPublished?: boolean;
      views?: number;
      createdAt?: string; // ISO date string
      updatedAt?: string; // ISO date string
      __v?: number;
      owner?: string;

      ownerDetails?: {
        _id: string;
        username: string;
        fullname: string;
        avatar: string;
      }[];
    }[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
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
export type DeleteOneApiResponse = {
  statusCode: number;
  data: DeleteOneResponse;
  message: string;
  success: boolean;
};
