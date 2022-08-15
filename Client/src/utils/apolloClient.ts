import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

let apolloClient;

if(typeof window !== "undefined"){
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/'
  });

  const wsClient = createClient({
    url: "ws://localhost:4000/"
  })

  const wsLink = new GraphQLWsLink(wsClient)

  const splitLink = split(
    ({ query }) => {
        const def = getMainDefinition(query);
        return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
        );
    },
    wsLink,
    httpLink
  )
  
  apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
}else{
  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/'
  });

  apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

export default apolloClient;