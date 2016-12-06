import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Menu, Dropdown, Icon } from 'antd';
import gospel from '../../assets/gospel.png'

const Welcome = (props) => {

	const styles = {
		wrapper: {
			width: '100%',
			textAlign: 'center',
			paddingTop: 50,
			height: '100%',
			fontWeight: '200'
		},
		newOrOpenApp: {
			color: '#666',
			display: 'block',
			marginBottom: 6,
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

  	return (
		<div style={styles.wrapper}>
			<img src={gospel} style={{marginBottom: 50}} height="60" width="200" />
			<a style={styles.newOrOpenApp} className="a-hover" onClick={createApp}>
				<Icon type="file-text" style={{marginRight: 5}} />
				新建项目
			</a>
			<a style={styles.newOrOpenApp} className="a-hover" onClick={openApp}>
				<Icon type="folder-open" style={{marginRight: 5}} />
				打开项目
			</a>
			<a style={styles.newOrOpenApp} className="a-hover">
				<Icon type="bulb" style={{marginRight: 5}} />
				查看帮助
			</a>
			<p style={{marginTop: 250}}>先进的web在线集成开发环境</p>
			<p>版本 1.0</p>
		</div>
		
  	);

};

function mapSateToProps({ designer }) {
	return { designer };
}

export default connect(mapSateToProps)(Welcome);
