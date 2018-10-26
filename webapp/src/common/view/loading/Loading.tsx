import React, { Component } from 'react';
import ReactLoading from 'react-loading';

// styles
import styles from './Loading.scss';

class Loading extends Component<{}, {}> {
  render() {
    return (
      <div className={styles.loading}>
        <div>
          <ReactLoading type={'bars'} color={'#0097c6'} height={100} width={100} />
        </div>
        <div>
          <p className={styles.loadingTitle}>{'Please wait...'}</p>
          <p className={styles.loadingDesc}>{'Page will be load'}</p>
        </div>
      </div>
    );
  }
}

export default Loading;
