import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal, message } from 'antd';
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

			onDragEnter (evt) {
				// console.log(evt);
			},

			onDrop (info) {
				
				// let errors = $(".error-drop-tree-node").removeClass("error-drop-tree-node");
				// if (errors.length > 0) {
				// 	message.error(JSON.parse(sessionStorage.currentDragNodeSpecialParent).errorMessage);
				// }else {
					props.dispatch({
				    	type: "vdCtrlTree/handleTreeNodeDrop",
				    	payload: info
				    })
				// }
			    
			 //    sessionStorage.currentDragNodeSpecialParent = '';
			},

			onDragOver (info) {

				// if (sessionStorage.currentDragNodeSpecialParent) {
				// 	let specialParent = JSON.parse(sessionStorage.currentDragNodeSpecialParent);
				// 	let ctrl = JSON.parse(info.node.props.ctrl);
				// 	let target = $(info.event.target);

				// 	if (target.hasClass("ant-tree-node-content-wrapper")) {
				// 		$(".ant-tree-node-content-wrapper").not(target).removeClass("error-drop-tree-node");	
				// 	}

				// 	var specialTag = specialParent.tag;
				// 	var specialClassName = specialParent.className;
				// 	var ctrlClass = ctrl.className;
				// 	var ctrlTag = ctrl.tag;
				// 	if (typeof ctrlTag === 'object') {
				// 		ctrlTag = ctrlTag[0];
				// 	}
				// 	if ((ctrlClass.indexOf(specialClassName) === -1 || specialTag.indexOf(ctrlTag.toUpperCase()) === -1) && 
				// 		target.hasClass("ant-tree-node-content-wrapper")) {
				// 		target.addClass('error-drop-tree-node');
				// 	}
				// }
			},

			onDragLeave (info) {
				// if ($(info.event.target).hasClass("error-drop-tree-node")) {
				// 	$(info.event.target).removeClass("error-drop-tree-node");
				// }
			},

			onDragStart (info) {
				// console.log(info.node.props.ctrl)
				// let ctrl = JSON.parse(info.node.props.ctrl);
				// for(let i = 0; i < ctrl.attrs.length; i ++) {
				// 	if (ctrl.attrs[i].isAttrSetting) {
				// 		for(let j = 0; j < ctrl.attrs[i].children.length; j ++) {
				// 			let attr = ctrl.attrs[i].children[j];
				// 			if(attr.isSpecialParent) {
				// 				sessionStorage.currentDragNodeSpecialParent = JSON.stringify(attr.value);
				// 			}
				// 			break;
				// 		}
				// 	}
				// 	break;
				// }

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
      			defaultExpandedKeys={props.vdCtrlTree.defaultExpandedKeys}
        		expandedKeys={props.vdCtrlTree.expandedKeys}
        		onRightClick={ctrlPros.onRightClick}
        		onSelect={ctrlPros.onSelect} 
        		onMouseEnter={ctrlPros.onMouseEnter} 
        		onMouseLeave={ctrlPros.onMouseLeave} 
        		onCheck={ctrlPros.onCheck}
        		onExpand={ctrlPros.onExpand}
        		autoExpandParent={props.vdCtrlTree.autoExpandParent}
        		draggable
        		onDragEnter={ctrlPros.onDragEnter}
        		onDrop={ctrlPros.onDrop}
        		onDragOver={ctrlPros.onDragOver}
        		onDragStart={ctrlPros.onDragStart}
        		onDragLeave={ctrlPros.onDragLeave}
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