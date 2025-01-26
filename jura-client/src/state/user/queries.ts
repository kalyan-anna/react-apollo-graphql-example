import { gql } from "@generated/gql";
import { useQuery } from "@apollo/client";

const USERS_QUERY = gql(`
    query USERS {
        users {
            ...UserFragment
        }
    }
`);

export const useUsersQuery = () => {
  return useQuery(USERS_QUERY);
};
