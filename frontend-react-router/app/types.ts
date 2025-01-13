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

export interface postProps {
  id: number;
  author: string;
  text: string;
  likes: number;
  reposts: number;
  saves: number;
  like: boolean;
  saved: boolean;
  reposted: boolean;
  pubDate: Date;
}
