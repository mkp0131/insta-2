import { gql } from 'apollo-server';

export default gql`
  type SeeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
  }

  type Query {
    seeFollowing(userName: String!, lastId: Int): SeeFollowingResult
  }
`;
