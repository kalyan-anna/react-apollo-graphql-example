import { gql } from "@generated/gql";
import { useQuery } from "@apollo/client";

export const BACKLOG_ISSUES_QUERY = gql(`
  query BACKLOG_ISSUES($projectId: String!) {
      issues(projectId: $projectId, sprintId: null) {
          ...IssueFragment
      }
    }
  `);

export const useBacklogIssuesQuery = (projectId: string) => {
  return useQuery(BACKLOG_ISSUES_QUERY, {
    variables: {
      projectId,
    },
  });
};
