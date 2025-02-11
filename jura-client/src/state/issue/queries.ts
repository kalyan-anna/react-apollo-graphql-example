import { gql } from '@generated/gql';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

export const BACKLOG_ISSUES_QUERY = gql(`
    query BACKLOG_ISSUES($projectId: String!) {
      issues(projectId: $projectId, sprintId: null) {
          ...IssueFragment
      }
    }
`);

export const PROJECT_ISSUES_COUNT = gql(`
  query PROJECT_ISSUES_COUNT {
    projectIssuesCount {
      projectId
      issuesCount
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
    [data?.issues],
  );

  return {
    ...result,
    data: {
      ...data,
      issues: sortedIssues,
    },
  };
};

export const useProjectIssuesCount = () => {
  return useQuery(PROJECT_ISSUES_COUNT);
};

export const useIssuesCountByProjectId = (projectId: string) => {
  const { data, ...result } = useQuery(PROJECT_ISSUES_COUNT);
  return useMemo(() => {
    const filteredData = data?.projectIssuesCount.find(data => data.projectId === projectId);
    return {
      ...result,
      data: filteredData?.issuesCount,
    };
  }, [data?.projectIssuesCount, projectId, result]);
};
