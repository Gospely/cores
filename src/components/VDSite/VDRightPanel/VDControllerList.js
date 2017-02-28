import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;

const Component = (props) => {

	var prevHoverCtrl = '',
		realSelectedCtrl = '';

	const ctrlPros = {
			onSelect (val, e) {



				realSelectedCtrl = val[0];

				window.VDDesignerFrame.postMessage({
					VDCtrlSelected: {
						vdid: realSelectedCtrl,
						isFromCtrlTree: true
					}
				}, '*');
			},

			onMouseEnter (evt) {

				console.log(evt);

				prevHoverCtrl = evt.node.props.eventKey;

				window.VDDesignerFrame.postMessage({
					VDCtrlSelected: {
						vdid: prevHoverCtrl,
						isFromCtrlTree: true
					}
				}, '*');
			},

			onMouseLeave (evt) {
				window.VDDesignerFrame.postMessage({
					VDCtrlSelected: {
						vdid: realSelectedCtrl,
						isFromCtrlTree: true
					}
				}, '*');
			},

			onCheck () {

			},

			activePage: props.vdCtrlTree.activePage.key
		},

		activeControllerTree = props.vdCtrlTree.layout[ctrlPros.activePage],

    	loopControllerTree = data => data.map((item) => {
    		const itemId = !item.id ? '' : '#' + item.id;
    		const itemCls = item.className.length > 0 ? '.' + item.className.join('.') : '';
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
        	selectedKeys={props.vdCtrlTree.defaultSelectedKeys}
        	onSelect={ctrlPros.onSelect} onMouseEnter={ctrlPros.onMouseEnter} onMouseLeave={ctrlPros.onMouseLeave} onCheck={ctrlPros.onCheck}
      	>
      		{loopControllerTree(activeControllerTree)}
      </Tree>
  	);

};

function mapSateToProps({ vdCtrlTree, vdpm }) {
  return { vdCtrlTree, vdpm };
}

export default connect(mapSateToProps)(Component);