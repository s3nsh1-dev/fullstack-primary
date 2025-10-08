import type { SidebarOptionType, EmptyPageTextType } from "./genericTypes";

export const sideBarList: SidebarOptionType[] = [
  {
    id: 0,
    path: "/",
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

export const emptyPageText: EmptyPageTextType[] = [
  {
    id: "videos",
    logo: "",
    title: "Videos",
    heading: "No videos uploaded",
    description:
      "This page has yet to upload a video. Search another page in order to find more videos.",
  },
  {
    id: "playlists",
    logo: "",
    title: "Playlists",
    heading: "No playlist created",
    description: "There are no playlist created on this channel.",
  },
  {
    id: "tweets",
    logo: "",
    title: "Tweets",
    heading: "No Tweets",
    description: "This channel has yet to make a Tweet.",
  },
  {
    id: "subscribed",
    logo: "",
    title: "Subscribed",
    heading: "No people subscribers",
    description: "This channel has yet to subscribe a new channel.",
  },
];
