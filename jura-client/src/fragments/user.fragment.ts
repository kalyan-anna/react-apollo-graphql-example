import { gql } from "@generated/gql";

export const UserFragment = gql(`
 fragment UserFragment on User {
    id
    email
    name
  }
`);
