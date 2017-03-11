import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Menu } from 'antd';

import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

const TabPane = Tabs.TabPane;

const Component = (props) => {

    if (!window.constructionTreeLoaded) {

        window.addEventListener('click', function (data) {
            props.dispatch({
                type: 'vdCtrlTree/hideCtrlTreeContextMenu'
            });
        }, false)

    }

    window.constructionTreeLoaded = true;

	var prevHoverCtrl = '',
		realSelectedCtrl = '';

	var ctrlPros = {
			onSelect (val, e) {

				realSelectedCtrl = val[0];

				window.VDDesignerFrame.postMessage({
					VDCtrlSelected: {
						vdid: realSelectedCtrl,
						isFromCtrlTree: true
					}
				}, '*');

				var ctrl = e.selectedNodes ? JSON.parse(e.selectedNodes[0].props.ctrl) : JSON.parse(e.node.props.ctrl);

				props.dispatch({
					type: "vdCtrlTree/ctrlSelected",
					payload: ctrl
				});
			},

			onExpand (expandedKeys) {
				props.dispatch({
					type: 'vdCtrlTree/handleTreeExpaned',
					payload: expandedKeys
				})
			},

			onMouseEnter (evt) {

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
						vdid: props.vdCtrlTree.defaultSelectedKeys[0],
						isFromCtrlTree: true
					}
				}, '*');
			},

			onCheck () {

			},

			activePage: props.vdCtrlTree.activePage.key,

			onRightClick (proxy) {

	            let selectedKey = proxy.node.props.eventKey;

	            if (selectedKey.split('-')[0] === 'body') {
	            	return false;
	            }
	            
	            sessionStorage.currentSelectedConstructionKey = selectedKey;

	            ctrlPros.onSelect([selectedKey], proxy);

				props.dispatch({
					type: 'vdCtrlTree/showCtrlTreeContextMenu',
					payload: proxy
				});

			},

			deleteThisConstruction () {
				props.dispatch({
					type: 'vdCtrlTree/deleteCtrl'
				});
			}
		},

		activeControllerTree = props.vdCtrlTree.layout[ctrlPros.activePage],

    	loopControllerTree = data => data.map((item) => {
    		const itemId = !item.id ? '' : '#' + item.id;
    		const itemCls = item.customClassName && item.customClassName.length > 0 ? '.' + item.customClassName.join('.') : '';
    		const title = item.tag + itemCls + itemId;

	        if (item.children) {
	            return <TreeNode ctrl={JSON.stringify(item)} title={title} key={item.vdid}>{loopControllerTree(item.children)}</TreeNode>;
	        }

	        return (
	            <TreeNode ctrl={JSON.stringify(item)} title={title} key={item.vdid} isLeaf={item.isLeaf} />
	        );

	    });

  	return (
  		<div>
      		<Tree showLine
      			defaultExpandAll={true}
        		expandedKeys={props.vdCtrlTree.defaultExpandedKeys}
        		selectedKeys={props.vdCtrlTree.defaultSelectedKeys}
        		onRightClick={ctrlPros.onRightClick}
        		onSelect={ctrlPros.onSelect} onMouseEnter={ctrlPros.onMouseEnter} onMouseLeave={ctrlPros.onMouseLeave} onCheck={ctrlPros.onCheck}
        		onExpand={ctrlPros.onExpand}
        		autoExpandParent={props.vdCtrlTree.autoExpandParent}
      		>
      			{loopControllerTree(activeControllerTree)}
      		</Tree>
            <Menu style={props.vdCtrlTree.constructionMenuStyle} onClick={ctrlPros.deleteThisConstruction} className="context-menu">
       	     	<Menu.Item key="remove">删除</Menu.Item>
            </Menu>
      </div>
  	);

};

function mapSateToProps({ vdCtrlTree, vdpm }) {
  return { vdCtrlTree, vdpm };
}

export default connect(mapSateToProps)(Component);