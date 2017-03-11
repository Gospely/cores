import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Menu, Row, Col, Popconfirm, Popover, Input } from 'antd';

const TabPane = Tabs.TabPane;

const Component = (props) => {

 	const getAllStyles = () => {

 		var cssStyles = props.vdstyles.cssStyleLayout,
 			MenuItems = [];

 		const cancel = () => {

 		}

 		const confirm = (styleName) => {
 			props.dispatch({
 				type: 'vdstyles/removeStyleName',
 				payload: {
 					origin: styleName
 				}
 			})
 		}

 		const content = (styleName) => {

 			const handleStyleManageModifierChange = (e) => {
 				props.dispatch({
 					type: 'vdstyles/handleStyleManageModifierChange',
 					payload: {
 						value: e.target.value
 					}
 				});
 			}

 			const edit = () => {

	 			props.dispatch({
	 				type: 'vdstyles/editStyleName',
	 				payload: {
	 					origin: styleName
	 				}
	 			}); 				

	 			props.dispatch({
	 				type: 'vdstyles/hideStyleManagerModifyPop'
	 			});

				props.dispatch({
					type: 'vdstyles/applyCSSStyleIntoPage',
					payload: {
						activeCtrl: props.vdCtrlTree.activeCtrl
					}
				});

 			}

 			return (
 				<Row>
 					<Col span={18} style={{paddingRight: 10}}>
 						<Input onPressEnter={edit} size="small" onChange={handleStyleManageModifierChange.bind(this)} value={props.vdstyles.styleManager.modifyPop.value} />
 					</Col>
 					<Col span={6}>
 						<Button onClick={edit} size="small">修改</Button>
 					</Col>
 				</Row>
 			);
 		}

 		const showModifyPop = (styleName) => {

 			props.dispatch({
 				type: 'vdstyles/handleStyleManageModifierChange',
 				payload: {
 					value: styleName
 				}
 			}); 			

 			props.dispatch({
 				type: 'vdstyles/toggleStyleManagerModifyPop'
 			});
 		}

 		let cnt = 0;

 		for(var styleName in cssStyles) {
 			cnt ++;
 			MenuItems.push(
		  		<Menu.Item key={styleName}>
		  			<Row>
		  				<Col span={18}>
		  					{styleName}
		  				</Col>
		  				<Col span={6}>
		  				    <Popover visible={props.vdstyles.styleManager.modifyPop.visible} content={content(styleName)} title="修改名称" placement="left" trigger="click">
		  				    	<a onClick={showModifyPop.bind(this, styleName)}><Icon type="edit" /></a>
		  					</Popover>
		  					<Popconfirm placement="left" title="确定删除这个类？" onConfirm={confirm.bind(this, styleName)} onCancel={cancel} okText="是" cancelText="否">
		  						<a><Icon type="delete" /></a>
		  					</Popconfirm>
		  				</Col>
		  			</Row>
		  		</Menu.Item>
 			);
 		}

 		if(cnt === 0) {
 			return (
				<div className="none-operation-obj">暂无样式</div>
 			);
 		}else {
	 		return (
	 			<div>
	 				<p>样式列表：</p>
			  		<Menu
			      		mode="inline"
			  		>
			  			{MenuItems}
					</Menu>
	 			</div>
	 		);
 		}
 	}

  	return getAllStyles();

};

function mapSateToProps({ dashboard, vdstyles, vdCtrlTree }) {
  return { dashboard, vdstyles, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);