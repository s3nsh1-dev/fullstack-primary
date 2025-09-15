import type { UserLoginAuthDataType } from "./dataTypes";

export type ModeType = boolean;

export type ModeContextType = {
  mode: ModeType;
  changeMode: () => void;
};

export type AuthContextType = {
  user: UserLoginAuthDataType | null;
  login: (userData: UserLoginAuthDataType) => void;
  logout: () => void;
};
export type AuthContextProviderType = {
  children: React.ReactNode;
};
