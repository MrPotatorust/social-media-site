import type { NavigateFunction } from "react-router";

export interface OutletContextType {
  user: { name: string; isAuthenticated: boolean };
  setUser: React.Dispatch<
    React.SetStateAction<{ name: string; isAuthenticated: boolean }>
  >;
  login: (userName: string) => void;
  logout: () => void;
  routePrivacy: (routeAuth: routeAuthType, navigate: NavigateFunction) => void;
}

export interface routeAuthType {
  isPrivate: boolean;
  showAuthenticated: boolean;
}

export interface routeListType {
  [key: string]: {
    routeAuth: routeAuthType;
    path: string | null;
    file: string;
  };
}
