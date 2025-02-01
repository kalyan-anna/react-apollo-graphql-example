import { User } from "@generated/graphql";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type AuthState = {
  accessToken: string | undefined;
  isAuthenticated: boolean;
  currentUserId: string | undefined;
};

const authAtom = atomWithStorage<AuthState>(
  "auth-state",
  {
    accessToken: undefined,
    isAuthenticated: false,
    currentUserId: undefined,
  },
  undefined,
  { getOnInit: true }
);

export const accessTokenAtom = atom((get) => get(authAtom)?.accessToken);

const currentUserIdAtom = atom((get) => get(authAtom)?.currentUserId);

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
      currentUserId: user.id,
    });
  }
);

const clearAuthAtom = atom(null, async (_, set) => {
  set(authAtom, {
    isAuthenticated: false,
    accessToken: undefined,
    currentUserId: undefined,
  });
});

export const useAuthState = () => {
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(clearAuthAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const currentUserId = useAtomValue(currentUserIdAtom);

  return { login, logout, isAuthenticated, currentUserId };
};
