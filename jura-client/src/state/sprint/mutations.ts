import { MutationFunctionOptions, MutationResult, useApolloClient, useMutation } from '@apollo/client';
import { gql } from '@generated/gql';
import {
  CreateSprintMutation,
  Issue,
  SprintCreateInput,
  SprintStatus,
  UpdateSprintMutation,
  UpdateSprintMutationVariables
} from '@generated/graphql';
import { useParams } from 'react-router';
import { sprintDialog } from '../ui-dialog';
import { SPRINTS_QUERY } from './queries';
import { useCallback } from 'react';
import { SprintFragment } from '../../fragments/sprint.fragment';

const CREATE_SPRINT_MUTATION = gql(`
    mutation CreateSprint($input: SprintCreateInput!) {
        createSprint(sprintCreateInput: $input) {
            ...SprintFragment
        }
    }
`);

const UPDATE_SPRINT_MUTATION = gql(`
    mutation UpdateSprint($input: SprintUpdateInput!) {
        updateSprint(sprintUpdateInput: $input) {
            ...SprintFragment
        }
    }
`);

export const useCreateSprintMutation = (): [
  (data: SprintCreateInput) => void,
  MutationResult<CreateSprintMutation>
] => {
  const [createSprint, result] = useMutation(CREATE_SPRINT_MUTATION);
  const { closeDialog } = sprintDialog.useDialogState();
  const { projectId = '' } = useParams();

  const createSprintCb = useCallback(
    (data: SprintCreateInput) => {
      createSprint({
        variables: {
          input: {
            ...data
          }
        },
        onCompleted: closeDialog,
        refetchQueries: [{ query: SPRINTS_QUERY, variables: { projectId } }]
      });
    },
    [closeDialog, createSprint, projectId]
  );

  return [createSprintCb, result];
};

type MutationOptions = Omit<MutationFunctionOptions<UpdateSprintMutation, UpdateSprintMutationVariables>, 'variables'>;

export const useCompleteSprintMutation = (): [
  (sprintId: string, options?: MutationOptions) => void,
  MutationResult<UpdateSprintMutation>
] => {
  const [updateSprint, result] = useMutation(UPDATE_SPRINT_MUTATION);

  const updateSprintCb = useCallback(
    (sprintId: string, options?: MutationOptions) => {
      updateSprint({
        variables: {
          input: {
            id: sprintId,
            status: SprintStatus.Completed
          }
        },
        ...options
      });
    },
    [updateSprint]
  );

  return [updateSprintCb, result];
};

export const useStartSprintMutation = (): [(sprintId: string) => void, MutationResult<UpdateSprintMutation>] => {
  const [updateSprint, result] = useMutation(UPDATE_SPRINT_MUTATION);

  const updateSprintCb = useCallback(
    (sprintId: string) => {
      updateSprint({
        variables: {
          input: {
            id: sprintId,
            status: SprintStatus.Active
          }
        }
      });
    },
    [updateSprint]
  );

  return [updateSprintCb, result];
};

export const useUpdateSprintIssuesCache = () => {
  const client = useApolloClient();

  const updateSprintIssuesCacheCb = useCallback(
    ({ sprintId, issues }: { sprintId: string; issues: Issue[] }) => {
      const sprint = client.readFragment({
        id: `Sprint:${sprintId}`,
        fragment: SprintFragment
      });
      if (sprint) {
        client.cache.modify({
          id: client.cache.identify(sprint),
          fields: {
            issues() {
              return issues;
            }
          },
          broadcast: true
        });
      }
    },
    [client]
  );

  return { updateSprintIssuesCache: updateSprintIssuesCacheCb };
};
