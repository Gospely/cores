import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;

const Component = (props) => {

	const ctrlPros = {
		onSelect () {

		},

		onCheck () {

		}
	}

  	return (
      	<Tree showLine
        	defaultExpandedKeys={props.vdctrl.defaultExpandedKeys}
        	defaultSelectedKeys={props.vdctrl.defaultSelectedKeys}
        	onSelect={ctrlPros.onSelect} onCheck={ctrlPros.onCheck}
      	>
	        <TreeNode title="body" key="0-0">
	          	<TreeNode title="div.Navgation#shit" key="0-0-0">
	            	<TreeNode title="leaf" key="0-0-0-0" />
	            	<TreeNode title="leaf" key="0-0-0-1" />
	          	</TreeNode>
	          	<TreeNode title="p.title#fuck" key="0-0-1">
	            	<TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
	          	</TreeNode>
	        </TreeNode>
      </Tree>
  	);

};

function mapSateToProps({ vdctrl }) {
  return { vdctrl };
}

export default connect(mapSateToProps)(Component);