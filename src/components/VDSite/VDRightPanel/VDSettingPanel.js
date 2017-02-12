import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Radio, Popover } from 'antd';

import { Tree, Form, Switch, Input, Cascader, Select, Row, Col, Checkbox, Menu, Dropdown, message, Tag, Table, Popconfirm} from 'antd';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Component = (props) => {

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

    const customAttrProps = {
    	creatorContent: (
	      	<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="key">
					<Input size="small" />
				</FormItem>
				<FormItem {...formItemLayout} label="value">
					<Input size="small" />
				</FormItem>
				<FormItem>
					<Button size="small">保存</Button>
				</FormItem>
			</Form>
    	),

    	modifyContent: (
	      	<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="key">
					<Input size="small" />
				</FormItem>
				<FormItem {...formItemLayout} label="value">
					<Input size="small" />
				</FormItem>
				<FormItem>
					<Button size="small">保存</Button>
				</FormItem>
			</Form>
    	),

    	onVisibleChange () {

    	}
    }

    const linkSettingProps = {
		
    	linkSettingTemplate: props.vdcore.linkSetting.list.map( (item, index) => {
			return (
				<RadioButton key={item.value} value={item.value}>
	              	<Tooltip placement="top" title={item.tip}>
	      				<Icon type={item.icon} />
	      			</Tooltip>
		      	</RadioButton>
			);
		}),

    	tpl: [(
	      	<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="链接地址">
					<Input size="small" />
				</FormItem>

				<FormItem {...formItemLayout} label="新窗口">
					<Switch size="small" />
				</FormItem>
	      	</Form>
    	), (
	      	<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="邮箱地址">
					<Input size="small" />
				</FormItem>
	      	</Form>
    	), (
	      	<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="手机号码">
					<Input size="small" />
				</FormItem>
	      	</Form>
    	), (
	      	<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="页面">
				    <Select size="small" value="请选择页面">
				      	<Option key="sss" value="h1">h1</Option>
				    </Select>
				</FormItem>
				<FormItem {...formItemLayout} label="新窗口">
					<Switch size="small" />
				</FormItem>
	      	</Form>
    	), (
			<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="元素">
				    <Select size="small" value="请选择元素">
				      	<Option key="sss" value="h1">h1</Option>
				    </Select>
				</FormItem>
	      	</Form>
    	)],

    	onChange (e) {
    		props.dispatch({
    			type: 'vdcore/handleLinkSettingValueChange',
    			payload: e.target.value
    		});
    	}

    }

    const attrsPanels = () => {
    	return props.vdCtrlTree.activeCtrl.attrs.map((item, index) => {
    		console.log('sss',item);

    		const formTypeGenerator = (item) => {

    			const formTypeList = {
    				input (item) {
		    			return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								<Input value={item.value} size="small" />
							</FormItem>
		    			);
    				},

    				multipleSelect (item) {
    					console.log(item);
    					return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								<Select
								    multiple
								    style={{ width: '100%' }}
								    defaultValue={item.value}
								    size="small"
								 >
								    {	
								    	item.children.map((val, key) => {
								    		return (
									    	  <Option key={key} value={val}>{val}</Option>
								    		);
								    	})
								    }
							  	</Select>
							</FormItem>
    					);
    				}
    			}

    			return formTypeList[item.type](item);
    		}

    		const formGenerator = (items) => {
    			console.log(items);
    			return (
			      	<Form className="form-no-margin-bottom">
			      		{
			    			items.map((item, index) => {
			    				return formTypeGenerator(item);
    						})
			      		}
			      	</Form>
    			);
    		}

			const panelGenerator = (key) => {
				return (
			    	<Panel header={item.title} key={item.key}>
			    		{formGenerator(item.children)}
					</Panel>
				);
			}

    		let panel = panelGenerator();
    		return panel;
    	});
    }

			   //  <Panel header="基础设置" key="basic">

			   //    	<Form className="form-no-margin-bottom">
						// <FormItem {...formItemLayout} label="ID">
						// 	<Input size="small" />
						// </FormItem>

						// <FormItem {...formItemLayout} label="可视屏幕">
						// 	<Select
						// 	    multiple
						// 	    style={{ width: '100%' }}
						// 	    placeholder="Please select"
						// 	    defaultValue={['a10', 'c12']}
						// 	    size="small"
						// 	 >
						// 	    {children}
						//   	</Select>
						// </FormItem>
			   //    	</Form>

			   //  </Panel>
  	return (

  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['basic', 'link', 'custom-attr', 'heading-type']}>
				{attrsPanels()}
			    <Panel header="链接设置" key="link">
					<RadioGroup onChange={linkSettingProps.onChange} defaultValue="link" size="small">
						{linkSettingProps.linkSettingTemplate}
				    </RadioGroup>

			    	{linkSettingProps.tpl[props.vdcore.linkSetting.activeLinkType]}
			    </Panel>
			    <Panel header="标题大小" key="heading-type">
			      	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="标题大小">
						    <Select size="small" value="请选择">
						      	<Option key="sss" value="h1">h1</Option>
						    </Select>
						</FormItem>
			      	</Form>
			    </Panel>
			    <Panel header="自定义属性" key="custom-attr">
			    	<Form>
						<FormItem {...formItemLayout} label="">
							<Popover
					        	content={customAttrProps.creatorContent}
					        	title="新建 自定义属性"
					        	trigger="click"
					      	>
								<Button type="circle" size="small"><Icon type="plus" /></Button>
					      	</Popover>
						</FormItem>

					    <ul style={{marginTop: '-15px'}} className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
					      <li className="ant-dropdown-menu-item" role="menuitem">
					        <Row>
					          <Col span={18}>
					            <p>key1="val2"</p>
					          </Col>
					          <Col span={3}>

								<Popover
						        	content={customAttrProps.modifyContent}
						        	title="修改 自定义属性"
						        	trigger="click"
						      	>
					            	<Icon type="edit" />
						      	</Popover>

					          </Col>
					          <Col span={3}>
					            <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消">
									<Icon type="delete" />
  								</Popconfirm>
					          </Col>
					        </Row>
					      </li>
					      <li className="ant-dropdown-menu-item-divider"></li>

					      <li className="ant-dropdown-menu-item" role="menuitem">
					        <Row>
					          <Col span={18}>
					            <p>key="val"</p>
					          </Col>
					          <Col span={3}>
								<Popover
						        	content={customAttrProps.modifyContent}
						        	title="修改 自定义属性"
						        	trigger="click"
						      	>
					            	<Icon type="edit" />
						      	</Popover>
					          </Col>
					          <Col span={3}>
					            <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消">
									<Icon type="delete" />
  								</Popconfirm>
					          </Col>
					        </Row>
					      </li>
					      <li className=" ant-dropdown-menu-item-divider"></li>
					    </ul>

					</Form>
			    </Panel>
			</Collapse>
  		</div>

  	);

};

function mapSateToProps({ vdcore, vdctrl, vdCtrlTree }) {
  return { vdcore, vdctrl, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);