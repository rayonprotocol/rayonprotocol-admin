# Rayon Protocol ("Rayon") Admin
First developing token-related Admin page. Other Admin-related functions will continually be added

## About

### 역할
 - Server
     1. 이벤트 처리(필요한 데이터로 가공)
     2. 처리된 이벤트 저장(히스토리 생성)
 - Web UI
     1. 수신된 이벤트를 처리하여 View에 적용
     2. 초기 로딩 시 server에 데이터 요청
     3. Admin이 요청한 Transfer/Mint 트랜잭션을 블록체인에 전송(메타마스크 사용)
     
### 폴더 구조

- node_server: node로 구현된 서버
- shared: node_server와 webapp에서 공통적으로 사용하는 모델
- webapp: admin web page client

### 클라이언트 페이지와 각 기능

- 대시보드
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829054-074d9caa-9b39-11e8-9d0e-8a5bc561cf0d.png" width="500px">
</p>
- 총 토큰 발행량
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829078-1485f0b6-9b39-11e8-86d1-b54a37092510.png" width="300px">
</p>

- 토큰 소유자 목록 및 보유량 조회
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829102-1ddba73c-9b39-11e8-8506-826f9ef6e47e.png" width="300px">
</p>

- 토큰 전송 이력 조회
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829120-27ada26a-9b39-11e8-87a8-5e9e6e049bb7.png" width="300px">
</p>

- 토큰 발행 및 전송
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829137-327ee3f2-9b39-11e8-8f1c-b3105fee73d3.png" width="300px">
</p>
 
## Getting Started

### Installing

- clone the repository to your local drive

```
git clone https://github.com/rayonprotocol/rayonprotocol-kycsystem-prototype.git
```

- install truffle

```
npm install -g truffle
```

- install [ganache](http://truffleframework.com/ganache/) for use of local development node

- install [yarn (for mac)](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

- install node_module

```
# node server
cd rayonprotocol-admin
cd node-server
yarn

# web client
cd rayonprotocol-admin
cd webapp
yarn

# node server
cd rayonprotocol-admin
cd shared
yarn
```

### Deployment

```
yarn deploy
```

### excution

- node server

```
cd rayonprotocol-admin
cd node-server
yarn dev
```

- web client

```
cd rayonprotocol-admin
cd webapp
yarn start
```

## Built With
* [Truffle](https://truffleframework.com/) - Ethereum Smart Contract Framework
* [Solidity](https://github.com/ethereum/solidity) - Used to develop the Reverse Inquiry smart contracts
* [React](https://reactjs.org/) - Used to develop web-based user interface
* [Node.js](https://nodejs.org/en/) - Server application framework

## Acknowledgments
* 클라이언트 포트 번호는 8080, 서버 포트 번호는 3000번이다.
