import { MutationFunctionOptions, MutationResult, useMutation } from '@apollo/client';
import { gql } from '@generated/gql';
import { UpdateUserMutation, UpdateUserMutationVariables, UserUpdateInput } from '@generated/graphql';
import { useCallback } from 'react';

const UPDATE_USER_MUTATION = gql(`
    mutation UpdateUser($input: UserUpdateInput!) {
        updateUser(userUpdateInput: $input) {
            ...UserFragment
        }
    }
`);

type MutationOptions = Omit<MutationFunctionOptions<UpdateUserMutation, UpdateUserMutationVariables>, 'variables'>;

export const useUpdateUserMutation = (): [
  (data: UserUpdateInput, options?: MutationOptions) => void,
  MutationResult<UpdateUserMutation>
] => {
  const [updateUser, result] = useMutation(UPDATE_USER_MUTATION);

  const updateUserFn = useCallback(
    (data: UserUpdateInput, options?: MutationOptions) => {
      updateUser({
        variables: {
          input: {
            ...data
          }
        },
        ...options
      });
    },
    [updateUser]
  );

  return [updateUserFn, result];
};
