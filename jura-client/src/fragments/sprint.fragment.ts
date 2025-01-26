import { gql } from "@generated/gql";

export const SprintFragment = gql(`
 fragment SprintFragment on Sprint {
    id
    name
    goal
    status
    startDate
    endDate
    projectId
  }
`);
