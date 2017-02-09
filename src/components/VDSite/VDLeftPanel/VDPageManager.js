import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Collapse } from 'antd';
import { Popover } from 'antd';

import { Row, Col } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;

const Component = (props) => {

	const allPagesProps = {
		handlePageListItemClick (e) {

		}
	}

	const newFolderPopoverProps = {
		treeSelectOnChange (value) {

		},

		style: {
	      	width: parseInt($(document).width()) / 2,
	      	height: parseInt($(document).height()) - 50
		}
	}

	const newFolderPopover = {
		content: (
			<div style={newFolderPopoverProps.style}>
		        <h2>文件夹设置</h2>				

		      	<TreeSelect
		        	showSearch
		        	style={{ width: '100%' }}
		        	value={props.vdpm.pageManager.treeSelect.value}
		        	dropdownStyle={{ maxHeight: '100%', overflow: 'auto' }}
		        	placeholder="请选择父级文件夹"
		        	allowClear
		        	treeDefaultExpandAll
		        	onChange={newFolderPopoverProps.treeSelectOnChange}
		      	>
		        	<TreeNode value="parent 1" title="parent 1" key="0-1">
		          		<TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
		            	<TreeNode value="leaf1" title="my leaf" key="random" />
		            	<TreeNode value="leaf2" title="your leaf" key="random1" />
		          	</TreeNode>
		          	<TreeNode value="parent 1-1" title="parent 1-1" key="random2">
		            	<TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
		          	</TreeNode>
		        	</TreeNode>
		      	</TreeSelect>		        
			</div>
		)
	}

  	return (

	    <ul className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
         	<Popover placement="right" title="新建文件夹" content={newFolderPopover.content} trigger="click">
	      		<li className="ant-dropdown-menu-item" role="menuitem">
					<Icon type="folder-open" />&nbsp;新建文件夹
	      		</li>
			</Popover>
	      	<li className=" ant-dropdown-menu-item-divider"></li>

         	<Popover placement="right" title="新建页面" content={newFolderPopover.content} trigger="click">
			    <li className="ant-dropdown-menu-item" role="menuitem">
					<Icon type="file" />&nbsp;新建页面
			    </li>
  			</Popover>
	      	<li className=" ant-dropdown-menu-item-divider"></li>

	    </ul>

   	);

};

function mapSateToProps({ vdpm }) {
  return { vdpm };
}

export default connect(mapSateToProps)(Component);