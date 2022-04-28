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
