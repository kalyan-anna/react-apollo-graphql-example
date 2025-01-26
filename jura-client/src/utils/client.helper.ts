import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

import { accessTokenAtom } from "../state/auth";
import { getDefaultStore } from "jotai";
import { gqlGlobalErrorAtom } from "../state/error";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

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

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const store = getDefaultStore();

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
      const shouldThrowError = !graphQLErrors.some(
        (error) => error.extensions?.code === "BAD_USER_INPUT"
      );

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
  }
);

export const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      awaitRefetchQueries: true,
    },
  },
});
