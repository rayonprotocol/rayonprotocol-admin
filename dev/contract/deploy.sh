#!/bin/bash

# env vars
# change the mnemonic that your hd wallet is seeded with

function migrate_contracts() {
  prefix="rayonprotocol-contract"
  declare -a repo_names=(
    "borrower"
    "kyc"
  )

  echo "Check RPC alive"
  curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545
  echo ""

  for repo_name in "${repo_names[@]}"
  do
    cd $REPO_DIR/$prefix-$repo_name
    rm -rf $ARTIFACT_DIR/$repo_name
    truffle migrate --network development --compile-all --reset
    echo "Contract artifacts below"
    ls ./build/contracts
    cp -r ./build/contracts $ARTIFACT_DIR/$repo_name
  done
}

function run-txapp() {
  txapp_dir="/data/application/sample-tx"
  
  cd $TXAPP_DIR
  yarn start
}



migrate_contracts

run-txapp