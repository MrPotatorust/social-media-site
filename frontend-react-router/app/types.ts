import type { NavigateFunction } from "react-router";

export interface OutletContextType {
  user: { name: string; isAuthenticated: boolean };
  setUser: React.Dispatch<
    React.SetStateAction<{ name: string; isAuthenticated: boolean }>
  >;
  login: (userName: string) => void;
  logout: () => void;
  routePrivacy: (routeAuth: RouteAuthType, navigate: NavigateFunction) => void;
}

export interface RouteAuthType {
  isPrivate: boolean;
  showAuthenticated: boolean;
}

export interface RouteListType {
  [key: string]: {
    routeAuth: RouteAuthType;
    path: string | null;
    file: string;
  };
}

export interface postData {
  id: number;
  author: string;
  text: string;
  like_count: number;
  dislike_count: number;
  repost_count: number;
  save_count: number;
  liked: boolean;
  saved: boolean;
  reposted: boolean;
  disliked: boolean;
  pub_date: string;
}
export interface postType {
  postData: postData;
}
