import { useApolloClient, useFragment, useQuery } from "@apollo/client";
import { gql } from "@generated/gql";
import { useAuthState } from "../auth";
import { ProjectFragment } from "../../fragments/project.fragment";

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

  const ownedProjects = result?.data?.projects.filter((project) => project.ownerId === currentUserId) || [];

  const otherProjects = result?.data?.projects.filter((project) => project.ownerId !== currentUserId) || [];

  return {
    ...result,
    ownedProjects,
    otherProjects,
  };
};

export const useProjectQuery = (id: string) => {
  const result = useProjectsQuery();
  const matchingProj = result.data?.projects.find((p) => p.id === id);
  return { ...result, data: matchingProj };
};

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

// this is useless - no re-rendering
export const useProjectByIdFromCache = (projectId: string) => {
  const client = useApolloClient();
  const cachedProjects = client.readQuery({ query: PROJECTS_QUERY });
  const project = cachedProjects?.projects?.find((project) => project.id === projectId);
  return project;
};
