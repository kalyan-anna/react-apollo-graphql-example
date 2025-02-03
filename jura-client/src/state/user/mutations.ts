import { MutationFunctionOptions, MutationResult, useApolloClient, useMutation } from "@apollo/client";
import { gql } from "@generated/gql";
import { UpdateUserMutation, UpdateUserMutationVariables, User, UserUpdateInput } from "@generated/graphql";
import { USER_QUERY } from "./queries";

const UPDATE_USER_MUTATION = gql(`
    mutation UpdateUser($input: UserUpdateInput!) {
        updateUser(userUpdateInput: $input) {
            ...UserFragment
        }
    }
`);

type MutationOptions = Omit<MutationFunctionOptions<UpdateUserMutation, UpdateUserMutationVariables>, "variables">;

export const useUpdateUserMutation = (): [
  (data: UserUpdateInput, options?: MutationOptions) => void,
  MutationResult<UpdateUserMutation>
] => {
  const [updateUser, result] = useMutation(UPDATE_USER_MUTATION);

  const updateUserFn = (data: UserUpdateInput, options?: MutationOptions) => {
    updateUser({
      variables: {
        input: {
          ...data,
        },
      },
      ...options,
    });
  };

  return [updateUserFn, result];
};
