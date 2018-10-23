import React, { Component } from 'react';

// view
import SectionTitle from 'common/view/section/SectionTitle';

// styles
import styles from './TokenHolderView.scss';

interface TokenHolderViewProps {}

class TokenHolderView extends Component<TokenHolderViewProps, {}> {
  render() {
    return (
      <div className={styles.tokenHolderView}>
        <SectionTitle title={'Rayon'} />
      </div>
    );
  }
}

export default TokenHolderView;
