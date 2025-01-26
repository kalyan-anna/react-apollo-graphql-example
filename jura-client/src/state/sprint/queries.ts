import { IssueStatus, SprintStatus } from "@generated/graphql";

import { useQuery } from "@apollo/client";
import { gql } from "@generated/gql";

export const SPRINTS_QUERY = gql(`
    query SPRINTS($projectId: String!) {
        sprints(projectId: $projectId) {
            ...SprintFragment
            issues {
                ...IssueFragment
            }
        }
    }
`);

export const useSprintsQuery = ({ projectId }: { projectId: string }) => {
  return useQuery(SPRINTS_QUERY, {
    variables: {
      projectId,
    },
  });
};

export const useUnCompletedSprintsQuery = ({ projectId }: { projectId: string }) => {
  const result = useSprintsQuery({ projectId });

  const uncompleted = result.data?.sprints
    .filter((sprint) => sprint.status !== SprintStatus.Completed)
    .sort((a, b) => {
      if (a.status === SprintStatus.Active && b.status !== SprintStatus.Active) {
        return -1;
      } else if (b.status === SprintStatus.Active && a.status !== SprintStatus.Active) {
        return 1;
      }
      return 0;
    });

  return {
    ...result,
    data: uncompleted,
  };
};

export const useCompletedSprintsQuery = ({ projectId }: { projectId: string }) => {
  const result = useSprintsQuery({ projectId });

  const completed = result.data?.sprints.filter((sprint) => sprint.status === SprintStatus.Completed);

  return {
    ...result,
    data: completed,
  };
};

export const useActiveSprintQuery = ({ projectId }: { projectId: string }) => {
  const result = useSprintsQuery({ projectId });

  const activeSprint = result.data?.sprints.find((sprint) => sprint.status === SprintStatus.Active);

  return {
    ...result,
    data: activeSprint,
  };
};

export const useActiveSprintIssuesQuery = ({ projectId, status }: { projectId: string; status: IssueStatus }) => {
  const result = useActiveSprintQuery({ projectId });

  const issues = result.data?.issues?.filter((issue) => issue.status === status);

  return {
    ...result,
    data: issues,
  };
};
