import { gql } from "@generated/gql";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const BACKLOG_ISSUES_QUERY = gql(`
  query BACKLOG_ISSUES($projectId: String!) {
      issues(projectId: $projectId, sprintId: null) {
          ...IssueFragment
      }
    }
  `);

export const useBacklogIssuesQuery = (projectId: string) => {
  const { data, ...result } = useQuery(BACKLOG_ISSUES_QUERY, {
    variables: {
      projectId,
    },
  });

  const sortedIssues = useMemo(
    () => [...(data?.issues ?? [])].sort((a, b) => a.orderIndex - b.orderIndex),
    [data?.issues]
  );

  return {
    ...result,
    data: {
      ...data,
      issues: sortedIssues,
    },
  };
};
