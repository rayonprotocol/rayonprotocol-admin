// import React, { Component, Fragment } from 'react';
// import AnimatedNumber from 'react-animated-number';
// import { BigNumber } from 'bignumber.js';

// // view
// import DashboardContainer from 'common/view/container/DashboardContainer';
// import ProgressBar from 'common/view/progressbar/ProgressBar';

// // util
// import StringUtil from '../../../../shared/common/util/StringUtil';

// // styles
// import styles from './TokenInfoView.scss';

// interface TokenInfoViewProps {
//   tokenCap: BigNumber;
//   percentage: number;
// }

// class TokenInfoView extends Component<TokenInfoViewProps, {}> {
//   renderCap() {
//     return (
//       <Fragment>
//         <img className={styles.symbolImg} src={require('../../common/asset/img/rayon-symbol.png')} />
//         <p>Rayon Token</p>
//       </Fragment>
//     );
//   }

//   renderTokenInfo() {
//     return (
//       <Fragment>
//         <div className={styles.tokenInfo}>
//           <p>Token Name:</p>
//           <p>Rayon</p>
//         </div>
//         <div className={styles.tokenInfo}>
//           <p>Token Symbol:</p>
//           <p>RYN</p>
//         </div>
//         <div className={styles.tokenCap}>
//           <p className={styles.subTitle}>Cap</p>
//           <p className={styles.capValue}>
//             {StringUtil.removeLastZeroInFloatString(this.props.tokenCap.toFixed(18))}
//             RYN
//           </p>
//         </div>
//       </Fragment>
//     );
//   }

//   render() {
//     return (
//       <DashboardContainer className={styles.tokenInfoView}>
//         <div className={styles.symbolSection}>{this.renderCap()}</div>
//         <div className={styles.tokenInfoSection}>{this.renderTokenInfo()}</div>
//         <ProgressBar
//           className={styles.progressBar}
//           percent={this.props.percentage}
//           tipText={Math.floor(this.props.percentage).toString() + '%'}
//         />
//       </DashboardContainer>
//     );
//   }
// }

// export default TokenInfoView;
