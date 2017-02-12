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

			},

			activePage: props.vdpm.activePage
		},

		activeControllerTree = props.vdCtrlTree.layout[ctrlPros.activePage],

    	loopControllerTree = data => data.map((item) => {
    		const itemId = item.id == '' ? '' : '#' + item.id;
    		const itemCls = item.className.length > 0 ? item.className.join('.') : '';
    		const title = item.tag + itemCls + itemId;

	        if (item.children) {
	            return <TreeNode title={title} key={item.vdid}>{loopControllerTree(item.children)}</TreeNode>;
	        }

	        return (
	            <TreeNode title={title} key={item.vdid} isLeaf={item.isLeaf} />
	        );

	    });

  	return (
      	<Tree showLine
      		defaultExpandAll={true}
        	defaultExpandedKeys={props.vdCtrlTree.defaultExpandedKeys}
        	defaultSelectedKeys={props.vdCtrlTree.defaultSelectedKeys}
        	onSelect={ctrlPros.onSelect} onCheck={ctrlPros.onCheck}
      	>
      		{loopControllerTree(activeControllerTree)}
      </Tree>
  	);

};

function mapSateToProps({ vdCtrlTree, vdpm }) {
  return { vdCtrlTree, vdpm };
}

export default connect(mapSateToProps)(Component);