import { MutationFunctionOptions, MutationResult, useMutation } from "@apollo/client";
import { gql } from "@generated/gql";
import {
  CreateSprintMutation,
  SprintCreateInput,
  SprintStatus,
  UpdateSprintMutation,
  UpdateSprintMutationVariables,
} from "@generated/graphql";
import { useParams } from "react-router";
import { sprintDialog } from "../ui-dialog";
import { SPRINTS_QUERY } from "./queries";

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
  const { projectId = "" } = useParams();

  const createSprintCb = (data: SprintCreateInput) => {
    createSprint({
      variables: {
        input: {
          ...data,
        },
      },
      onCompleted: closeDialog,
      refetchQueries: [{ query: SPRINTS_QUERY, variables: { projectId } }],
    });
  };

  return [createSprintCb, result];
};

export const useUpdateSprintMutation = () => {
  return useMutation(UPDATE_SPRINT_MUTATION);
};

type MutationOptions = Omit<MutationFunctionOptions<UpdateSprintMutation, UpdateSprintMutationVariables>, "variables">;

export const useCompleteSprintMutation = (): [
  (sprintId: string, options?: MutationOptions) => void,
  MutationResult<UpdateSprintMutation>
] => {
  const [updateSprint, result] = useMutation(UPDATE_SPRINT_MUTATION);

  const updateSprintFn = (sprintId: string, options?: MutationOptions) => {
    updateSprint({
      variables: {
        input: {
          id: sprintId,
          status: SprintStatus.Completed,
        },
      },
      ...options,
    });
  };

  return [updateSprintFn, result];
};

export const useStartSprintMutation = (): [(sprintId: string) => void, MutationResult<UpdateSprintMutation>] => {
  const [updateSprint, result] = useMutation(UPDATE_SPRINT_MUTATION);

  const updateSprintFn = (sprintId: string) => {
    updateSprint({
      variables: {
        input: {
          id: sprintId,
          status: SprintStatus.Active,
        },
      },
    });
  };

  return [updateSprintFn, result];
};
