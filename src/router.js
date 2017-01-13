import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';
// import IndexPage from './routes/IndexPage';

export default function({ history, app }) {

  	const routes = [{
      		path: '/',
      		name: 'app',
      		getComponent(nextState, cb) {
        		require.ensure(['./routes/IndexPage'], require => {
          			cb(null, require('./routes/IndexPage'));
        		});
      		},
    	}, {
      		path: '/project/:id',
      		name: 'project',
      		getComponent(nextState, cb) {
        		require.ensure(['./routes/IndexPage'], require => {
          			cb(null, require('./routes/IndexPage'));
        		});
      		},
    	}];

	/*
      	<Route path="/" component={IndexPage}>
      	</Route>
        <Route path="/project/:id" component={IndexPage}>
        </Route>
	*/    	

  	return (
    	<Router history={ history } routes={ routes }>
    	</Router>
  	);
};
