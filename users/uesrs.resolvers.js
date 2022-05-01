import client from '../client';

export default {
  User: {
    totalFollowers: ({ id }, _, { loggedInUser }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    totalFollowing: ({ id }, _, { loggedInUser }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => loggedInUser.id === id,
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;

      const check = await client.user.count({
        where: { id: loggedInUser.id, following: { some: { id } } },
      });
      return Boolean(check);
    },
  },
};
