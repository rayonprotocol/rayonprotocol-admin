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
import ContractOverviewView from 'contract/view/ContractOverviewView';
import ContractInfoView from 'contract/view/ContractInfoView';
import EventLogTableView from 'contract/view/EventLogTableView';
import FunctionLogTableView from 'contract/view/FunctionLogTableView';
import ContractRegisterModelView from 'contract/view/ContractRegisterModalView';

// styles
import styles from './ContractVC.scss';

interface ContractVCState {
  functionLogs: FunctionLog[];
  eventLogs: EventLog[];
  selLogType: string;
  contracts: newContract[];
  selContractAddr: string;
  isLoading: boolean;
  isRegisterModalOpen: boolean;
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
    this.setState({ ...this.state, contracts, eventLogs, functionLogs, selContractAddr, isLoading: false });
  }

  public async onSelectContract(selContractAddr: string): Promise<void> {
    if (this.state.selContractAddr === selContractAddr) return;

    const eventLogs = await ContractDC.getEventLogs(selContractAddr);
    const functionLogs = await ContractDC.getFunctionLogs(selContractAddr);
    this.setState({ ...this.state, eventLogs, functionLogs, selContractAddr });
  }

  public onSelectLogType(type: string): void {
    this.setState({ ...this.state, selLogType: type });
  }

  // modal

  public onClickRegisterModalOpenAndClose() {
    this.setState({ ...this.state, isRegisterModalOpen: !this.state.isRegisterModalOpen });
  }

  public onClickRegisterButton(proxyAddress: string, blockNumber: number) {
    console.log('proxyAddress', proxyAddress);
    console.log('blockNumber', blockNumber);
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
          <ContractInfoView
            contracts={this.state.contracts}
            onClickRegisterModelOpen={this.onClickRegisterModalOpenAndClose.bind(this)}
          />
          {/* {this.state.isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <ContractOverviewView
              contracts={this.state.contracts}
              selContractAddr={this.state.selContractAddr}
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
        )} */}
        </Container>
        <ContractRegisterModelView
          isModalOpen={this.state.isRegisterModalOpen}
          onRequestClose={this.onClickRegisterModalOpenAndClose.bind(this)}
          onClickRegister={this.onClickRegisterButton.bind(this)}
        />
      </Fragment>
    );
  }
}

export default ContractVC;
