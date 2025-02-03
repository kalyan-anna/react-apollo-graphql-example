import { useAuthState } from "./atoms";

import { useMutation } from "@apollo/client";
import { gql } from "@generated/gql";
import { useNavigate } from "react-router";
import { useUIPreferenceState } from "../ui-preference";
import { USER_QUERY } from "../user";

const LOGIN_MUTATION = gql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        ...UserFragment
      }
    }
  }
`);

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuthState();
  const { lastVisitedProjectId } = useUIPreferenceState();

  return useMutation(LOGIN_MUTATION, {
    // update: (cache, { data }) => {
    //   if (data?.login?.user) {
    //     cache.writeQuery({
    //       query: USER_QUERY,
    //       data: {
    //         user: {
    //           ...data.login.user,
    //         },
    //       },
    //       variables: {
    //         id: data.login.user.id,
    //       },
    //     });
    //   }
    // },
    onCompleted: (data) => {
      login({ accessToken: data.login.accessToken, user: data.login.user });
      if (lastVisitedProjectId) {
        navigate(`/project/${lastVisitedProjectId}/issues`);
      } else {
        navigate("/dashboard");
      }
    },
    onError: () => {
      logout();
    },
  });
};
