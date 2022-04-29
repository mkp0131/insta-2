import { gql } from 'apollo-server';

export default gql`
  type CreateUserResult {
    ok: Boolean!
    error: String
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String
      userName: String!
      email: String!
      password: String!
    ): CreateUserResult
  }
`;
