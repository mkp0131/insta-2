import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
  try {
    if (!token) return null;

    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    if (!id) return null;

    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const protectedResolver = (resolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: '회원정보가 없습니다',
    };
  }
  return resolver(root, args, context, info);
};
