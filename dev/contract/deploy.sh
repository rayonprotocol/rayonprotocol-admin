#!/bin/bash

function print_desc() {
  printf "\n\n$1\n"
}

function check_rpc() {
  print_desc "Check if RPC is alive"
  curl --retry 5 \
    --retry-delay 2 \
    --retry-max-time 60 \
    --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' \
    -H "Content-Type: application/json" \
    -X POST localhost:8545 
}

function migrate_contracts() {
  prefix="rayonprotocol-contract"
  declare -a repo_names=(
    "common"
    "registry"
    "borrower"
    "kyc"
    "personaldata"
  )

  for repo_name in "${repo_names[@]}"
  do
    print_desc "Deploying contract(s) from $prefix-$repo_name repo"
    # clean artifacts
    cd $REPO_DIR/$prefix-$repo_name
    rm -rf $ARTIFACT_DIR/$repo_name

    # update repo
    git pull

    # update deps
    yarn

    # migrate contracts
    truffle migrate --network development --compile-all --reset

    print_desc "Contract artifacts"
    ls ./build/contracts
    cp -r ./build/contracts $ARTIFACT_DIR/$repo_name
  done
}

function run-txapp() {
  print_desc "Sample TXs"
  txapp_dir="/data/application/sample-tx"
  
  cd $TXAPP_DIR
  yarn start
}

check_rpc

migrate_contracts

run-txapp