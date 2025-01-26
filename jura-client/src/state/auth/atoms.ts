import { User } from "@generated/graphql";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type AuthState = {
  accessToken: string | undefined;
  isAuthenticated: boolean;
  currentUser: User | undefined;
};

const authAtom = atomWithStorage<AuthState>(
  "auth-state",
  {
    accessToken: undefined,
    isAuthenticated: false,
    currentUser: undefined,
  },
  undefined,
  { getOnInit: true }
);

export const accessTokenAtom = atom((get) => get(authAtom)?.accessToken);

const currentUserAtom = atom((get) => get(authAtom)?.currentUser);

const authUserFirstNameAtom = atom((get) => {
  const user = get(authAtom)?.currentUser;
  return user?.name.split(" ")[0];
});

const isAuthenticatedAtom = atom((get) => get(authAtom)?.isAuthenticated);

const loginAtom = atom(
  null,
  async (
    _,
    set,
    {
      accessToken,
      user,
    }: {
      accessToken: string;
      user: User;
    }
  ) => {
    set(authAtom, {
      isAuthenticated: true,
      accessToken,
      currentUser: user,
    });
  }
);

const clearAuthAtom = atom(null, async (_, set) => {
  set(authAtom, {
    isAuthenticated: false,
    accessToken: undefined,
    currentUser: undefined,
  });
});

export const useAuthState = () => {
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(clearAuthAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const authUserFirstName = useAtomValue(authUserFirstNameAtom);
  const currentUser = useAtomValue(currentUserAtom);

  return { login, logout, isAuthenticated, authUserFirstName, currentUser };
};
