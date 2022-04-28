import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from 'apollo-server';
import schema from './schema';

const server = new ApolloServer({
  schema,
});

const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
