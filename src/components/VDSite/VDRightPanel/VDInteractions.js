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

const Component = (props) => {

    if (!props.vdCtrlTree.activeCtrl || !props.vdCtrlTree.activeCtrl.tag) {
        return (
            <div className="none-operation-obj">暂无操作对象</div>
        )
    }

    let interactions = props.vdanimations.interactions;
    let activeCtrlInteractionKey = props.vdCtrlTree.activeCtrl.animationClassList[0].key;
    // if (interactions) {}

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

	const radioStyle = {
      	display: 'block',
      	height: '30px',
      	lineHeight: '30px',
    };


    const interactionCreator = {
    	content (edit) {

    		edit = edit || false;

    		const handleChange = (attrName, value) => {
    			value = typeof value == 'object' ? value.target.value : value;

    			var animate = '';

    			if(attrName == 'name') {
    				animate = value.split('+')[0];
    				value = value.split('+')[1];

    				$('#animate-previewer').animateCss(animate);
    			}

    			props.dispatch({
    				type: 'vdanimations/handleNewInteractionFormChange',
    				payload: {
    					value,
    					attrName,
    					animate,
    					edit
    				}
    			});
    		}
     //        console.log('}}}}}}}}}}}}}}}')
    	// 	if(edit) {
    	// 		setTimeout(function() {
					// $('#animate-previewer').animateCss(interactions[props.vdanimations.activeInteractionIndex].animate);
    	// 		}, 800);
    	// 	}

    		return (
	    		<div>
			    	<Form className="form-no-margin-bottom">
						<FormItem {...formItemLayout} label="动画名称">

							<Row>

								<Col span={12} style={{paddingRight: '15px'}}>
									<Select
										value={edit ? props.vdanimations.editOldInteractionForm.name : props.vdanimations.newInteractionForm.name}
										size="small"
									    onChange={handleChange.bind(this, 'name')}
									>
									  	{
									  		props.vdanimations.animations.map((item, index) => {
									  			return (
												    <OptGroup label={item.name} key={item.name}>
												    	{
												    		item.children.map((animate, animateIndex) => {
												    			return (
															      	<Option value={animate.name + '+' + animate.title} key={animate.name}>{animate.title}</Option>
												    			);
												    		})
												    	}
												    </OptGroup>
									  			);

									  		})
									  	}
									</Select>
								</Col>

								<Col span={12} style={{textAlign: 'right'}}>
									<h1 id="animate-previewer" style={{fontWeight: 200}}>动画预览</h1>
								</Col>

							</Row>

						</FormItem>
			    	</Form>

			    	<Form className="form-no-margin-bottom">

						<FormItem {...formItemLayout} label="执行时间">
							<Row>
								<Col span={12} style={{paddingRight: '15px'}}>
									<Input
										value={edit ? props.vdanimations.editOldInteractionForm.duration : props.vdanimations.newInteractionForm.duration}
									    onChange={handleChange.bind(this, 'duration')}
										type="number" size="small" placeholder="单位:毫秒" />
								</Col>
							</Row>
						</FormItem>

						<FormItem {...formItemLayout} label="触发条件">
							<Row>
								<Col span={12} style={{paddingRight: '15px'}}>								
									<Select
										size="small"
										value={edit ? props.vdanimations.editOldInteractionForm.condition : props.vdanimations.newInteractionForm.condition}
									    onChange={handleChange.bind(this, 'condition')}
									>
								      	<Option value="load">页面加载</Option>
								      	<Option value="scroll">页面滑动</Option>
								      	<Option value="click">鼠标点击</Option>
								      	<Option value="hover">鼠标悬浮</Option>
									</Select>
								</Col>
							</Row>
						</FormItem>
			    	</Form>
	    		</div>
	    	)
		},

    	handleOk () {

    		props.dispatch({
    			type: 'vdanimations/saveInteraction'
    		});

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
    	content () {
			return interactionCreator.content(true);
    	},

    	modifyInteraction (interactionIndex, proxy) {
            proxy.stopPropagation();
    		props.dispatch({
    			type: 'vdanimations/showInteractionEditor',
                payload: interactionIndex
    		});
    	},

    	handleOk () {
    		props.dispatch({
    			type: 'vdanimations/hideInteractionEditor',
                payload: true
    		});
    	},

    	handleCancel () {
    		props.dispatch({
    			type: 'vdanimations/hideInteractionEditor',
                payload: false
    		});
    	}
    }

    const onConfirmRemoveThisInteraction = (index) => {
    	props.dispatch({
    		type: 'vdanimations/removeInteraction',
    		payload: index
    	});
    }

    const handleInteractionOnSelect = ({ item, key, selectedKeys }) => {
        let interactions = props.vdanimations.interactions;
        for(let i = 0; i < interactions.length; i ++) {
            if (interactions[i].key === key) {
                key = i;
            }
        }
    	props.dispatch({
    		type: 'vdanimations/handleInteractionOnSelect',
    		payload: {
    			key: parseInt(key),
                ctrl: props.vdCtrlTree.activeCtrl
    		}
    	});
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
        				{interactionCreator.content(false)}
        			</Modal>

					<Modal title="编辑 交互动画"
          				visible={props.vdanimations.interactionModifierForm.visible}
          				onOk={interactionEditor.handleOk}
          				onCancel={interactionEditor.handleCancel}
        			>
        				{interactionEditor.content()}
        			</Modal>

	    		</Col>
	    	</Row>

      		<Menu className="interaction-list" selectedKeys={[activeCtrlInteractionKey]} onSelect={handleInteractionOnSelect}>
      			{
      				interactions.map((interaction, interactionIndex) => {
      					return (

			      			<Menu.Item key={interaction.key}>
			      				<Row>
									<Col span={18}>
					        			<Radio checked={activeCtrlInteractionKey === interaction.key} 
                                            style={radioStyle} value={interaction.key}>{interaction.name} - {interaction.condition}
                                        </Radio>
									</Col>
									{
                                        interaction.key !== 'none' && (<Col span={6} style={{textAlign: 'right'}}>
							            <Icon onClick={interactionEditor.modifyInteraction.bind(this, interactionIndex)} type="edit" />
							                <Popconfirm title="确认删除吗？" placement="left" onConfirm={onConfirmRemoveThisInteraction.bind(this, interactionIndex)} okText="确定" cancelText="取消">
											     <Icon type="delete" onClick={(proxy) => {proxy.stopPropagation()}} />
										    </Popconfirm>
									   </Col>)
                                    }
			      				</Row>
			       			</Menu.Item>

      					);
      				})
      			}
      		</Menu>

	    </div>
  	);

};

function mapSateToProps({ vdanimations, vdCtrlTree }) {
  return { vdanimations, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);