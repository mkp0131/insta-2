# 인스타 클론

## prisma

- altaier graphQl client 다운로드 - 크롬확장도가능.
- findUnique, findFirst 차이
- findUnique는 @unique 키만 조회해서 찾는다.
- findUnique는 OR 가 되지 않는다.
- count: null 이 아닌 row만 카운트(속도빠름)
- find류의 조건에 where 뿐만 아니라 select 도 할 수 있다.

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

## apollo-server-express

- 일반적인 apollo 서버는 파일읽기등의 작업이 안되기 때문에, apollo express 서버로 갈아탄다.

```
npm i apollo-server-express
```

- 파일업로드 테스트
- altaier graphQl client 다운로드 - 크롬확장도가능.
- altaier 변수 사용법 / $ 로 변수로 선언하여 활용

```
mutation($userName: String, $avatar: Upload) {
  editProfile(userName: $userName, avatar: $avatar) {
    ok
    error
  }
}
```

## Relation (필드들을 엮어줌)

- Relation는 Prisma 스키마에서 두 모델 간의 연결
- 필드들을 엮어주어 하나의 필드가 업데이트되면 해당 필드에 연관된 데이터들이 같이 업데이트됨.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  firstName String
  lastName  String?
  userName  String   @unique
  bio       String?
  avatar    String?
  email     String   @unique
  password  String
  followers User[]   @relation("FollowerRelation", references: [id])
  following User[]   @relation("FollowerRelation", references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- prisma studio 에서 확인
- 다른 db 프로그램으로 확인시 \_FollowerRelation(아까 정한 명명) 테이블에 데이터가 저장됨.(조금 불편함)

### resolver

- Relation 된 필드를 업데이트할때 connect 를 사용하여 연결
- connect 에 사용하는 조건은 반드시 Unique 해야함!

```js
const ok = await client.user.update({
  where: {
    id: loggedInUser.id,
  },
  data: {
    following: {
      connect: {
        userName,
      },
    },
  },
});
```

- 연결을 해제할때는 disconnect

```js
const ok = await client.user.update({
  where: {
    id: loggedInUser.id,
  },
  data: {
    following: {
      disconnect: {
        userName,
      },
    },
  },
});
```

- 연결된 필드들의 값은 기본으로 가져오기가 안된다!
- include 로 연결된 필드값들을 명해주어야 가져오기가 된다.
- include 는 성능이 아주 않좋기 때문에 되도록이면 사용 X

```js
export default {
  Query: {
    seeProfile: (_, { userName }) =>
      client.user.findUnique({
        where: {
          userName,
        },
        include: {
          followers: true,
          following: true,
        },
      }),
  },
};
```

- Relation filters
- 릴레이션된 값들을 조회하는데 fileters 걸 수 있다.
- 자바스크립트의 array 메소드들을 생각하면 될듯!
- some: 하나 이상의("some") 관련 레코드가 필터링 기준과 일치하는 모든 레코드를 반환합니다.(조건이 모두다 없을때 사용)
- every: 모든("every") 관련 레코드가 필터링 기준과 일치하는 모든 레코드를 반환 (조건이 모두 있을때 사용)
- none: 0개의 관련 레코드가 필터링 기준과 일치하는 모든 레코드를 반환

- Offset pagination
- 특정 수의 결과를 건너뛰고 제한된 범위를 선택합니다.
- but, 이것도 쿼리가 많아지면 안좋음.
- cursor-based pagination 사용하는 것이 좋음! but 코드짜기 힘듦
- find 류 메소드의 뒤에 Relation 된 db를 연결 (Fluent API)
- take, skip 으로 페이지 설정

```js
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
```

- Offset pagination
- 보여줄 데이터가 적거나 게시물을 페이지를 통해 이동하려고 할 때, 적합
- 페이지번호 눌러서 찾아가는.. 방식
- Cursor-based pagination
- 보여줄 데이터가 많거나 무한 스크롤 등으로 데이터를 보여줄 때, 적합
- 모확장하기가 편하지만 특정 페이지로의 이동은 힘들어진다 (무한스크롤에 적합)
- 유니크한 값으로 마지막 id 를 기억하고 마지막 id 에 커서를 두어 거기서부터 시작!
- 마지막으로 불러온 id 는 skip

```js
const following = await client.user
  .findUnique({ where: { userName } })
  .following({
    take: 5,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { id: lastId } }),
  });
```
