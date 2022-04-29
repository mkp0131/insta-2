import client from '../../client';

export default {
  Query: {
    seeFollowers: async (_, { userName, page }) => {
      const user = await client.user.findUnique({
        where: {
          userName,
        },
        select: {
          id: true,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: '회원이 없습니다',
        };
      }

      const followers = await client.user
        .findUnique({
          where: {
            userName,
          },
        })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });

      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: { userName },
          },
        },
      });
      return {
        ok: true,
        followers,
        totalPage: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
