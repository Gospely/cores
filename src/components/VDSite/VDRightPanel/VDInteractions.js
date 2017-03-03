import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Row, Col, Card, Switch } from 'antd';

import { Radio, Input, Form, Select, Slider, InputNumber } from 'antd';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const OptGroup = Select.OptGroup;

const InputGroup = Input.Group;

import { Menu, Popconfirm, Popover } from 'antd';

const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item;

/**/

const Component = (props) => {

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

	const radioStyle = {
      	display: 'block',
      	height: '30px',
      	lineHeight: '30px',
    };

    const modelActions = {
    	showModalAddInitalAppearance () {
    		props.dispatch({
    			type: 'vdanimations/showModalAddInitalAppearance'
    		})
    	},

    	hideModalAddInitalAppearabce () {
    		props.dispatch({
    			type: 'vdanimations/hideModalAddInitalAppearabce'
    		})
    	},

    	showModelEditTrigger () {
    		props.dispatch({
    			type: 'vdanimations/showModelEditTrigger'
    		})
    	},

    	hideModelEditTrigger () {
    		props.dispatch({
    			type: 'vdanimations/hideModelEditTrigger'
    		})
    	},

    	triggerSelected (name) {
    		props.dispatch({
    			type: 'vdanimations/showModelEditTrigger'
    		})
    		props.dispatch({
    			type: 'vdanimations/triggerSelected',
    			payload: name
    		})
    	},

    	switchAffectOtherElem () {
    		props.dispatch({
    			type: 'vdanimations/switchAffectOtherElem'
    		})
    	},

    	showModalNewStep () {
    		props.dispatch({
    			type: 'vdanimations/showModalNewStep'
    		})
    	},

    	hideModalNewStep () {
    		props.dispatch({
    			type: 'vdanimations/hideModalNewStep'
    		})
    	}
    }

    const triggerListPopover = (
		<Row>
			{props.vdanimations.interactionCreator.triggerList.map((trigger) => {
				return (
					<Col span="6" key={trigger.name}>
						<Card style={{ width: 40, marginBottom: 10, cursor: 'pointer'}} 
								bodyStyle={{ padding: 0 }}
								onClick={modelActions.triggerSelected.bind(this, trigger.name)}
						>
						    <div className="custom-image">
						      <img width="40" height="20" alt="example" width="100%" src={trigger.src} />
						    </div>
						    <div className="custom-card">
						      {trigger.name}
						    </div>
						</Card>
					</Col>
				)
			})}
		</Row>
	)

    const interactionCreator = {
    	content: (
    		<div>
		    	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="动画名称">
						<Input size="small" />
					</FormItem>
		    	</Form>

		    	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="初始动作">
					</FormItem>
		    	</Form>

		    	<div style={{paddingLeft: '10px', paddingRight: '10px'}}>

		      		<Menu className="interaction-list">
		      			<Menu.Item>
		      				<Row>
								<Col span={18}>
				      				<span>None</span>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									
							        <Icon type="edit" onClick={modelActions.showModalAddInitalAppearance} />

						            <Popconfirm title="确认删除吗？" placement="left" okText="确定" cancelText="取消">
										<Icon type="delete" />
									</Popconfirm>
								</Col>
		      				</Row>
		       			</Menu.Item>
		      		</Menu>

		    	</div>

		    	<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="触发条件">
					</FormItem>
		    	</Form>

		    	<div style={{paddingLeft: '10px', paddingRight: '10px'}}>

		      		<Menu className="interaction-list">
		      			<Menu.Item>
		      				<Row>
								<Col span={18}>
				      				<span>None</span>
								</Col>
								<Col span={6} style={{textAlign: 'right'}}>
									<Popover
							        	content={triggerListPopover}
							        	title="选择触发动作"
							        	trigger="click"
							        	placement="left"
							      	>
							            <Icon type="edit" />
							      	</Popover>
						            <Popconfirm title="确认删除吗？" placement="left" okText="确定" cancelText="取消">
										<Icon type="delete" />
									</Popconfirm>
								</Col>
		      				</Row>
		       			</Menu.Item>
		      		</Menu>

		    	</div>

    		</div>
    	),

    	handleOk () {
    		props.dispatch({
    			type: 'vdanimations/hideInteractionCreator'
    		});
    	},

    	handleCancel () {
    		props.dispatch({
    			type: 'vdanimations/hideInteractionCreator'
    		});
    	},

    	show () {
    		props.dispatch({
    			type: 'vdanimations/showInteractionCreator'
    		});
    	},

    	
    }

    const interactionEditor = {
    	content: (<div>111</div>)
    }

    const transitionAddPopover = (
		<Tabs defaultActiveKey="Move" size="small" animated={false}>
		    <TabPane tab="Move" key="Move">
				<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						X轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>

				<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Y轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>

			    <InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Z轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>

		    </TabPane>
		    <TabPane tab="Scale" key="Scale">
		    	<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						X轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>

				<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Y轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>

			    <InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Z轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>
		    </TabPane>
		    <TabPane tab="Rotate" key="Rotate">
		    	<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						X轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="DEG"
    				    style={{ width: '30%' }}
    				>
    					<Option key="DEG">DEG</Option>
    				</Select>
			    </InputGroup>

				<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Y轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="DEG"
    				    style={{ width: '30%' }}
    				>
    					<Option key="DEG">DEG</Option>
    				</Select>
			    </InputGroup>

			    <InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Z轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="DEBG"
    				    style={{ width: '30%' }}
    				>
    					<Option key="DEG">DEG</Option>
    				</Select>
			    </InputGroup>
		    </TabPane>
		    <TabPane tab="Skew" key="Skew">
		    	<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						X轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="DEG"
    				    style={{ width: '30%' }}
    				>
    					<Option key="DEG">DEG</Option>
    				</Select>
			    </InputGroup>

				<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						Y轴方向:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="DEG"
    				    style={{ width: '30%' }}
    				>
    					<Option key="DEG">DEG</Option>
    				</Select>
			    </InputGroup>
		    </TabPane>
		</Tabs>
    )

	const transformSettingPopover = (
		<Form style={{width: 400}}>

			<FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label={(<i title="时间" className='fa fa-clock-o'></i>)}>
				<Row>
			        <Col span={18}>
			          	<Slider min={1} max={20}/>
			        </Col>
			        <Col span={4}>
			          	<InputNumber/>
			        </Col>
			        <Col span={1}>MS</Col>
			    </Row>
			</FormItem>

			<InputGroup compact>
				<div style={{width: '16.7%', display: 'inline-block'}}>
					<i className="fa fa-line-chart"></i>
				</div>
		      	<Select
				    placeholder="变化速度曲线"
				    defaultValue="ease"
				    style={{ width: '30%' }}
				>
					<Option key="ease">Ease</Option>
					<Option key="linear">Linear</Option>
					<Option key="ease-in">Ease In</Option>
					<Option key="ease-out">Ease Out</Option>
					<Option key="ease-in-out">Ease In Out</Option>
					<Option key="cubic-bezier">cubic Bezier</Option>
				</Select>
		      	<Input style={{ width: '53.3%' }} disabled={true} defaultValue="cubic-bezier(0.25,0.1,0.25,1)" />
		    </InputGroup>

		</Form>
    )

    const initialApperanceModal = {
    	content: (
    		<Form className="form-no-margin-bottom">
				<FormItem {...formItemLayout} label="名称(可选)">
					<Input size="small" />
				</FormItem>

		    	<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="变换">
	      			<Tooltip placement="top" title="添加变换">
	      				<Popover title='添加变换' placement="leftTop" trigger="click" content={transitionAddPopover}>
			      			<Button style={{textAlign: 'center'}}>
			      				<i className="fa fa-plus"></i>
			      			</Button>
			      		</Popover>
		      		</Tooltip>
	      		</FormItem>

	      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -3}}>
					<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
						<Row>
							<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
								<i className="fa fa-eye"></i>
							</Col>
							<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
								<i className="fa fa-chain"></i>
							</Col>
							<Col span={14} style={{textAlign: 'center', cursor: 'pointer'}}>
								暂无
							</Col>
							<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
								<i className="fa fa-trash-o"></i>
							</Col>
						</Row>
					</div>
				</FormItem>

				<InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						宽度:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    					<Option key="auto">auto</Option>
    				</Select>
			    </InputGroup>

			    <InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						高度:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="PX">PX</Option>
    					<Option key="%">%</Option>
    					<Option key="%">auto</Option>
    				</Select>
			    </InputGroup>

			    <InputGroup compact style={{marginTop: 5}}>
					<div style={{width: '30%', display: 'inline-block'}}>
						透明度:
					</div>
					<Input style={{ width: '40%' }} defaultValue="0" />
			      	<Select
    				    placeholder="选择单位"
    				    defaultValue="PX"
    				    style={{ width: '30%' }}
    				>
    					<Option key="%">%</Option>
    				</Select>
			    </InputGroup>

			    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="布局">
				    <RadioGroup defaultValue="block" size="small">
				      	<RadioButton value="block">
	  		              	<Tooltip placement="top" title="block">
				      			<svg width="18" height="14" viewBox="0 0 22 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".15" fill="currentColor" d="M19 3v8H3V3h16m1-1H2v10h18V2z"></path><path fill="currentColor" d="M19.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h17.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 19.8 1zm.2 11H2V2h18v10z"></path><path opacity=".35" fill="currentColor" d="M3 3h16v8H3z"></path></svg>
				      		</Tooltip>
			      		</RadioButton>
				      	<RadioButton value="inline-block">
	  		              	<Tooltip placement="top" title="inline-block">
								<svg width="28" height="14" viewBox="0 0 28 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M25 3v8H3V3h22m1-1H2v10h24V2z" opacity=".15"></path><path opacity=".35" fill="currentColor" d="M8.418 9.8H7.66L7.25 11h1.58l-.232-.676-.18-.525zM3 11h.567l2.916-7.94h3.15L11 6.78V3H3v8zm15.12-1.002a3.302 3.302 0 0 1-.48-.586c-.173.343-.42.653-.73.888.002 0 .004-.002.005-.003l-.008.006.003-.003a3.145 3.145 0 0 1-1.092.55c-.4.11-.825.15-1.303.15h6.017a4.416 4.416 0 0 1-1.12-.215 3.51 3.51 0 0 1-1.292-.787zM14.237 3c.49 0 .853.014 1.167.06.335.05.656.16.953.314h.003l.004.003c.365.19.694.492.898.866.13.234.197.49.24.747.16-.298.343-.58.578-.82v-.002c.358-.366.8-.643 1.287-.826a4.373 4.373 0 0 1 1.557-.272 5.67 5.67 0 0 1 1.442.18l.01.002.01.003c.205.06.4.126.59.208.15.064.283.125.407.185l.562.274v3.016h-1.54l-.28-.24a7.018 7.018 0 0 0-.233-.188 2.703 2.703 0 0 0-.26-.175 1.594 1.594 0 0 0-.277-.125h-.006l-.2-.03a.772.772 0 0 0-.26.042l-.16.102a.63.63 0 0 0-.13.22 1.486 1.486 0 0 0-.075.516c0 .266.04.436.074.513a.59.59 0 0 0 .13.212l.15.09h.003a.868.868 0 0 0 .265.045l.236-.037h.008a1.04 1.04 0 0 0 .25-.113l.007-.004.01-.005.24-.16a6.41 6.41 0 0 0 .216-.17l.285-.254h1.536v3.017l-.59.266c-.15.066-.292.13-.422.184a4.19 4.19 0 0 1-.53.19 5.918 5.918 0 0 1-.636.15c-.076.012-.16.02-.24.026H25V3H14.237z"></path><path fill="currentColor" d="M25.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h23.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 25.8 1zm.2 11H2V2h24v10zm-7.186-2.72c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.412-.19V8.16h-.154c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.485.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3c-.15-.14-.28-.33-.38-.57a2.36 2.36 0 0 1-.152-.9c0-.347.047-.64.14-.88s.216-.433.367-.58c.157-.15.33-.26.517-.325a1.786 1.786 0 0 1 1.116-.014c.164.056.316.125.457.206a4.868 4.868 0 0 1 .644.466h.17V4.54a13.03 13.03 0 0 0-.367-.168 3.667 3.667 0 0 0-1.005-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.675.333-.924.59c-.26.262-.457.58-.59.95S18 6.6 18 7.055c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.607c.272-.076.52-.2.75-.38.195-.15.35-.338.46-.567.113-.23.17-.488.17-.778 0-.4-.11-.722-.332-.967-.22-.245-.52-.406-.896-.484v-.03a1.46 1.46 0 0 0 .623-.51 1.36 1.36 0 0 0 .22-.77c0-.25-.052-.47-.16-.665a1.15 1.15 0 0 0-.49-.465 2.065 2.065 0 0 0-.64-.215A7.67 7.67 0 0 0 14.237 4H12v6h2.515c.418 0 .763-.037 1.035-.113zM13.478 5.1h.14c.29 0 .517.002.678.006s.296.027.404.07c.12.05.206.123.253.223a.69.69 0 0 1 .072.29.86.86 0 0 1-.062.34c-.042.1-.13.18-.263.24a1.05 1.05 0 0 1-.39.08c-.166.007-.366.01-.6.01h-.233V5.1zm.108 3.8h-.108V7.405h.324c.222 0 .434 0 .638.004.203 0 .363.02.48.05.17.05.29.13.36.23s.106.25.106.44c0 .144-.03.272-.087.384s-.17.2-.32.27a1.257 1.257 0 0 1-.5.104c-.18.003-.48.004-.9.004zm-6.64-.1h2.187l.41 1.2h1.574L8.935 4.06H7.182L5 10h1.535l.412-1.2zM8.04 5.58l.727 2.13H7.313l.727-2.13z"></path></svg>
				      		</Tooltip>
				      	</RadioButton>
				      	<RadioButton value="inline">
	  		              	<Tooltip placement="top" title="inline">
								<svg width="18" height="8" viewBox="0 0 20 8" className="bem-Svg " style={{marginTop:'5px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M14.814 6.25c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.41-.19V5.13h-.153c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.484.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3 1.566 1.566 0 0 1-.38-.57c-.1-.24-.152-.54-.152-.9 0-.346.048-.638.14-.878s.217-.437.368-.58c.16-.155.33-.26.52-.33a1.786 1.786 0 0 1 1.117-.013c.165.055.317.124.458.205a4.385 4.385 0 0 1 .643.47h.17V1.52c-.107-.05-.23-.107-.37-.168a3.613 3.613 0 0 0-1.003-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.674.33-.923.59c-.26.26-.458.58-.59.95S14 3.57 14 4.02c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.608c.272-.075.52-.2.75-.377a1.5 1.5 0 0 0 .46-.56 1.72 1.72 0 0 0 .17-.77c0-.4-.11-.72-.332-.96-.22-.244-.52-.404-.896-.48v-.04a1.46 1.46 0 0 0 .623-.516c.147-.22.22-.474.22-.763 0-.25-.052-.47-.16-.66a1.152 1.152 0 0 0-.49-.46 2.06 2.06 0 0 0-.64-.212A7.67 7.67 0 0 0 10.237 1H8v5.97h2.515c.418 0 .763-.037 1.035-.112zM9.478 2.095h.14c.29 0 .517.002.678.006.162.01.296.03.404.07a.46.46 0 0 1 .253.23.69.69 0 0 1 .072.298.85.85 0 0 1-.062.34.492.492 0 0 1-.263.24 1.052 1.052 0 0 1-.39.08c-.166.006-.366.01-.6.01h-.232v-1.27zm.108 3.78h-.108V4.388h.324c.222 0 .434 0 .638.004a1.8 1.8 0 0 1 .48.056c.17.05.29.127.36.23.07.104.106.25.106.44 0 .144-.03.272-.087.383s-.17.2-.32.27-.32.1-.5.11c-.18.004-.48.004-.9.004zm-6.64-.106h2.187l.41 1.2h1.574L4.935 1.03H3.182L1 6.97h1.535l.412-1.2zM4.04 2.55l.727 2.13H3.313l.727-2.13z"></path></svg>
							</Tooltip>
				      	</RadioButton>
				      	<RadioButton value="flex">
	  		              	<Tooltip placement="top" title="flex">
								<svg width="18" height="14" viewBox="0 0 23 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><g fill="currentColor" fillRule="evenodd"><path d="M21 2v10H2V2h19zm1-1H1v12h21V1z" opacity=".15"></path><path d="M1.2 0A1.2 1.2 0 0 0 0 1.2v11.6A1.2 1.2 0 0 0 1.2 14h20.6a1.2 1.2 0 0 0 1.2-1.2V1.2A1.2 1.2 0 0 0 21.8 0H1.2zM22 13H1V1h21v12z"></path><path opacity=".4" d="M3 3h5v8H3z"></path><path d="M4 4v6h3V4H4zm4-1v8H3V3h5z"></path><path opacity=".4" d="M9 3h5v8H9z"></path><path d="M10 4v6h3V4h-3zm4-1v8H9V3h5z"></path><path opacity=".4" d="M15 3h5v8h-5z"></path><path d="M16 4v6h3V4h-3zm4-1v8h-5V3h5z"></path></g></svg>
							</Tooltip>
				      	</RadioButton>
				      	<RadioButton value="none">
	  		              	<Tooltip placement="top" title="none">
								<svg width="15" height="15" viewBox="0 0 15 15" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M12.146 5.27l-1.29 1.29c.084.3.144.612.144.94C11 9.434 9.434 11 7.502 11c-.33 0-.64-.06-.943-.145l-.797.795c.554.214 1.135.35 1.738.35 3.59 0 6.5-4.56 6.5-4.56s-.71-1.078-1.854-2.17zm.5-3.624l-2.26 2.26C9.516 3.38 8.54 3 7.5 3 3.91 3 1 7.44 1 7.44s1.112 1.724 2.8 3.053l-2.153 2.153.707.707 11-11-.708-.707zM8.25 6.044a1.62 1.62 0 0 0-.748-.2c-.918 0-1.658.74-1.658 1.654 0 .274.083.523.2.75l-1.328 1.33A3.433 3.433 0 0 1 4 7.5 3.5 3.5 0 0 1 7.502 4a3.43 3.43 0 0 1 2.075.716L8.25 6.044z"></path></svg>
							</Tooltip>
				      	</RadioButton>
				    </RadioGroup>
				</FormItem>

      		</Form>
    	)
    }

    const editTriggerModal = {
    	content: (
    		<div>
    			<FormItem {...formItemLayout} label="触发动作">
    				<Popover
			        	content={triggerListPopover}
			        	title="选择触发动作"
			        	trigger="click"
			        	placement="left"
			      	>
			            <a>{props.vdanimations.interactionCreator.modalEtitorTrigger.title}</a>
			      	</Popover>
    			</FormItem>

    			<FormItem {...formItemLayout} label="影响其他元素">
    				<Switch defaultChecked={false} onChange={modelActions.switchAffectOtherElem} />
    			</FormItem>

    			{props.vdanimations.interactionCreator.modalEtitorTrigger.isAffectOtherElem && (
    				<FormItem {...formItemLayout} label="选择元素">
    					<Select multiple
    							showSearch
    							optionFilterProp="children"
    							filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    							style={{width: '100%'}}
    					>
    						<Option key='1'>1</Option>
    						<Option key='2'>2</Option>
    						<Option key='3'>3</Option>
    					</Select>
    				</FormItem>
    			)}

    			<li className="ant-dropdown-menu-item-divider"></li>

    			{
    				props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Load' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="页面加载">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
								<Col span='12'>
									等待静态文件加载<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Scroll' && 
	    			(<div>
	    				<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="滚动进来">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>
		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>
						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -40}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
								<Col span='12'>
									<InputGroup compact style={{marginTop: 5}}>
										<div style={{width: '30%', display: 'inline-block'}}>
											位移:
										</div>
										<Input style={{ width: '40%' }} defaultValue="0" />
								      	<Select
					    				    placeholder="选择单位"
					    				    defaultValue="PX"
					    				    style={{ width: '30%' }}
					    				>
					    					<Option key="PX">PX</Option>
					    					<Option key="%">%</Option>
					    				</Select>
								    </InputGroup>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="滚动出去">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>
		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>
						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -40}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
								<Col span='12'>
									<InputGroup compact style={{marginTop: 5}}>
										<div style={{width: '30%', display: 'inline-block'}}>
											位移:
										</div>
										<Input style={{ width: '40%' }} defaultValue="0" />
								      	<Select
					    				    placeholder="选择单位"
					    				    defaultValue="PX"
					    				    style={{ width: '30%' }}
					    				>
					    					<Option key="PX">PX</Option>
					    					<Option key="%">%</Option>
					    				</Select>
								    </InputGroup>
								</Col>
							</Row>
						</FormItem>

	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Click' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="第一次点击">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="第二次点击">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Hover' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="进入">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="出来">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Tabs' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="打开标签页">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="关闭标签页">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Slider' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="滑动到视野区域">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="滑出视野区域">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Navbar' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="打开Navbar">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="关闭Navbar">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}

	    		{
	    			props.vdanimations.interactionCreator.modalEtitorTrigger.title == 'Dropdown' && 
	    			(<div>
		    			<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="打开Dropdown">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>

						<li className="ant-dropdown-menu-item-divider"></li>

						<FormItem {...formItemLayout} style={{textAlign: 'right'}} label="关闭Dropdown">
		    				<Icon type="caret-right" />预览
		    				<Button size="small" style={{marginLeft: 5}} onClick={modelActions.showModalNewStep}>
		    					<i className="fa fa-plus"></i>
		    				</Button>
		    			</FormItem>

		    			<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -30}}>
							<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
								<Row>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-eye"></i>
									</Col>
									<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
										<i className="fa fa-chain"></i>
									</Col>
									<Col span={12} style={{textAlign: 'center', cursor: 'pointer'}}>
										暂无
									</Col>
									<Col span={2} style={{textAlign: 'center'}}>
										<i className="fa fa-circle"></i>
									</Col>
									<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
										<i className="fa fa-trash-o"></i>
									</Col>
								</Row>
							</div>
						</FormItem>

						<FormItem wrapperCol={{span: 24}} style={{position: 'relative', top: -20}}>
							<Row>
								<Col span='12'>
									循环<Switch style={{marginLeft: 10}}></Switch>
								</Col>
							</Row>
						</FormItem>
	    			</div>)
	    		}
    			
    		</div>
    	)
    }

    const newStepModal = {
    	content: (
	    	<div>
	    		<Form className="form-no-margin-bottom">
					<FormItem {...formItemLayout} label="名称(可选)">
						<Input size="small" />
					</FormItem>

					<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="变换">
		      			<Tooltip placement="top" title="添加变换">
		      				<Popover title='添加变换' placement="leftTop" trigger="click" content={transitionAddPopover}>
				      			<Button style={{textAlign: 'center'}}>
				      				<i className="fa fa-plus"></i>
				      			</Button>
				      		</Popover>
			      		</Tooltip>
		      		</FormItem>
		      		<FormItem wrapperCol={{ span: 24 }} style={{position: 'relative', top: -3}}>
						<div style={{border: '1px solid #d9d9d9', minHeight: 10}}>
							<Row>
								<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
									<i className="fa fa-eye"></i>
								</Col>
								<Col span={2} style={{textAlign: 'center', cursor: 'ns-resize'}}>
									<i className="fa fa-chain"></i>
								</Col>
								<Col span={14} style={{textAlign: 'center', cursor: 'pointer'}}>
									暂无
								</Col>
								<Col span={4} style={{textAlign: 'center', cursor: 'pointer'}}>
									<i className="fa fa-trash-o"></i>
								</Col>
							</Row>
						</div>
					</FormItem>
		      		<FormItem wrapperCol={{span: 24}}>
		      			<Popover title='变换' placement="leftTop" trigger="click" content={transformSettingPopover}>
			      			<a>
			      				<i className="fa fa-clock-o"></i>
			      				200ms
			      				Ease-out
			      			</a>
			      		</Popover>
		      		</FormItem>
		      		<li className="ant-dropdown-menu-item-divider"></li>

		      		<InputGroup compact style={{marginTop: 5}}>
						<div style={{width: '30%', display: 'inline-block'}}>
							宽度:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="PX">PX</Option>
	    					<Option key="%">%</Option>
	    					<Option key="auto">auto</Option>
	    				</Select>
				    </InputGroup>
				    <FormItem wrapperCol={{span: 24}}>
		      			<Popover title='变换' placement="leftTop" trigger="click" content={transformSettingPopover}>
			      			<a>
			      				<i className="fa fa-clock-o"></i>
			      				200ms
			      				Ease-out
			      			</a>
			      		</Popover>
		      		</FormItem>
		      		<li className="ant-dropdown-menu-item-divider"></li>

				    <InputGroup compact style={{marginTop: 5}}>
						<div style={{width: '30%', display: 'inline-block'}}>
							高度:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="PX">PX</Option>
	    					<Option key="%">%</Option>
	    					<Option key="%">auto</Option>
	    				</Select>
				    </InputGroup>
				    <FormItem wrapperCol={{span: 24}}>
		      			<Popover title='变换' placement="leftTop" trigger="click" content={transformSettingPopover}>
			      			<a>
			      				<i className="fa fa-clock-o"></i>
			      				200ms
			      				Ease-out
			      			</a>
			      		</Popover>
		      		</FormItem>
		      		<li className="ant-dropdown-menu-item-divider"></li>

				    <InputGroup compact style={{marginTop: 5}}>
						<div style={{width: '30%', display: 'inline-block'}}>
							透明度:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="PX"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="%">%</Option>
	    				</Select>
				    </InputGroup>
				    <FormItem wrapperCol={{span: 24}}>
		      			<Popover title='变换' placement="leftTop" trigger="click" content={transformSettingPopover}>
			      			<a>
			      				<i className="fa fa-clock-o"></i>
			      				200ms
			      				Ease-out
			      			</a>
			      		</Popover>
		      		</FormItem>
		      		<li className="ant-dropdown-menu-item-divider"></li>

		      		<FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} style={{textAlign: 'right', marginTop: 5}} label="布局">
					    <RadioGroup defaultValue="block" size="small">
					      	<RadioButton value="block">
		  		              	<Tooltip placement="top" title="block">
					      			<svg width="18" height="14" viewBox="0 0 22 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path opacity=".15" fill="currentColor" d="M19 3v8H3V3h16m1-1H2v10h18V2z"></path><path fill="currentColor" d="M19.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h17.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 19.8 1zm.2 11H2V2h18v10z"></path><path opacity=".35" fill="currentColor" d="M3 3h16v8H3z"></path></svg>
					      		</Tooltip>
				      		</RadioButton>
					      	<RadioButton value="inline-block">
		  		              	<Tooltip placement="top" title="inline-block">
									<svg width="28" height="14" viewBox="0 0 28 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M25 3v8H3V3h22m1-1H2v10h24V2z" opacity=".15"></path><path opacity=".35" fill="currentColor" d="M8.418 9.8H7.66L7.25 11h1.58l-.232-.676-.18-.525zM3 11h.567l2.916-7.94h3.15L11 6.78V3H3v8zm15.12-1.002a3.302 3.302 0 0 1-.48-.586c-.173.343-.42.653-.73.888.002 0 .004-.002.005-.003l-.008.006.003-.003a3.145 3.145 0 0 1-1.092.55c-.4.11-.825.15-1.303.15h6.017a4.416 4.416 0 0 1-1.12-.215 3.51 3.51 0 0 1-1.292-.787zM14.237 3c.49 0 .853.014 1.167.06.335.05.656.16.953.314h.003l.004.003c.365.19.694.492.898.866.13.234.197.49.24.747.16-.298.343-.58.578-.82v-.002c.358-.366.8-.643 1.287-.826a4.373 4.373 0 0 1 1.557-.272 5.67 5.67 0 0 1 1.442.18l.01.002.01.003c.205.06.4.126.59.208.15.064.283.125.407.185l.562.274v3.016h-1.54l-.28-.24a7.018 7.018 0 0 0-.233-.188 2.703 2.703 0 0 0-.26-.175 1.594 1.594 0 0 0-.277-.125h-.006l-.2-.03a.772.772 0 0 0-.26.042l-.16.102a.63.63 0 0 0-.13.22 1.486 1.486 0 0 0-.075.516c0 .266.04.436.074.513a.59.59 0 0 0 .13.212l.15.09h.003a.868.868 0 0 0 .265.045l.236-.037h.008a1.04 1.04 0 0 0 .25-.113l.007-.004.01-.005.24-.16a6.41 6.41 0 0 0 .216-.17l.285-.254h1.536v3.017l-.59.266c-.15.066-.292.13-.422.184a4.19 4.19 0 0 1-.53.19 5.918 5.918 0 0 1-.636.15c-.076.012-.16.02-.24.026H25V3H14.237z"></path><path fill="currentColor" d="M25.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h23.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 25.8 1zm.2 11H2V2h24v10zm-7.186-2.72c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.412-.19V8.16h-.154c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.485.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3c-.15-.14-.28-.33-.38-.57a2.36 2.36 0 0 1-.152-.9c0-.347.047-.64.14-.88s.216-.433.367-.58c.157-.15.33-.26.517-.325a1.786 1.786 0 0 1 1.116-.014c.164.056.316.125.457.206a4.868 4.868 0 0 1 .644.466h.17V4.54a13.03 13.03 0 0 0-.367-.168 3.667 3.667 0 0 0-1.005-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.675.333-.924.59c-.26.262-.457.58-.59.95S18 6.6 18 7.055c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.607c.272-.076.52-.2.75-.38.195-.15.35-.338.46-.567.113-.23.17-.488.17-.778 0-.4-.11-.722-.332-.967-.22-.245-.52-.406-.896-.484v-.03a1.46 1.46 0 0 0 .623-.51 1.36 1.36 0 0 0 .22-.77c0-.25-.052-.47-.16-.665a1.15 1.15 0 0 0-.49-.465 2.065 2.065 0 0 0-.64-.215A7.67 7.67 0 0 0 14.237 4H12v6h2.515c.418 0 .763-.037 1.035-.113zM13.478 5.1h.14c.29 0 .517.002.678.006s.296.027.404.07c.12.05.206.123.253.223a.69.69 0 0 1 .072.29.86.86 0 0 1-.062.34c-.042.1-.13.18-.263.24a1.05 1.05 0 0 1-.39.08c-.166.007-.366.01-.6.01h-.233V5.1zm.108 3.8h-.108V7.405h.324c.222 0 .434 0 .638.004.203 0 .363.02.48.05.17.05.29.13.36.23s.106.25.106.44c0 .144-.03.272-.087.384s-.17.2-.32.27a1.257 1.257 0 0 1-.5.104c-.18.003-.48.004-.9.004zm-6.64-.1h2.187l.41 1.2h1.574L8.935 4.06H7.182L5 10h1.535l.412-1.2zM8.04 5.58l.727 2.13H7.313l.727-2.13z"></path></svg>
					      		</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="inline">
		  		              	<Tooltip placement="top" title="inline">
									<svg width="18" height="8" viewBox="0 0 20 8" className="bem-Svg " style={{marginTop:'5px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M14.814 6.25c.258.248.567.435.927.56s.76.19 1.18.19c.29 0 .51-.014.68-.042.167-.028.34-.07.53-.123.143-.04.28-.09.41-.146l.41-.19V5.13h-.153c-.07.06-.157.134-.265.22a3.337 3.337 0 0 1-.35.237 2.11 2.11 0 0 1-.484.22 1.798 1.798 0 0 1-1.1-.01 1.403 1.403 0 0 1-.523-.3 1.566 1.566 0 0 1-.38-.57c-.1-.24-.152-.54-.152-.9 0-.346.048-.638.14-.878s.217-.437.368-.58c.16-.155.33-.26.52-.33a1.786 1.786 0 0 1 1.117-.013c.165.055.317.124.458.205a4.385 4.385 0 0 1 .643.47h.17V1.52c-.107-.05-.23-.107-.37-.168a3.613 3.613 0 0 0-1.003-.27 4.736 4.736 0 0 0-.65-.04c-.436 0-.837.07-1.205.207s-.674.33-.923.59c-.26.26-.458.58-.59.95S14 3.57 14 4.02c0 .488.07.918.213 1.29s.343.683.6.933zm-3.264.608c.272-.075.52-.2.75-.377a1.5 1.5 0 0 0 .46-.56 1.72 1.72 0 0 0 .17-.77c0-.4-.11-.72-.332-.96-.22-.244-.52-.404-.896-.48v-.04a1.46 1.46 0 0 0 .623-.516c.147-.22.22-.474.22-.763 0-.25-.052-.47-.16-.66a1.152 1.152 0 0 0-.49-.46 2.06 2.06 0 0 0-.64-.212A7.67 7.67 0 0 0 10.237 1H8v5.97h2.515c.418 0 .763-.037 1.035-.112zM9.478 2.095h.14c.29 0 .517.002.678.006.162.01.296.03.404.07a.46.46 0 0 1 .253.23.69.69 0 0 1 .072.298.85.85 0 0 1-.062.34.492.492 0 0 1-.263.24 1.052 1.052 0 0 1-.39.08c-.166.006-.366.01-.6.01h-.232v-1.27zm.108 3.78h-.108V4.388h.324c.222 0 .434 0 .638.004a1.8 1.8 0 0 1 .48.056c.17.05.29.127.36.23.07.104.106.25.106.44 0 .144-.03.272-.087.383s-.17.2-.32.27-.32.1-.5.11c-.18.004-.48.004-.9.004zm-6.64-.106h2.187l.41 1.2h1.574L4.935 1.03H3.182L1 6.97h1.535l.412-1.2zM4.04 2.55l.727 2.13H3.313l.727-2.13z"></path></svg>
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="flex">
		  		              	<Tooltip placement="top" title="flex">
									<svg width="18" height="14" viewBox="0 0 23 14" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><g fill="currentColor" fillRule="evenodd"><path d="M21 2v10H2V2h19zm1-1H1v12h21V1z" opacity=".15"></path><path d="M1.2 0A1.2 1.2 0 0 0 0 1.2v11.6A1.2 1.2 0 0 0 1.2 14h20.6a1.2 1.2 0 0 0 1.2-1.2V1.2A1.2 1.2 0 0 0 21.8 0H1.2zM22 13H1V1h21v12z"></path><path opacity=".4" d="M3 3h5v8H3z"></path><path d="M4 4v6h3V4H4zm4-1v8H3V3h5z"></path><path opacity=".4" d="M9 3h5v8H9z"></path><path d="M10 4v6h3V4h-3zm4-1v8H9V3h5z"></path><path opacity=".4" d="M15 3h5v8h-5z"></path><path d="M16 4v6h3V4h-3zm4-1v8h-5V3h5z"></path></g></svg>
								</Tooltip>
					      	</RadioButton>
					      	<RadioButton value="none">
		  		              	<Tooltip placement="top" title="none">
									<svg width="15" height="15" viewBox="0 0 15 15" className="bem-Svg " style={{marginTop:'3px', display: 'block', transform: 'translate(0px, 0px)'}}><path fill="currentColor" d="M12.146 5.27l-1.29 1.29c.084.3.144.612.144.94C11 9.434 9.434 11 7.502 11c-.33 0-.64-.06-.943-.145l-.797.795c.554.214 1.135.35 1.738.35 3.59 0 6.5-4.56 6.5-4.56s-.71-1.078-1.854-2.17zm.5-3.624l-2.26 2.26C9.516 3.38 8.54 3 7.5 3 3.91 3 1 7.44 1 7.44s1.112 1.724 2.8 3.053l-2.153 2.153.707.707 11-11-.708-.707zM8.25 6.044a1.62 1.62 0 0 0-.748-.2c-.918 0-1.658.74-1.658 1.654 0 .274.083.523.2.75l-1.328 1.33A3.433 3.433 0 0 1 4 7.5 3.5 3.5 0 0 1 7.502 4a3.43 3.43 0 0 1 2.075.716L8.25 6.044z"></path></svg>
								</Tooltip>
					      	</RadioButton>
					    </RadioGroup>
					</FormItem>
					<li className="ant-dropdown-menu-item-divider"></li>

					<InputGroup compact style={{marginTop: 5}}>
						<div style={{width: '30%', display: 'inline-block'}}>
							下一步的等待时间:
						</div>
						<Input style={{ width: '40%' }} defaultValue="0" />
				      	<Select
	    				    placeholder="选择单位"
	    				    defaultValue="MS"
	    				    style={{ width: '30%' }}
	    				>
	    					<Option key="MS">MS</Option>
	    					<Option key="S">S</Option>
	    				</Select>
				    </InputGroup>

				</Form>
	    	</div>
    	)
    }

  	return (
	    <div className="interaction-section" style={{padding: '15px'}}>

	    	<Row>
	    		<Col span={18}><p>交互动画列表：</p></Col>
	    		<Col span={6} style={{textAlign: 'right'}}>
		      		<Button onClick={interactionCreator.show} size="small"><Icon type="plus" /></Button>

					<Modal title="新增 交互动画"
          				visible={props.vdanimations.interactionCreator.modalCreator.visible}
          				onOk={interactionCreator.handleOk}
          				onCancel={interactionCreator.handleCancel}
        			>
        				{interactionCreator.content}
        			</Modal>

        			<Modal title="新增 初始动作"
	      				visible={props.vdanimations.interactionCreator.modalAddInitalAppearabce.visible}
	      				onOk={modelActions.hideModalAddInitalAppearabce}
          				onCancel={modelActions.hideModalAddInitalAppearabce}
	    			>
	    				{initialApperanceModal.content}
	    			</Modal>

	    			<Modal title={"编辑动作" + props.vdanimations.interactionCreator.modalEtitorTrigger.title}
	      				visible={props.vdanimations.interactionCreator.modalEtitorTrigger.visible}
	      				onOk={modelActions.hideModelEditTrigger}
          				onCancel={modelActions.hideModelEditTrigger}
	    			>
	    				{editTriggerModal.content}
	    			</Modal>

	    			<Modal title="新增 动作步骤"
	      				visible={props.vdanimations.interactionCreator.modalNewStep.visible}
	      				onOk={modelActions.hideModalNewStep}
          				onCancel={modelActions.hideModalNewStep}
	    			>
	    				{newStepModal.content}
	    			</Modal>

	    		</Col>
	    	</Row>

      		<Menu className="interaction-list">
      			<Menu.Item>
		        	<Radio style={radioStyle} value={1}>None</Radio>
      			</Menu.Item>
      			<Menu.Item>
      				<Row>
						<Col span={18}>
		        			<Radio style={radioStyle} value={2}>交互动画名称</Radio>
						</Col>
						<Col span={6} style={{textAlign: 'right'}}>
							<Popover
					        	content={interactionEditor.content}
					        	title="编辑 交互动画"
					        	trigger="click"
					        	placement="left"
					      	>
					            <Icon type="edit" />
					      	</Popover>
				            <Popconfirm title="确认删除吗？" placement="left" okText="确定" cancelText="取消">
								<Icon type="delete" />
							</Popconfirm>
						</Col>
      				</Row>
       			</Menu.Item>
      		</Menu>

	    </div>
  	);

};

function mapSateToProps({ vdanimations }) {
  return { vdanimations };
}

export default connect(mapSateToProps)(Component);