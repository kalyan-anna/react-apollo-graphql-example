import { gql } from "@generated/gql";
import { useQuery } from "@apollo/client";
import { useAuthState } from "../auth";

const USERS_QUERY = gql(`
    query USERS {
        users {
            ...UserFragment
        }
    }
`);

export const USER_QUERY = gql(`
    query USER($id: String!) {
        user(id: $id) {
            ...UserFragment
        }
    }
`);

export const useUsersQuery = () => {
  return useQuery(USERS_QUERY);
};

export const useCurrentUserQuery = () => {
  const { currentUserId } = useAuthState();
  const result = useQuery(USER_QUERY, {
    variables: {
      id: currentUserId ?? "",
    },
  });

  const firstName = result.data?.user?.name.split(" ")[0];

  return {
    ...result,
    data: {
      ...result.data,
      firstName,
    },
  };
};
