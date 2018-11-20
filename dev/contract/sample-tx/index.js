const chalk = require('chalk');
const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");

const KycAttester = require('./KycAttester');
const Auth = require('./Auth');
const BorrowerApp = require('./BorrowerApp');
const Borrower = require('./Borrower');
const BorrowerMember = require('./BorrowerMember');

const {
  MNEMONIC,
  NETWORK_ID,
  ARTIFACT_DIR,
} = process.env; // envrionment varables
const provider = new HDWalletProvider(MNEMONIC, `http://localhost:8545`, 0, 10); // address_index=0, num_addresses=10
const web3 = new Web3(provider);

const log = console.log;
const indent = n => ([...Array(n)].map(() => ''));
const info = chalk.black.bgWhite.bold;
const error = chalk.bold.red;

const addresses = [
  'owner',
  'attester',
  'borrowerApp1',
  'borrowerApp2',
  'borrowerApp3',
  // borrowers are users who get attested (index 5~9)
  'borrower1',
  'borrower2',
  'borrower3',
  'borrower4',
  'borrower5',
].reduce((addresses, addressName, addressIndex) => {
  addresses[addressName] = web3.currentProvider.addresses[addressIndex];
  return addresses;
}, {});

function getUtils() {
  const contractInstances = {};
  const logDone = (description) => {
    log(...indent(2), chalk.green.bold('Done'));
    log(...indent(2), `..for ${description}`);
    log();
  };
  const logError = (...args) => {
    const err = args.pop();
    const description = args.pop();
    log(...indent(2), error(err.message));
    if (description) log(...indent(2), `..for ${description}`);
    log();
  };
  return {
    getContract: (artifactPath) => {
      if (contractInstances[artifactPath]) return contractInstances[artifactPath];
      const artifact = require(`${ARTIFACT_DIR}/${artifactPath}.json`);
      const deployedAddress = artifact.networks[NETWORK_ID].address;
      const contractInstance = new web3.eth.Contract(artifact.abi, deployedAddress);
      contractInstances[artifactPath] = contractInstance;
      return contractInstance;
    },
    logTx: async function (txPromiEvent, description) {
      await new Promise((resolve, reject) => txPromiEvent
        .once('transactionHash', resolve)
        .once('error', reject)
      )
      .then(() => logDone(description))
      .catch(e => logError(description, e));
    },
  }
}

const utils = getUtils();

const sendSampleTx = async () => {
  const contractTxSenders = { KycAttester, Auth, BorrowerApp, Borrower, BorrowerMember }; // the order of tx senders matters
  for (contractName in contractTxSenders) {
    const txSender = contractTxSenders[contractName];
    log(info(`${contractName}: sending tx(s)`));
    await txSender(addresses, web3, utils);
    log();
  }

  log(chalk.blue.bold('All Done'));
  log();
  provider.engine.stop();
  process.exit();
};

sendSampleTx().catch(console.log);