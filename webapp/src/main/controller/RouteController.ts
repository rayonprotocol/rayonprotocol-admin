// dc
import UserDC from 'user/dc/UserDC';

// view
import TokenVC from 'token/vc/TokenVC';
import ContractVC from 'contract/vc/ContractVC';
import BorrowerVc from 'borrower/vc/BorrowerVc';
import PersonalDataVC from 'personaldata/vc/PersonalDataVC';
import NoMetamaskView from 'main/view/NoMetamaskView';
import OnlyAdminView from 'main/view/OnlyAdminView';

// util
import StringUtil from '../../../../shared/common/util/StringUtil';

class RouterPathController {
  noUserRoute = [
    {
      path: '/',
      component: TokenVC,
      exact: true,
    },
    {
      path: '/contract',
      component: NoMetamaskView,
      exact: true,
    },
    {
      path: '/kyc',
      component: NoMetamaskView,
      exact: true,
    },
  ];

  noAdminRoute = [
    {
      path: '/',
      component: TokenVC,
      exact: true,
    },
    {
      path: '/contract',
      component: OnlyAdminView,
      exact: true,
    },
    {
      path: '/kyc',
      component: OnlyAdminView,
      exact: true,
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
    {
      path: '/borrower',
      component: BorrowerVc,
      exact: true,
    },
    {
      path: '/personaldata',
      component: PersonalDataVC,
      exact: true,
    },
  ];

  public async getRoutes(userAccount: string): Promise<any> {
    if (StringUtil.isEmpty(userAccount)) return this.noUserRoute;
    return (await UserDC.isAdminUser(userAccount)) ? this.privateRoute : this.noAdminRoute;
  }
}

export default new RouterPathController();
