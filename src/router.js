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
    	},{
      		path: '*',
      		name: 'main',
      		getComponent(nextState, cb) {
                console.log('main');
                if(window.location.href.indexOf('localhost')){
                    window.location.href = 'http://localhost:8989';
                }else {
                    window.location.href = 'http://ide.gospely.com';
                }
      		},
    	}];

  	return (
    	<Router history={ history } routes={ routes }>
    	</Router>
  	);
};
