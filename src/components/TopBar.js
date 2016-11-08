import React , {PropTypes} from 'react';
import {Menu, Icon} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const TopBar = () => {

	var handleClick = function(evt) {
		console.log(evt);
	}

	var styles = {
		sidebar: {
			height: '100%'
		}
	}

	return (
      	<Menu style={styles.sidebar} onClick={handleClick.bind(this)}
        	mode="inline"
      	>
	        <Menu.Item key="mail">
	          	<Icon type="plus" />
	        </Menu.Item>
	        <Menu.Item key="app">
	          	<Icon type="appstore-o" />
	        </Menu.Item>
	        <Menu.Item key="commit">
				<Icon type="check" />
	        </Menu.Item>
	        <Menu.Item key="push">
				<Icon type="upload" />
	        </Menu.Item>
	        <Menu.Item key="pull">
				<Icon type="download" />
	        </Menu.Item>
	        <Menu.Item key="file">
				<Icon type="file" />
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
	);

}

export default TopBar;
