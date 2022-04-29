import dotenv from 'dotenv';
dotenv.config();
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/uesrs.utils';
import express from 'express';
import logger from 'morgan';
import path from 'path';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

const app = express();
app.use(logger('tiny'));
server.applyMiddleware({ app });

app.use('/static', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4000;

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at `);
});
