// import React, { Component } from 'react';

// // model
// import ContractConfigure from '../../../../shared/common/model/ContractConfigure';
// import Metamask from 'common/model/metamask/Metamask';

// // dc
// import KycDC from 'kyc/dc/KycDC';

// // view
// import Container from 'common/view/container/Container';
// import OnlyAdminView from 'common/view/view/OnlyAdminView';
// import NoMetamaskView from 'common/view/view/NoMetamaskView';

// // util
// import StringUtil from '../../../../shared/common/util/StringUtil';

// // styles
// import styles from './KycVC.scss';

// interface KycVCState {
//   userAccount: string;
// }

// class KycVC extends Component<{}, KycVCState> {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userAccount: undefined,
//     };
//   }

//   async componentDidMount() {
//     let userAccount = await KycDC.getUserAccount();
//     if (!StringUtil.isEmpty(this.state.userAccount) && this.isAdminUser()) {
//       KycDC.setWeb3();
//       userAccount = await KycDC.getUserAccount();
//     } else {
//       KycDC.setMetamaskLoginListener(this.onMetamaskLogin.bind(this));
//     }
//     this.setState({ ...this.state, userAccount });
//   }

//   onMetamaskLogin(loginResult: Metamask) {
//     this.setState({ ...this.state, userAccount: loginResult.selectedAddress });
//   }

//   isAdminUser() {
//     return this.state.userAccount.toLowerCase() === ContractConfigure.ADDR_CONTRACT_ADMIN.toLowerCase();
//   }

//   renderNoUser() {
//     return (
//       <Container>
//         <NoMetamaskView />
//       </Container>
//     );
//   }

//   renderAdminOnly() {
//     return (
//       <Container>
//         <OnlyAdminView />
//       </Container>
//     );
//   }

//   renderKycAdmin() {
//     return (
//       <Container>
//         <div>this is Kyc admin page</div>
//       </Container>
//     );
//   }

//   render() {
//     if (StringUtil.isEmpty(this.state.userAccount)) return this.renderNoUser();
//     else if (!this.isAdminUser()) return this.renderAdminOnly();
//     else return this.renderKycAdmin();
//   }
// }

// export default KycVC;
