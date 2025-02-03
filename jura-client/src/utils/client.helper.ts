import { ApolloClient, InMemoryCache, TypePolicy, createHttpLink } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { getDefaultStore } from "jotai";
import { accessTokenAtom } from "../state/auth";
import { gqlGlobalErrorAtom } from "../state/error";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const store = getDefaultStore();
  const token = store.get(accessTokenAtom);

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const store = getDefaultStore();

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
    const shouldThrowError = !graphQLErrors.some((error) => error.extensions?.code === "BAD_USER_INPUT");

    if (shouldThrowError) {
      const messages = graphQLErrors.map((error) => error.message).join(", ");
      store.set(gqlGlobalErrorAtom, messages);
      return;
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    store.set(gqlGlobalErrorAtom, networkError.message);
    return;
  }

  return forward(operation);
});

const retryLink = new RetryLink({ attempts: { max: 2 } });

const entityTypes = ["Sprint", "Issue", "User", "Notification", "Project"];

const generateTypePolicies = () => {
  const fields: TypePolicy["fields"] = {};

  entityTypes.forEach((entityType) => {
    fields[entityType.toLowerCase()] = {
      read(_, { args, toReference }) {
        return toReference({
          __typename: entityType,
          id: args?.id,
        });
      },
    };
  });

  return fields;
};

export const client = new ApolloClient({
  link: retryLink.concat(authLink).concat(errorLink).concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: generateTypePolicies(),
      },
    },
  }),
  defaultOptions: {
    mutate: {
      awaitRefetchQueries: true,
    },
  },
});
