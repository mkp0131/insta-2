# 인스타 클론

## prisma

- findUnique, findFirst 차이
- findUnique는 @unique 키만 조회해서 찾는다.
- findUnique는 OR 가 되지 않는다.

## JWT (jsonwebtoken)

- 설치

```
npm i jsonwebtoken
```

- jwt.sign({ id: user.id }, privateKey, { expiresIn: '1h' }) 로 토큰을 생성한다.
- 첫번째인자는 토큰에 담을 정보, 두번째 인자는 비밀키, 세번째 인자는 옵션(만료기간 등)를 입력한다.
- 토큰의 목적은 정보를 숨기는 것이 아닌 정보를 지키는 것(변경하지 못하도록 하는 것)이다
- 랜덤키생성: https://randomkeygen.com
- 토큰 정보 확인: https://jwt.io

```js
import jwt from 'jsonwebtoken';

// 토큰생성
const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
  expiresIn: '1h',
});
```

- aopolloServer 가 http 요청을 보낼때 http.headers 에 token 을 실어 보낸다.
- 해당 token이 우리 것인지를 확인 후 유저정보를 조회 유저 정보를 context 에 실어 보낸다.
- resolvers 에서 해당 유저정보를 가지고 처리

```js
// server.js
const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

// users.utils.js
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

// editProfile.resolvers.js
export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, userName, password },
      { loggedInUser }
    ) => {
      try {
```

### 예외처리

- curry를 이용하여 graphQL 이 실행하는 함수를 인터셉트하여 예외 발생시 실패한 결과값을 리턴한다.

```js
// users.utils.js
export const protectedResolver = (resolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: '회원정보가 없습니다',
    };
  }
  return resolver(root, args, context, info);
};

// editProfile.resolvers.js
export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
```
