import { gql } from 'apollo-server';

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalPage: Int
  }
  type Query {
    seeFollowers(userName: String!, page: Int!): SeeFollowersResult
  }
`;
