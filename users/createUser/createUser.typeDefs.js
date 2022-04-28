import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    createUser(
      firstName: String!
      lastName: String
      userName: String!
      email: String!
      password: String!
    ): User
  }
`;
