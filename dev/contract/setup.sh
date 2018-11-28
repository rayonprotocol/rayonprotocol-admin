#!/bin/bash

function setup-txapp() {
  cd $TXAPP_DIR
  yarn
  ls .
}

function setup_repos() {
  prefix="rayonprotocol-contract"
  declare -a repo_names=(
    "borrower"
    "kyc"
    "personaldata"
  )

  mkdir -p $REPO_DIR
  cd $REPO_DIR
  git clone https://github.com/rayonprotocol/$prefix-common.git # clone only

  for repo_name in "${repo_names[@]}"
  do
    cd $REPO_DIR
    git clone https://github.com/rayonprotocol/$prefix-$repo_name.git
    cd $prefix-$repo_name
    ls .
    yarn
  done

  ls $REPO_DIR
}

setup-txapp
setup_repos
