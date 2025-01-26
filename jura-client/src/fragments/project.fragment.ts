import { gql } from "@generated/gql";

export const ProjectFragment = gql(`
 fragment ProjectFragment on Project {
    id
    name
    ownerId
    subTitle
  }
`);
