import type { SidebarOptionType } from "./genericTypes";

export const sideBarList: SidebarOptionType[] = [
  {
    id: 0,
    path: "/home",
    name: "Home",
  },
  {
    id: 1,
    path: "/liked-content",
    name: "Liked Content",
  },
  {
    id: 2,
    path: "/history",
    name: "History",
  },
  {
    id: 3,
    path: "/my-videos",
    name: "My Videos",
  },
  {
    id: 4,
    path: "/tweets",
    name: "Tweets",
  },
  {
    id: 5,
    path: "/subscribers",
    name: "Subscribers",
  },
];
export const sideBarSecondaryList: SidebarOptionType[] = [
  { id: 0, path: "/support", name: "Support" },
  { id: 1, path: "/setting", name: "Setting" },
];

export const sampleuserCredentials = {
  username: "sampleuser0123",
  password: "sampleuser0123",
};
