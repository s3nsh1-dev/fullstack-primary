import type { UserLoginType } from "./dataTypes";

export type ModeType = boolean;

export type ModeContextType = {
  mode: ModeType;
  changeMode: () => void;
};

export type AuthContextType = {
  user: UserLoginType | null;
  login: (userData: UserLoginType) => void;
  logout: () => void;
};
export type AuthContextProviderType = {
  children: React.ReactNode;
};
