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
  loggedIn: boolean;
}

export interface UserLoginResponseType {
  statusCode: number;
  data: UserLoginAuthDataType;
  message: string;
  success: boolean;
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

export type SubscriberType = {
  _id: string;
  subscriber_id: string;
  avatar: string;
  fullname: string;
  username: string;
  subscribedAt: string; // ISO date string
};

export type VideoType = {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string; // ISO date string
};

export type TweetType = {
  _id: string;
  content: string;
  createdAt: string; // ISO date string
};

export type PlaylistType = {
  _id: string;
  name: string;
  description: string;
  videos: VideoType[]; // already populated with objects
  createdAt: string; // ISO date string
};

export type HomePageFormatType = {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  createdAt: string; // ISO date string
  subscribers: SubscriberType[];
  videos: VideoType[];
  tweets: TweetType[];
  playlists: PlaylistType[];
};

export interface LikedContentResponseType {
  statusCode: number;
  data: {
    likes: LikedType[];
  };
  message: string;
  success: boolean;
}

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
    owner: User;
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

// ================= COMMENT LIKE =================
export interface CommentLike extends BaseLike {
  comment: {
    _id: string;
    content: string;
    video: {
      _id: string;
      owner: User;
      thumbnail: string;
      title: string;
      duration: number;
    };
    owner: User;
  };
  video?: never;
  tweet?: never;
}

// ================= TWEET LIKE =================
export interface TweetLike extends BaseLike {
  tweet: {
    _id: string;
    content: string;
    owner: User;
  };
  video?: never;
  comment?: never;
}

// ================= USER =================
export interface User {
  _id: string;
  fullname: string;
  avatar: string;
}
