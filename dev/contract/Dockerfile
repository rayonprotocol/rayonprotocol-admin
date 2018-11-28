FROM mhart/alpine-node:8
LABEL Name=rayon-dev-contract

ARG MNEMONIC
ARG NETWORK_ID
ARG ROOT_DIR

ENV MNEMONIC ${MNEMONIC}
ENV NETWORK_ID ${NETWORK_ID}
ENV ROOT_DIR "$ROOT_DIR"
ENV CONTRACT_DIR ${ROOT_DIR}/contract
ENV REPO_DIR ${ROOT_DIR}/contract/repos
ENV ARTIFACT_DIR ${ROOT_DIR}/contract/artifacts
ENV TXAPP_DIR ${ROOT_DIR}/sample-tx

RUN apk add --no-cache make gcc g++ python git bash curl
RUN npm install -g yarn truffle


VOLUME ["$ARTIFACT_DIR"]

COPY ./deploy.sh $CONTRACT_DIR/deploy.sh
COPY ./setup.sh $CONTRACT_DIR/setup.sh
COPY ./sample-tx $TXAPP_DIR

WORKDIR $CONTRACT_DIR
RUN ./setup.sh

ENTRYPOINT ["bash", "deploy.sh"]