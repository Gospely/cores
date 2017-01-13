import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Menu, Dropdown, Icon } from 'antd';
import gospel from '../../assets/gospel.png'

const Welcome = (props) => {

	let splitType = props.devpanel.panels.splitType;
	let maxHeight = '88vh';
	if (splitType == 'horizontal-dbl' || splitType == 'grid') {
		maxHeight = '41vh';
	}
	const styles = {
		wrapper: {
			width: '100%',
			textAlign: 'center',
			paddingTop: 50,
			height: parseInt(document.body.clientHeight) - 70,
			fontWeight: '200',
			maxHeight: maxHeight
		},

		newOrOpenApp: {
			color: '#666',
			display: 'block',
			marginBottom: 6,
			width: 68,
			margin: '0 auto'
		},

		welcomeFooter: {
			marginTop: 500
		}
	};

	const createApp = function() {
  		props.dispatch({
    		type: 'sidebar/showModalNewApp'
      	});
	}
	
	const openApp = function() {
  		props.dispatch({
    		type: 'sidebar/showModalSwitchApp'
      	});
		props.dispatch({
        	type: 'sidebar/getApplications'
      	});
	}

	var welcomeTip = '';

	if(window.disabled) {
		welcomeTip = <div onClick={createApp} className="welcome-screen center-vertical welcome-screen--display-prompt"></div>;
	}else {
		welcomeTip = <div className="welcome-screen center-vertical welcome-screen--display-prompt loaded"></div>;
	}

  	return (
		<div style={styles.wrapper} className="welcome-wrapper">
			<img src={gospel} style={{marginBottom: 50}} height="60" width="200" />
			{welcomeTip}
			<div style={styles.welcomeFooter} className="welcome-footer">
				<p>Gospel Alpha</p>
				<p>为解放开发者生产力而生</p>
			</div>
		</div>
		
  	);

};

function mapSateToProps({ designer, devpanel }) {
	return { designer, devpanel };
}

export default connect(mapSateToProps)(Welcome);
