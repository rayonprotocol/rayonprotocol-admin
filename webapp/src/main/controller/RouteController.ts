// dc
import UserDC from 'user/dc/UserDC';

// view
import TokenVC from 'token/vc/TokenVC';
import ContractVC from 'contract/vc/ContractVC';
import NoMetamaskView from 'main/view/NoMetamaskView';
import OnlyAdminView from 'main/view/OnlyAdminView';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

class RouterPathController {
  noUserRoute = [
    {
      path: '/',
      component: NoMetamaskView,
    },
    {
      path: '/contract',
      component: NoMetamaskView,
    },
  ];

  noAdminRoute = [
    {
      path: '/',
      component: OnlyAdminView,
    },
    {
      path: '/contract',
      component: OnlyAdminView,
    },
  ];

  privateRoute = [
    {
      path: '/',
      component: TokenVC,
      exact: true,
    },
    {
      path: '/contract',
      component: ContractVC,
      exact: true,
    },
    {
      path: '/kyc',
      component: OnlyAdminView,
      exact: true,
    },
  ];

  public getRoutes(userAccount: string): any {
    if (StringUtil.isEmpty(userAccount)) return this.noUserRoute;
    return UserDC.isAdminUser(userAccount) ? this.privateRoute : this.noAdminRoute;
  }
}

export default new RouterPathController();
