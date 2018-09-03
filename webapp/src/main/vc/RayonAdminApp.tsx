import '!script-loader!console-polyfill';
import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { Router } from 'react-router-dom';

import { AppContainer } from 'react-hot-loader';

import history from 'common/util/Histroy';

// view
import RayonRoutes from 'main/controller/RayonRoutes';

// style
import 'common/asset/style.scss';

console.log(process.env.ENV_BLOCKCHAIN)

ReactDom.render(
  <AppContainer>
    <Router history={history}>
      <RayonRoutes />
    </Router>
  </AppContainer>,
  document.getElementById('root')
);
