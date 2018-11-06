import React, { Component, Fragment } from 'react';

// model
import { EventLog, FunctionLog } from '../../../../shared/common/model/TxLog';
import { newContract } from '../../../../shared/contract/model/Contract';

// dc
import ContractDC from 'contract/dc/ContractDC';

// view
import Loading from 'common/view/loading/Loading';
import Container from 'common/view/container/Container';
import ContractLogView from 'contract/view/ContractLogView';
import ContractInfoView from 'contract/view/ContractInfoView';
import EventLogTableView from 'contract/view/EventLogTableView';
import FunctionLogTableView from 'contract/view/FunctionLogTableView';
import ContractOverviewView from 'contract/view/ContractOverviewView';
import ContractRegisterModalView from 'contract/view/ContractRegisterModalView';
import ContractUpgradeModalView from 'contract/view/ContractUpgradeModalView';

// styles
import styles from './ContractVC.scss';

interface ContractVCState {
  functionLogs: FunctionLog[];
  eventLogs: EventLog[];
  selLogType: string;
  contracts: newContract[];
  selContract: newContract;
  isLoading: boolean;
  isRegisterModalOpen: boolean;
  isUpgradeModalOpen: boolean;
}

class ContractVC extends Component<{}, ContractVCState> {
  public static TAB_FUNCTION = 'Function';
  public static TAB_EVENT = 'Event';

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      functionLogs: new Array<FunctionLog>(),
      eventLogs: new Array<EventLog>(),
      selLogType: ContractVC.TAB_FUNCTION,
      isLoading: true,
      isRegisterModalOpen: false,
    };
  }

  async componentDidMount() {
    ContractDC.addContractListener(this.onContractFetched.bind(this));
    ContractDC.fetchAllContracts();
  }

  public async onContractFetched(contracts: newContract[]) {
    const selContractAddr = ContractDC.getFirstContractAddr();
    const eventLogs = await ContractDC.getEventLogs(selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(selContractAddr);
    const selContract = contracts[0];
    this.setState({ ...this.state, contracts, eventLogs, functionLogs, selContract, isLoading: false });
  }

  public async onSelectContract(selContractAddr: string): Promise<void> {
    if (!this.state.selContract || this.state.selContract.interfaceAddress === selContractAddr) return;

    const eventLogs = await ContractDC.getEventLogs(selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(selContractAddr);
    const selContract = this.getSelContractByAddress(selContractAddr);
    this.setState({ ...this.state, eventLogs, functionLogs, selContract });
  }

  public getSelContractByAddress(interfaceAddress: string) {
    const filterContracts = this.state.contracts.filter(contract => contract.interfaceAddress === interfaceAddress);
    return filterContracts.length ? filterContracts.pop() : undefined;
  }

  public onSelectLogType(type: string): void {
    this.setState({ ...this.state, selLogType: type });
  }

  // modal

  public onClickRegisterModalOpenAndClose() {
    this.setState({ ...this.state, isRegisterModalOpen: !this.state.isRegisterModalOpen });
  }

  public onClickUpgradeModalOpenAndClose() {
    this.setState({ ...this.state, isUpgradeModalOpen: !this.state.isUpgradeModalOpen });
  }

  public onClickRegisterButton(proxyAddress: string, blockNumber: number) {
    console.log('proxyAddress', proxyAddress);
    console.log('blockNumber', blockNumber);
    return;
  }

  public onClickUpgradeButton(interfaceAddress: string) {
    console.log('interfaceAddress', interfaceAddress);
    return;
  }

  renderLogTable() {
    const { selLogType } = this.state;
    switch (selLogType) {
      case ContractVC.TAB_EVENT:
        return <EventLogTableView eventLogs={this.state.eventLogs} />;
      case ContractVC.TAB_FUNCTION:
        return <FunctionLogTableView functionLogs={this.state.functionLogs} />;
      default:
        break;
    }
  }

  render() {
    return (
      <Fragment>
        <Container className={styles.contractVC}>
          {this.state.isLoading ? (
            <Loading />
          ) : (
            <Fragment>
              <ContractInfoView
                contracts={this.state.contracts}
                onClickRegisterModalOpen={this.onClickRegisterModalOpenAndClose.bind(this)}
                onClickUpgradeModalOpen={this.onClickUpgradeModalOpenAndClose.bind(this)}
                onSelectContract={this.onSelectContract.bind(this)}
              />
              <ContractOverviewView
                contract={this.state.selContract}
                onSelectContract={this.onSelectContract.bind(this)}
              />

              <ContractLogView
                selLogType={this.state.selLogType}
                logTypes={[ContractVC.TAB_FUNCTION, ContractVC.TAB_EVENT]}
                onSelectLogType={this.onSelectLogType.bind(this)}
              >
                {this.renderLogTable()}
              </ContractLogView>
            </Fragment>
          )}
        </Container>
        <ContractRegisterModalView
          isModalOpen={this.state.isRegisterModalOpen}
          onRequestClose={this.onClickRegisterModalOpenAndClose.bind(this)}
          onClickRegister={this.onClickRegisterButton.bind(this)}
        />
        <ContractUpgradeModalView
          isModalOpen={this.state.isUpgradeModalOpen}
          onRequestClose={this.onClickUpgradeModalOpenAndClose.bind(this)}
          onClickUpgrade={this.onClickUpgradeButton.bind(this)}
        />
      </Fragment>
    );
  }
}

export default ContractVC;
