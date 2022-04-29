import client from '../../client';
import bcrypt from 'bcrypt';
import { protectedResolver } from '../uesrs.utils';
import fs from 'fs';

const resolverFn = async (
  _,
  { firstName, lastName, userName, password, bio, avatar },
  { loggedInUser }
) => {
  try {
    let avatarUrl = null;
    if (avatar) {
      const { filename, createReadStream } = await avatar;
      const newFilename = loggedInUser.id + '-' + Date.now() + '-' + filename;
      const readStream = createReadStream();
      const writeStream = fs.createWriteStream(
        process.cwd() + '/uploads/' + newFilename
      );
      readStream.pipe(writeStream);
      avatarUrl = `http://localhost:4000/static/${newFilename}`;
    }

    let newPassword = null;
    if (password) {
      newPassword = await bcrypt.hash(password, 5);
    }
    const ok = await client.user.update({
      where: { id: loggedInUser.id },
      data: {
        firstName,
        lastName,
        userName,
        ...(newPassword && { password: newPassword }),
        bio,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });
    if (ok) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        error: '업데이트를 실패했습니다',
      };
    }
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
