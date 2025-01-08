export interface OutletContextType {
  user: { name: string; isAuthenticated: boolean };
  setUser: React.Dispatch<
    React.SetStateAction<{ name: string; isAuthenticated: boolean }>
  >;
  login: (userName: string) => void;
  logout: () => void;
}
