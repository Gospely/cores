import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal, Tag } from 'antd';
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

const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };


// window.VDDnddata = '';

const Component = (props) => {

	const collectionsProps = {

			deleteCollections(item) {
				console.log(item);
				props.dispatch({
					type: 'vdCollections/deleteCollections',
					payload: item.key
				})
			},

			addNewCollections () {
				console.log(props.vdCollections.collections);
				props.dispatch({
					type: 'vdCollections/setNewCollections'
				})
			},

			listIsOpend(index,listIndex,isOpend) {
				console.log(listIndex,index);
				props.dispatch({
					type: 'vdCollections/changelistIsOpend',
					payload: {
						listIndex:listIndex,
						index:index,
						isOpend:isOpend
					}
				})
			},

			deleteList(index,listItem) {
				props.dispatch({
					type: 'vdCollections/deleteCollectionsList',
					payload: {
						index:index,
						listKey: listItem.key
					}
				})
			},

			isRequired(index,listIndex) {

				props.dispatch({
					type:'vdCollections/changeIsRequired',
					payload: {
						index:index,
						listIndex:listIndex
					}
				})

				console.log(props.vdCollections.collections[index].list[listIndex].isRequired)
			}
	}

	// const collectionsList = {

	// 	
	// },
	
	const collectionsList = props.vdCollections.collections.map((item, index) => {

		const collectionsList = item.list.map((listItem, listIndex) => {
			return (
				<div className="collection-structure-list" key={listIndex} onClick={collectionsProps.listIsOpend.bind(this,index,listIndex,true)}>
					<Row>
						<Col span={16}>
							<Icon type={listItem.icon} /> <span className='collection-structure-list-text'>{listItem.name}</span>
						</Col>
						<Col span={8}>
							{listItem.isOpend ? <Row>
								<Col span={4}>
									<a href="javascript:void(0)" onClick={collectionsProps.deleteList.bind(this,index,listItem)}>
										<i className="fa fa-trash-o" aria-hidden="true"></i>
									</a>
								</Col>
								<Col span={10}>
									<Button type="primary" size='small' onClick={collectionsProps.listIsOpend.bind(this,index,listIndex,false)}>关闭</Button>
								</Col>
								<Col span={10}>
									<Button type="primary" size='small'> 保存</Button>
								</Col>
							</Row> : <div></div> }		
						</Col>
					</Row>
					{listItem.isOpend ? 
						<div className="collections-list-from">
							<p>标签名 :</p>
								<Input size="large" className="collections-poppver-input" defaultValue={listItem.label} />
							<p>提示文本 :</p>
								<Input size="large" className="collections-poppver-input" defaultValue={listItem.helpText}/><br/>
							<Checkbox onChange={collectionsProps.isRequired.bind(this,index,listIndex)}>是否必填</Checkbox>
						</div>:<div></div>
					}	
				</div>
			)
		})
				
		const collectionsPoppver = {
		
			content: (
				<div>
					<h2>数据集设置</h2>
						<p>数据集名称</p>
							<Input size="large" className="collections-poppver-input" defaultValue={item.name} /><br/>
							<Tag>{item.name} <Icon type="edit"/></Tag>
							<Tag>{item.name}s <Icon type="edit"/></Tag><br/>
						<p style={{marginTop:'10px'}}>数据集 URL</p>
							<Input size="large" className="collections-poppver-input" defaultValue={item.name} /><br/>
							<Tag>Tag 1 <Icon type="edit"/></Tag><br/>
						<div className="collections-poppver-text">
							<Icon type="file" /> <span style={{marginLeft: '10px'}}>在页面面板中为团队成员创建集合页面模板.</span>
						</div>
						<div className="collections-poppver-text">
							<Icon type="user-add" /> <span style={{marginLeft: '10px'}}>作者可以在下面编辑每个数据的结构.</span>
						</div>
					<hr style={{marginTop: '20px', marginBottom: '20px'}}/>
					<Row style={{marginTop:'10px'}}>
						<Col span={18}><h2>每个单独数据的结构</h2></Col>
						<Col span={6}><Button type="primary"><Icon type="plus" />添加新的字段</Button></Col>
					</Row>
					<div className="collection-structure">
						<div className="collection-structure-list">
							<i className="fa fa-text-width" aria-hidden="true"></i> <span className='collection-structure-list-text'>名称</span>
						</div>
							{collectionsList}
						<div className="collection-structure-list">
							<a href="javascript:void(0)">
								<Icon type="plus" /><span className='collection-structure-list-text'>添加新的字段</span>
							</a>
						</div>
					</div>

				</div>
			)

		};

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
								<Popover className="collections-popover" placement="right" title={item.name} content={collectionsPoppver.content} trigger="click">
									<a href="#">
				              			<Icon type="edit"/>
			              			</a>
			              		</Popover>
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
