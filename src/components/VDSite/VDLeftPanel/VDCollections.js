import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Collapse } from 'antd';
import { Popover, notification } from 'antd';

import { Row, Col } from 'antd';

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { TreeSelect, message } from 'antd';
const TreeNode = TreeSelect.TreeNode;

import { Form, Input, Cascader, Select, Checkbox, Popconfirm} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

// window.VDDnddata = '';

const Component = (props) => {

	const collectionsProps = {

			deleteCollections(item) {
				console.log(item);
				props.dispatch({
					type: 'vdCollections/deleteCollections',
					payload: item.key
				})
			}
			,
			addNewCollections () {
				console.log(props.vdCollections.collections);
				props.dispatch({
					type: 'vdCollections/setNewCollections'
				})
			}
	}

	const collectionsList = props.vdCollections.collections.map((item, index) =>{
				return (
				          <Row key={index} className="collections-list">
				            <Col span={4}>
				            	<Icon type="hdd" />
				            </Col>
				            <Col span={16} style={{paddingLeft: '10px'}} >
				              <p>{item.name}</p>
				            </Col>
				            <Col span={2}>
				              <Popconfirm title="确定要删除这个数据集吗？" onConfirm={collectionsProps.deleteCollections.bind(this,item)} okText="是" cancelText="否">
				                <a href="#">
				                  <Icon type="delete" />
				                </a>
				              </Popconfirm>
				            </Col>
				            <Col span={2}>
				              <Icon type="edit"/>
				            </Col>
				          </Row>
					)
	})

  	return (
  		<div className="vdctrl-pane-wrapper">
					<Collapse bordered={false} defaultActiveKey='collections-manager'>
		    			<Panel header="数据集管理" key="collections-manager">
				    			<Tooltip placement="left" title="添加数据集">
									<Button className="collections-header-btn" onClick={collectionsProps.addNewCollections}><Icon type="plus"/></Button>
								</Tooltip>
							{collectionsList}
		    			</Panel>
					</Collapse>



  		</div>
  	);

};

function mapSateToProps({ vdCollections }) {
  return { vdCollections };
}

export default connect(mapSateToProps)(Component);
