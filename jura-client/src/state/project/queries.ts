import { useApolloClient, useFragment, useQuery } from "@apollo/client";
import { gql } from "@generated/gql";
import { useAuthState } from "../auth";
import { ProjectFragment } from "../../fragments/project.fragment";
import { useMemo } from "react";

const PROJECTS_QUERY = gql(`
    query PROJECTS {
        projects {
           ...ProjectFragment
        }
    }
  `);

export const useProjectsQuery = () => {
  const result = useQuery(PROJECTS_QUERY);
  const { currentUserId } = useAuthState();

  return useMemo(() => {
    const ownedProjects = result?.data?.projects?.filter((project) => project.ownerId === currentUserId) ?? [];
    const otherProjects = result?.data?.projects?.filter((project) => project.ownerId !== currentUserId) ?? [];

    return {
      ...result,
      data: result.data,
      ownedProjects,
      otherProjects,
    };
  }, [result, currentUserId]);
};

export const useProjectQuery = (id: string) => {
  const result = useProjectsQuery();

  return useMemo(() => {
    const matchingProj = result.data?.projects.find((p) => p.id === id);

    return {
      ...result,
      data: matchingProj,
    };
  }, [id, result]);
};

// Just an example.
// this is useless - no network call
export const useProjectFragment = (id: string) => {
  return useFragment({
    fragment: ProjectFragment,
    fragmentName: "ProjectFragment",
    from: {
      __typename: "Project",
      id,
    },
  });
};

// Just an example.
// this is useless - no re-rendering
export const useProjectByIdFromCache = (projectId: string) => {
  const client = useApolloClient();
  const cachedProjects = client.readQuery({ query: PROJECTS_QUERY });
  const project = cachedProjects?.projects?.find((project) => project.id === projectId);
  return project;
};
