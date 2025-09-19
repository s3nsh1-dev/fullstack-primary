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
export interface ChildrenProps {
  children: React.ReactNode;
}

export type IsViewerType = {
  isViewer: boolean;
  toggleViewer: () => void;
};

export type SidebarOptionType = {
  id: number;
  path: string;
  name: string;
};

export type EmptyPageTextType = {
  id: string;
  logo: string;
  title: string;
  heading: string;
  description: string;
};
