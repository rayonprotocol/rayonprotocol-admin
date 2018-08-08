# Rayon Protocol ("Rayon") Admin
First developing token-related Admin page. Other Admin-related functions will continually be added

## About

### Role
 - Server
     1. Process events (process into required data forms)
     2. Save processed events (create history)
 - Web UI
     1. Receive & process events then apply to View
     2. Data request to server during initial loading
     3. Publish transfer/mint transactions requested by Admin to blockchain (using MetaMask)
     
### Folder Structure

- node_server: server in node form
- shared: model used by both node_server & webapp
- webapp: admin web page client

### Client Pages & Functions

- Dashboard
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829054-074d9caa-9b39-11e8-9d0e-8a5bc561cf0d.png" width="400px">
</p>

- Total Tokens Minted
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829102-1ddba73c-9b39-11e8-8506-826f9ef6e47e.png" width="300px">
</p>

- Token Holder List & Balance
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829120-27ada26a-9b39-11e8-87a8-5e9e6e049bb7.png" width="600px">
</p>

- Lookup Token Transfer History
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829078-1485f0b6-9b39-11e8-86d1-b54a37092510.png" width="700px">
</p>

- Mint Token & Transfer 
<p align="center">
    <img src="https://user-images.githubusercontent.com/20614643/43829137-327ee3f2-9b39-11e8-8f1c-b3105fee73d3.png" width="400px">
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

### Execution

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
* client port number is 8080 and server port number is 3000
