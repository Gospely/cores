import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Collapse } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Component = (props) => {

	const allPagesProps = {
		handlePageListItemClick (e) {

		}
	}

  	return (
	    <div className="vd-allpages-list">
	      <Menu onClick={allPagesProps.handlePageListItemClick}
	      	style={{ width: '100%' }}
	      	defaultOpenKeys={['新建文件夹']}
	      	selectedKeys={[props.vdpm.currentActivePageListItem]}
	      	mode="inline"
	      >
	        <Menu.Item key="new-folder">
				<Icon type="folder-open" />
	          	新建文件夹
	        </Menu.Item>
	        <Menu.Item key="new-page">
				<Icon type="file" />
		        新建页面
	        </Menu.Item>
	      </Menu>
	    </div>
   	);

};

function mapSateToProps({ vdpm }) {
  return { vdpm };
}

export default connect(mapSateToProps)(Component);