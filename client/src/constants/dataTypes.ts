export interface UserLoginAuthDataType {
  user: UserLoginType;
  accessToken: string;
  refreshToken: string;
  loggedIn: boolean;
}

export interface RegistrationFormType {
  fullname: string;
  username: string;
  email: string;
  password: string;
  avatar?: File | null;
  coverImage?: File | null;
}

export interface LoginCredentialType {
  username: string;
  password: string;
}

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

export type PlaylistType = {
  _id: string;
  name: string;
  description: string;
  videos: VideoType[]; // already populated with objects
  createdAt: string; // ISO date string
};

export type LikedType = VideoLike | CommentLike | TweetLike;

export interface BaseLike {
  _id: string;
  likedBy: string;
  updatedAt: string; // ISO date string
}

// ================= VIDEO LIKE =================
export interface VideoLike extends BaseLike {
  video: {
    _id: string;
    owner: MinimalUserType;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    views: number;
  };
  comment?: never;
  tweet?: never;
}

export interface CommentLike extends BaseLike {
  comment: {
    _id: string;
    content: string;
    video: {
      _id: string;
      owner: MinimalUserType;
      thumbnail: string;
      title: string;
      duration: number;
    };
    owner: MinimalUserType;
  };
  video?: never;
  tweet?: never;
}
export interface TweetLike extends BaseLike {
  tweet: {
    _id: string;
    content: string;
    owner: MinimalUserType;
  };
  video?: never;
  comment?: never;
}
export interface MinimalUserType {
  _id: string;
  fullname?: string;
  username?: string;
  avatar: string;
}
export interface TweetType {
  _id: string;
  content: string;
  owner: string; // MinimalUserType Id reference
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export type VideoType = {
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
  ownerDetails?: MinimalUserType[];
};
export interface VideoPaginationType {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface UserSubscriberListType {
  _id: string;
  subscriber: MinimalUserType; // userId
  channel: string; // channelId
  createdAt: string; // ISO date
}

export type SubscriberType = {
  _id: string;
  subscriber_id: string;
  avatar: string;
  fullname: string;
  username: string;
  subscribedAt: string; // ISO date string
};
