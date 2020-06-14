import React from "react";

import AWSAppSyncClient from "aws-appsync";
import { AuthOptions } from "aws-appsync-auth-link";
import { ApolloProvider, Query, QueryResult } from "react-apollo";
import { Rehydrated } from "aws-appsync-react";
import gql from "graphql-tag";

import appSyncConfig from "./aws-exports";

const client = new AWSAppSyncClient({
  url: appSyncConfig.aws_appsync_graphqlEndpoint,
  region: appSyncConfig.aws_appsync_region,
  auth: {
    type: appSyncConfig.aws_appsync_authenticationType,
    apiKey: appSyncConfig.aws_appsync_apiKey,
  } as AuthOptions,
});

const query = gql(`
  query {
    listEvents(limit: 1000) {
      items {
        id
        name
        where
        when
        description
        comments {
          items {
            commentId
          }
        }
      }
    }
  }
`);

function App() {
  return (
    <Query query={query}>
      {({ loading, error, data }: QueryResult) => {
        if (loading) {
          return <div>Loading ...</div>;
        }

        if (error) {
          return <div>Error ...</div>;
        }

        return (
          <ul>
            {data.listEvents.items.map((Event: { id: string }) => (
              <li key={Event.id}>{Event.id}</li>
            ))}
          </ul>
        );
      }}
    </Query>
  );
}

export default () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
);
