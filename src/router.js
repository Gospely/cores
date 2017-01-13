import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';

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

  	return (
    	<Router history={ history } routes={ routes }>
    	</Router>
  	);
};
