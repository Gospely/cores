import React , {PropTypes} from 'react';
import {Menu, Icon, Modal} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const LeftSidebar = () => {

	var visible = false;

	var handleClick = function(evt) {
		console.log(evt);

		switch(evt.key) {
			case 'create_app':
				visible = true;
				console.log(visible);
				break;
			default:
				break;
		}
	}

	var styles = {
		sidebar: {
			height: '100%'
		}
	}

	var handleOk = function() {
		visible = false;
	}

	var handleCancel = function() {
		visible = false;
	}

	return (
		<div>
	      	<Menu 
	      		style={styles.sidebar} 
	      		onClick={handleClick.bind(this)} 
	      		mode="inline">

		        <Menu.Item key="create_app">
		          	<Icon type="plus" />
		        </Menu.Item>
		        <Menu.Item key="switch_app">
		          	<Icon type="appstore-o" />
		        </Menu.Item>
		        <Menu.Item key="commit">
					<Icon type="check" switch_app/>
		        </Menu.Item>
		        <Menu.Item key="push">
					<Icon type="upload" />
		        </Menu.Item>
		        <Menu.Item key="pull">
					<Icon type="download" />
		        </Menu.Item>
		        <Menu.Item key="open_file">
					<Icon type="file" />
		        </Menu.Item>        
		        <Menu.Item key="open_terminal">
					<Icon type="code-o" />
		        </Menu.Item>        
		        <Menu.Item key="start">
					<Icon type="play-circle-o" />
		        </Menu.Item>        
		        <Menu.Item key="pause">
					<Icon type="pause-circle-o" />
		        </Menu.Item>

	      	</Menu>

	    	<Modal title="Basic Modal" visible={visible}
	          	onOk={handleOk} onCancel={handleCancel}
	        >
	          <p>some contents...</p>
	          <p>some contents...</p>
	          <p>some contents...</p>
	        </Modal>
        </div>

	);

}

export default LeftSidebar;
