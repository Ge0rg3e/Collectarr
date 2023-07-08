// Dependencies
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';
import { ReactNode } from 'react';

// Create a new ApolloClient instance
export const conn = new ApolloClient({
	link: new HttpLink({ uri: '/hasura' }),
	cache: new InMemoryCache()
});

export default (props: { children: ReactNode }) => {
	return <ApolloProvider client={conn}>{props.children}</ApolloProvider>;
};
