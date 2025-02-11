import { MutationResult, Reference, useApolloClient, useMutation } from '@apollo/client';
import { gql } from '@generated/gql';
import {
  CreateIssueMutation,
  DeleteIssueMutation,
  Issue,
  IssueCreateInput,
  IssueStatus,
  IssueUpdateInput,
  UpdateIssueMutation
} from '@generated/graphql';
import { useParams } from 'react-router';
import { IssueFragment } from '../../fragments/issue.fragment';
import { SPRINTS_QUERY } from '../sprint';
import { issueDialog } from '../ui-dialog';
import { useToastState } from '../ui-toast';
import { BACKLOG_ISSUES_QUERY } from './queries';
import { useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { useUpdateSprintIssuesCache } from '../sprint/mutations';

const UPDATE_ISSUE_MUTATION = gql(`
    mutation UpdateIssue($input: IssueUpdateInput!) {
        updateIssue(issueUpdateInput: $input) {
            ...IssueFragment
        }
    }
`);

const CREATE_ISSUE_MUTATION = gql(`
  mutation CreateIssue($input: IssueCreateInput!) {
      createIssue(issueCreateInput: $input) {
          ...IssueFragment
      }
  }
`);

const DELETE_ISSUE_MUTATION = gql(`
  mutation DeleteIssue($id: String!) {
      deleteIssue(id: $id)
  }
`);

export const useUpdateIssueMutation = ({
  showNotificationOnUpdate = true
}: {
  showNotificationOnUpdate?: boolean;
} = {}): [(data: IssueUpdateInput, oldIssue?: Issue) => void, MutationResult<UpdateIssueMutation>] => {
  const [updateIssue, result] = useMutation(UPDATE_ISSUE_MUTATION);
  const { closeDialog } = issueDialog.useDialogState();
  const { projectId = '' } = useParams();
  const { addToast } = useToastState();

  const updateIssueCb = useCallback(
    (data: IssueUpdateInput, oldIssue?: Issue) => {
      updateIssue({
        variables: {
          input: {
            ...data
          }
        },
        onCompleted: () => {
          closeDialog();
          if (showNotificationOnUpdate) {
            addToast(`${oldIssue?.issueNumber} has been updated.`);
          }
        },
        refetchQueries: () => {
          return oldIssue?.sprintId !== data?.sprintId
            ? [
                { query: SPRINTS_QUERY, variables: { projectId } },
                { query: BACKLOG_ISSUES_QUERY, variables: { projectId } }
              ]
            : [];
        }
      });
    },
    [addToast, closeDialog, projectId, showNotificationOnUpdate, updateIssue]
  );

  return [updateIssueCb, result];
};

export const useUpdateIssueOrderMutation = (): [
  ({ activeIssueId, overIssueId, issues }: { activeIssueId: string; overIssueId: string; issues: Issue[] }) => void,
  MutationResult<UpdateIssueMutation>
] => {
  const [updateIssue, result] = useMutation(UPDATE_ISSUE_MUTATION);
  const { updateSprintIssuesCache } = useUpdateSprintIssuesCache();

  const updateIssueOrderCb = useCallback(
    ({ activeIssueId, overIssueId, issues }: { activeIssueId: string; overIssueId: string; issues: Issue[] }) => {
      const activeIssueIndex = issues?.findIndex(issue => issue.id === activeIssueId);
      const overIssueIndex = issues?.findIndex(issue => issue.id === overIssueId);
      const updatedIssues = arrayMove(issues ?? [], activeIssueIndex, overIssueIndex);

      const activeIssueNewIndex = updatedIssues?.findIndex(issue => issue.id === activeIssueId);
      const precedingIssue = updatedIssues[activeIssueNewIndex - 1];
      const nextIssue = updatedIssues[activeIssueNewIndex + 1];
      const activeIssue = updatedIssues[activeIssueNewIndex];
      let newOrderIndex = 1;

      if (precedingIssue && nextIssue) {
        newOrderIndex = (precedingIssue?.orderIndex + nextIssue?.orderIndex) / 2;
      } else if (!precedingIssue && nextIssue) {
        newOrderIndex = nextIssue.orderIndex / 2;
      } else if (!nextIssue && precedingIssue) {
        newOrderIndex = precedingIssue.orderIndex + 1;
      }

      if (activeIssue.sprintId) {
        const updatedIssuesWithOrder = updatedIssues.map(issue => {
          if (issue.id === activeIssueId) {
            return {
              ...issue,
              orderIndex: newOrderIndex
            };
          }
          return issue;
        });
        updateSprintIssuesCache({ sprintId: activeIssue.sprintId, issues: updatedIssuesWithOrder });
      }

      updateIssue({
        variables: {
          input: {
            id: activeIssue.id,
            orderIndex: newOrderIndex
          }
        },
        optimisticResponse: {
          updateIssue: {
            ...activeIssue,
            orderIndex: newOrderIndex
          }
        }
      });
    },
    [updateIssue, updateSprintIssuesCache]
  );

  return [updateIssueOrderCb, result];
};

export const useCreateIssueMutation = (): [(data: IssueCreateInput) => void, MutationResult<CreateIssueMutation>] => {
  const [createIssue, result] = useMutation(CREATE_ISSUE_MUTATION);
  const { closeDialog } = issueDialog.useDialogState();
  const { addToast } = useToastState();

  const createIssueCb = useCallback(
    (data: IssueCreateInput) => {
      createIssue({
        variables: {
          input: {
            ...data
          }
        },
        onCompleted: data => {
          closeDialog();
          addToast(`${data.createIssue.issueNumber} has been added.`);
        },
        update: (cache, { data }) => {
          const newIssue = data?.createIssue;

          if (!newIssue || !newIssue.id) {
            console.error('Invalid data returned from createIssue mutation');
            return;
          }

          if (newIssue.sprintId) {
            cache.modify({
              id: cache.identify({
                __typename: 'Sprint',
                id: newIssue.sprintId
              }),
              fields: {
                issues(existingIssues = []) {
                  const newIssueRef = cache.writeFragment({
                    data: newIssue,
                    fragment: IssueFragment,
                    fragmentName: 'IssueFragment'
                  });
                  return [...existingIssues, newIssueRef];
                }
              }
            });
          } else {
            cache.modify({
              fields: {
                issues(existingIssues = [], { readField }) {
                  const newIssueRef = cache.writeFragment({
                    data: newIssue,
                    fragment: IssueFragment,
                    fragmentName: 'IssueFragment'
                  });

                  // Avoid adding duplicates
                  const isDuplicate = existingIssues.some((issueRef: Reference) => readField('id', issueRef) === newIssue.id);

                  if (isDuplicate) return existingIssues;

                  return [...existingIssues, newIssueRef];
                }
              }
            });
          }
        }
      });
    },
    [addToast, closeDialog, createIssue]
  );

  return [createIssueCb, result];
};

export const useDeleteIssueMutation = (): [(data?: Issue) => void, MutationResult<DeleteIssueMutation>] => {
  const [deleteIssue, result] = useMutation(DELETE_ISSUE_MUTATION);
  const { closeDialog } = issueDialog.useDialogState();
  const { addToast } = useToastState();

  const deleteIssueCb = useCallback(
    (issue?: Issue) => {
      deleteIssue({
        variables: {
          id: issue?.id ?? ''
        },
        onCompleted: () => {
          closeDialog();
          addToast(`${issue?.issueNumber} has been deleted.`);
        },
        update: cache => {
          if (issue?.sprintId) {
            cache.modify({
              id: cache.identify({
                __typename: 'Sprint',
                id: issue?.sprintId
              }),
              fields: {
                issues(existingIssues = [], { readField }) {
                  return existingIssues.filter((issueRef: Reference) => readField('id', issueRef) !== issue?.id);
                }
              }
            });
          } else {
            cache.modify({
              fields: {
                issues(existingIssues = [], { readField }) {
                  return existingIssues.filter((issueRef: Reference) => readField('id', issueRef) !== issue?.id);
                }
              }
            });
          }
        }
      });
    },
    [addToast, closeDialog, deleteIssue]
  );

  return [deleteIssueCb, result];
};

export const useUpdateIssueCache = () => {
  const client = useApolloClient();

  const updateIssueCacheCb = useCallback(
    (issue: Issue, status: IssueStatus) => {
      client.cache.modify({
        id: client.cache.identify(issue),
        fields: {
          status() {
            return status;
          }
        },
        broadcast: true
      });
    },
    [client.cache]
  );

  return { updateIssueCache: updateIssueCacheCb };
};
