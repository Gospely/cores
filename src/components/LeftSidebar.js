import React , {PropTypes} from 'react';
import {Menu, Icon, Modal} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const LeftSidebar = ({
	modalNewAppVisible,
	handleClick,
	createApp,
	cancelNewApp,

	modalSwitchAppVisible,
	switchApp,
	cancelSwitchApp
}) => {

	var styles = {
		sidebar: {
			height: '100%'
		},

		ifr: {
			width: '100%',
			height: parseInt(document.body.clientHeight) - 300,
			border: 'none'
		},

		wrapper: {
			height: '100%'
		}
	}

	var handleOk = function() {
		// visible = false;
	}

	var handleCancel = function() {
		// visible = false;
	}

	return (
		<div style={styles.wrapper}>
	      	<Menu 
	      		style={styles.sidebar} 
	      		onClick={handleClick} 
	      		mode="inline">

		        <Menu.Item key="create">
		          	<Icon type="plus" />
		        </Menu.Item>
		        <Menu.Item key="switch">
		          	<Icon type="appstore-o" />
		        </Menu.Item>
		        <Menu.Item key="commit">
					<Icon type="check"/>
		        </Menu.Item>
		        <Menu.Item key="push">
					<Icon type="upload" />
		        </Menu.Item>
		        <Menu.Item key="pull">
					<Icon type="download" />
		        </Menu.Item>
		        <Menu.Item key="file">
					<Icon type="file-text" />
		        </Menu.Item>        		        
		        <Menu.Item key="terminal">
					<Icon type="code-o" />
		        </Menu.Item>        
		        <Menu.Item key="start">
					<Icon type="play-circle-o" />
		        </Menu.Item>        
		        <Menu.Item key="pause">
					<Icon type="pause-circle-o" />
		        </Menu.Item>

	      	</Menu>

	    	<Modal width="80%"  title="新建应用" visible={modalNewAppVisible}
	          	onOk={createApp} onCancel={cancelNewApp}
	        >
	        	<iframe style={styles.ifr} src="http://localhost:8088/#!/apps/new"></iframe>
	        </Modal>

	    	<Modal width="60%"  title="切换应用" visible={modalSwitchAppVisible}
	          	onOk={switchApp} onCancel={cancelSwitchApp}
	        >
	        </Modal>

        </div>

	);

}

export default LeftSidebar;
