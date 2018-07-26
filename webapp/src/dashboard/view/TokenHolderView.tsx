import React, { Component } from 'react';

// model
import { TransferEvent } from '../../../../shared/event/model/RayonEvent';

// dc
import TokenDC from 'token/dc/TokenDC';
import TransferEventDC from 'event/dc/TransferEventDC';

// view
import DashboardContainer from 'common/view/container/DashboardContainer';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderState {
  holders: object;
}

class TokenHolderView extends Component<{}, TokenHolderState> {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      holders: {},
    };
  }

  componentWillMount() {
    TransferEventDC.subscribeEvent(TokenHolderView.name, this.getTransferEvent.bind(this));
  }

  componentWillUnmount() {
    TransferEventDC.unsubscribeEvent(TokenHolderView.name);
  }

  async getTransferEvent(event: TransferEvent[]) {
    const holders = await TokenDC.fetchTop10TokenHolders();
    this.setState({ ...this.state, holders });
  }

  render() {
    const { holders } = this.state;
    const holdersList = Object.keys(holders);
    return (
      <DashboardContainer className={styles.tokenHolderView} title={'Token Holders'}>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Quantity</th>
              {/* <th>Percentage</th> */}
            </tr>
          </thead>
          <tbody>
            {holdersList.map((address, index) => {
              return (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{address}</td>
                  <td>{holders[address]} RYN</td>
                  {/* <td>{item.percentage}%</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </DashboardContainer>
    );
  }
}

export default TokenHolderView;
