import React , { PropTypes } from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Radio, Popover } from 'antd';

import randomString from '../../../utils/randomString.js';

import { Tree, Form, Switch, Input, Cascader, Select, Row, Col, Checkbox, Menu, Dropdown, message, Tag, Table, Popconfirm } from 'antd';

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

   	const specialAttrList = ['custom-attr', 'link-setting', 'list-setting', 'heading-type', 'image-setting', 'select-setting', 'tabs-setting', 'slider-settings'];

    const attrsPanels = () => {

    	let attrs = props.vdCtrlTree.activeCtrl.attrs;
    	   console.log(attrs)

    	let tmp;
    	let flag = false;


    	for(let i = 0, len = attrs.length; i < len; i ++) {

			if (!attrs[i].key) {
				flag = true;
				tmp = {
					title: '属性设置',
					key: randomString(8, 10),
					children: []
				}
				tmp.children.push(attrs[i]);
			}
    	}
    	if (flag) {
    		attrs = [tmp];	
    	}


    	return attrs.map((item, index) => {

    		//针对比如自定义属性这种拥有复杂交互的表单，不适合在控件属性中写form结构



    			if(specialAttrList.indexOf(item.key) != -1) {
		    		const specialAttrHandler = {
		    			'custom-attr' (item) {

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

		    				return (
							    <Panel header={item.title} key={item.key}>
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
		    				);
		    			},

		    			'link-setting' (item) {

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

		    				return (
							    <Panel header={item.title} key={item.key}>
									<RadioGroup onChange={linkSettingProps.onChange} defaultValue="link" size="small">
										{linkSettingProps.linkSettingTemplate}
								    </RadioGroup>

							    	{linkSettingProps.tpl[props.vdcore.linkSetting.activeLinkType]}
							    </Panel>
		    				);
		    			},

		    			'list-setting' (item) {
		    				return (
							    <Panel header={item.title} key={item.key}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="列表类型">
									        <RadioGroup defaultValue="ul" size="small">
										      	<RadioButton value="ul">
										      		无序列表
									      		</RadioButton>
										      	<RadioButton value="ol">
										      		有序列表
										      	</RadioButton>
										    </RadioGroup>
										</FormItem>
										<FormItem {...formItemLayout} label="无序号">
											<Switch size="small" />
										</FormItem>
							      	</Form>
							    </Panel>
		    				);
		    			},

		    			'heading-type' (item) {
		    				return (
							    <Panel header={item.title} key={item.key}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="标题大小">
										    <Select size="small" value={item.value}>
										    {
										    	item.children.map((headingType, index) => {
										    		return (
												      	<Option key={index} value={headingType}>{headingType}</Option>
										    		);
										    	})
										    }
										    </Select>
										</FormItem>
							      	</Form>
							    </Panel>
		    				);
		    			},

		    			'image-setting' (item) {

						    const bgUploaderProps = {
						 		listType: 'picture',
							  	defaultFileList: [{
							    	uid: -1,
							    	name: 'xxx.png',
							    	status: 'done',
							    	url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
							    	thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
							  	}]
						    }

		    				return (
							    <Panel header={item.title} key={item.key}>

									<div className="guidance-panel-wrapper">
										<div className="guidance-panel-child">
											<div className="bem-Frame">
												<div className="bem-Frame_Head">
													<div className="bem-Frame_Legend">
														<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
															图片资源
														</div>
													</div>
												</div>
												<div className="bem-Frame_Body">
													<Upload {...bgUploaderProps}>
														<Button><i className="fa fa-cloud-upload"></i>&nbsp;上传图片</Button>								
												  	</Upload>

													<Button style={{position: 'absolute', right: '30px', top: '60px'}}><i className="fa fa-picture-o"></i>&nbsp;图片资源</Button>							
												</div>
											</div>

											<div className="bem-Frame">
												<div className="bem-Frame_Head">
													<div className="bem-Frame_Legend">
														<div className="bem-SpecificityLabel bem-SpecificityLabel-local bem-SpecificityLabel-text">
															大小
														</div>
													</div>
												</div>
												<div className="bem-Frame_Body">
													<Row>

													  	<Col span={11} style={{paddingRight: '5px'}}>
													      	<Form className="form-no-margin-bottom">
																<FormItem {...formItemLayout} label="宽度">
																	<Input size="small" />
																</FormItem>
													      	</Form>
													  	</Col>
													  	<Col span={13} style={{paddingLeft: '5px'}}>
													      	<Form className="form-no-margin-bottom">
																<FormItem {...formItemLayout} label="高度">
																	<Input size="small" />
																</FormItem>
													      	</Form>
													  	</Col>

													</Row>

												</div>
											</div>

										</div>
									</div>

							    </Panel>
		    				);
		    			},

		    			'select-setting' () {

						    const selectSettingProps = {
						    	creatorContent: (
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="说明">
											<Input size="small" />
										</FormItem>
										<FormItem {...formItemLayout} label="值">
											<Input size="small" />
										</FormItem>
										<FormItem>
											<Button size="small">保存</Button>
										</FormItem>
									</Form>
						    	),

						    	modifyContent: (
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="说明">
											<Input size="small" />
										</FormItem>
										<FormItem {...formItemLayout} label="值">
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

		    				return (
							    <Panel header={item.title} key={item.key}>
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="名称">
											<Input size="small" />
										</FormItem>
										<FormItem {...formItemLayout} label="允许多选">
											<Switch size="small" />
										</FormItem>
										<Button type="circle" size="small"><Icon type="plus" /></Button>
							      	</Form>

								    <ul style={{marginTop: '-15px'}} className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
								      <li className="ant-dropdown-menu-item" role="menuitem">
								        <Row>
								          <Col span={18}>
								            <p>key1="val2"</p>
								          </Col>
								          <Col span={3}>

											<Popover
									        	content={selectSettingProps.modifyContent}
									        	title="修改 选项"
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
									        	content={selectSettingProps.modifyContent}
									        	title="修改 选项"
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

							    </Panel>
		    				);
		    			},

		    			'tabs-setting' () {

						    const props = {
						    	creatorContent: (
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="名称">
											<Input size="small" />
										</FormItem>
										<FormItem>
											<Button size="small">保存</Button>
										</FormItem>
									</Form>
						    	),

						    	modifyContent: (
							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="名称">
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

		    				return (
							    <Panel header={item.title} key={item.key}>

							    	<Row>
							    		<Col span={12}>
									      	<Form className="form-no-margin-bottom">
												<FormItem {...formItemLayout} label="淡入时间">
													<Input size="small" />
												</FormItem>
									      	</Form>
							    		</Col>
							    		<Col span={12}>
									      	<Form className="form-no-margin-bottom">
												<FormItem {...formItemLayout} label="淡出时间">
													<Switch size="small" />
												</FormItem>
									      	</Form>
							    		</Col>
							    	</Row>

							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="过渡效果">
											<Select
											    style={{ width: '100%' }}
											    defaultValue={item.value}
											    size="small"
											>
									    	  <Option key="111">111</Option>
										  	</Select>
										</FormItem>
							      	</Form>

									<Button type="circle" size="small"><Icon type="plus" /></Button>

								    <ul style={{marginTop: '-15px'}} className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
								      <li className="ant-dropdown-menu-item" role="menuitem">
								        <Row>
								          <Col span={18}>
								            <p>key1="val2"</p>
								          </Col>
								          <Col span={3}>

											<Popover
									        	content={props.modifyContent}
									        	title="修改 标签"
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
									        	content={props.modifyContent}
									        	title="修改 标签"
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
								    </ul>

							    </Panel>
		    				);
		    			},

		    			'dropdown-menu' () {
		    				return (
							    <Panel header={item.title} key={item.key}>
							    	<Row>
							    		<Col span={12}>
							    			<Button size="small"><Icon type="bars" />打开菜单</Button>
							    		</Col>
							    		<Col span={12}>
							    			<Button size="small"><Icon type="plus" />新增菜单</Button>
							    		</Col>
							    	</Row>
							    </Panel>
		    				);
		    			},

		    			'slider-settings' () {
		    				return (
							    <Panel header={item.title} key={item.key}>
							    	<Row>
							    		<Col span={12}>
							    			<Button size="small"><Icon type="plus" />增加一个</Button>
							    		</Col>
							    		<Col span={12}>
							    			<Col span={12} style={{textAlign: 'right'}}>
								    			<Button size="small"><Icon type="left" /></Button>
							    			</Col>
							    			<Col span={12} style={{textAlign: 'left'}}>
								    			<Button size="small"><Icon type="right" /></Button>
							    			</Col>
							    		</Col>
							    	</Row>
							    </Panel>
		    				);		    				
		    			},

		    			'navbar-setting' () {
		    				return (
							    <Panel header={item.title} key={item.key}>
							    	<Row>
							    		<Col span={12}>
							    			<Button size="small"><Icon type="bars" />打开菜单</Button>
							    		</Col>
							    		<Col span={12}>
							    			<Button size="small"><Icon type="plus" />新增菜单</Button>
							    		</Col>
							    	</Row>

							      	<Form className="form-no-margin-bottom">
										<FormItem {...formItemLayout} label="菜单类型">
											<select size="small">
										    	  <Option key="drop-down" value="drop-down">向下</Option>
										    	  <Option key="over-right" value="over-right">靠右</Option>
										    	  <Option key="over-left" value="over-left">靠左</Option>
											</select>
										</FormItem>
							      	</Form>

							    </Panel>
		    				);
		    			}
					};

					return specialAttrHandler[item.key](item);
    			}

    		const formTypeGenerator = (item) => {

    			const formTypeList = {
    				input (item) {

    					var inputTpl = item.props ? (
							<Input {...item.props} value={item.value} size="small" />
    					) : (
							<Input value={item.value} size="small" />
    					);

		    			return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								{inputTpl}
							</FormItem>
		    			);
    				},

    				multipleSelect (item) {
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
									    	  <Option key={key} value={val.value}>{val.name}</Option>
								    		);
								    	})
								    }
							  	</Select>
							</FormItem>
    					);
    				},

    				select (item) {
    					return (
							<FormItem key={item.id} {...formItemLayout} label={item.desc}>
								<Select
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
    				},

    				toggle (item) {
						return (
							<FormItem {...formItemLayout} label={item.desc}>
								<Switch size="small" checked={item.value} />
							</FormItem>
						);
    				}
    			}

    			return formTypeList[item.type](item);
    		}

    		const formGenerator = (items) => {
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

			const panelGenerator = (attrItem) => {
				return (
			    	<Panel header={item.title} key={item.key}>
			    		{formGenerator(attrItem.children)}
					</Panel>
				);
			}

				let panel = panelGenerator(item);
    			return panel;
    		
    	});
    }

    const settingPanelDefaultActiveKey = [];

    for (var i = 0; i < specialAttrList.length; i++) {
    	var attr = specialAttrList[i];
    	settingPanelDefaultActiveKey.push(attr);
    };

    settingPanelDefaultActiveKey.push('basic');

  	return (

  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={settingPanelDefaultActiveKey}>
				{attrsPanels()}
			</Collapse>
  		</div>

  	);

};

function mapSateToProps({ vdcore, vdctrl, vdCtrlTree }) {
  return { vdcore, vdctrl, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);
