import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/uesrs.utils';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
