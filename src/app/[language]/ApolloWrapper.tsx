"use client";
// ^ this file needs the "use client" pragma

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import useAuthTokens from "@/services/auth/use-auth-tokens";

function makeClient(tokensInfoRef: any) {
  const httpLink = new HttpLink({
    // uri: "http://0.0.0.0:3000/local/graphql",
    uri: "https://nbzfeuhkb6.execute-api.us-east-2.amazonaws.com/dev/graphql",
    fetchOptions: { cache: "no-store" },
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${tokensInfoRef?.current.token}`,
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const { tokensInfoRef } = useAuthTokens();

  return (
    <ApolloNextAppProvider makeClient={() => makeClient(tokensInfoRef)}>
      {children}
    </ApolloNextAppProvider>
  );
}
