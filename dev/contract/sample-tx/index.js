const chalk = require('chalk');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const Registry = require('./Registry');
const KycAttester = require('./KycAttester');
const Auth = require('./Auth');
const BorrowerApp = require('./BorrowerApp');
const Borrower = require('./Borrower');
const BorrowerMember = require('./BorrowerMember');
const PersonalDataCategory = require('./PersonalDataCategory');
const PersonalDataList = require('./PersonalDataList');

const {
  MNEMONIC,
  NETWORK_ID,
  ARTIFACT_DIR,
} = process.env; // envrionment varables

const provider = new HDWalletProvider(MNEMONIC, 'http://localhost:8545', 0, 10); // address_index=0, num_addresses=10
const web3 = new Web3(provider);

const log = console.log;
const indent = n => ([...Array(n)].map(() => ''));
const info = chalk.black.bgWhite.bold;
const error = chalk.bold.red;
const gasLimit = 4600000;
const gasPrice = 1;

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

const count = { success: 0, fail: 0 };

function getUtils() {
  const interfaceContractInstances = {};
  const proxyContractInstances = {};
  const logDone = (description) => {
    log(...indent(2), chalk.green.bold('Done'));
    log(...indent(2), `..for ${description}`);
    log();
    count.success++;
  };
  const logError = (...args) => {
    const err = args.pop();
    const description = args.pop();
    log(...indent(2), error(err.message));
    if (description) log(...indent(2), `..for ${description}`);
    log();
    count.fail++;
  };

  const createInstance = (abi, deployedAddress) => {
    // if (deployedAddress) instance.options.address = deployedAddress;
    const instance = new web3.eth.Contract(abi, deployedAddress);
    instance.options.gasPrice = gasPrice;
    instance.options.gas = gasLimit;
    return instance;
  };

  const getContract = (artifactPath) => {
    if (interfaceContractInstances[artifactPath]) return interfaceContractInstances[artifactPath];
    const artifact = require(`${ARTIFACT_DIR}/${artifactPath}.json`);
    const deployedAddress = artifact.networks[NETWORK_ID].address;
    const contractInstance = createInstance(artifact.abi, deployedAddress);
    interfaceContractInstances[artifactPath] = contractInstance;
    return contractInstance;
  };

  const getContractFromRegistry = async (artifactPath) => {
    if (proxyContractInstances[artifactPath]) return proxyContractInstances[artifactPath];
    const [, contractName] = artifactPath.split('/');
    const interfaceContractInstance = getContract(artifactPath);
    try {
      const Registry = getContract('registry/Registry');
      const result = await Registry.methods.getRegistryInfo(contractName).call({ from: addresses.owner }) || {};
      const contractAddress = result[1];
      const contractInstance = createInstance(interfaceContractInstance.options.jsonInterface, contractAddress);
      proxyContractInstances[artifactPath] = contractInstance;
      return contractInstance;
    } catch (e) {
      console.log(e)
    }
  };

  const deployContract = (artifactPath, args) => {
    const artifact = require(`${ARTIFACT_DIR}/${artifactPath}.json`);
    const contract = createInstance(artifact.abi);
    return contract.deploy({
      data: artifact.bytecode,
      arguments: args,
    });
  };

  return {
    deployContract,
    getContract,
    getContractFromRegistry,
    logTx: async function (txPromiEvent, description) {
      await new Promise((resolve, reject) => txPromiEvent
        .once('transactionHash', resolve)
        .once('error', reject)
      )
        .then(() => logDone(description))
        .catch(e => logError(description, e));
    },
    count,
  };
}

const utils = getUtils();

const sendSampleTx = async () => {
  const contractTxSenders = {
    Registry, KycAttester, Auth, BorrowerApp, Borrower, BorrowerMember, PersonalDataCategory, PersonalDataList,
  }; // the order of tx senders matters
  for (const contractName in contractTxSenders) {
    const txSender = contractTxSenders[contractName];
    log(info(`${contractName}: sending tx(s)`));
    await txSender(addresses, web3, utils);
    log();
  }

  log(chalk.blue.bold(`Finished sending txs - success: ${count.success}, fail: ${count.fail}`));
  log();
  provider.engine.stop();
  process.exit();
};

sendSampleTx().catch(console.log);
