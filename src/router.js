import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';
import IndexPage from './routes/IndexPage';
import auth from './utils/auth';

import Products from './routes/Products';

export default function({ history }) {

  auth(history);
  return (
    <Router history={history}>
      	<Route path="/" component={IndexPage}>
      	</Route>
        <Route path="/project/:id" component={IndexPage}>
        </Route>
    	<Route path="/products" component={Products} />
    </Router>
  );
};
