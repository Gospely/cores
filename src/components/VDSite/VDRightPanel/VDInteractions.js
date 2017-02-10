import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Row, Col } from 'antd';

import { Radio, Input, Form } from 'antd';
import { Menu, Popconfirm, Popover } from 'antd';
const RadioGroup = Radio.Group;

const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const FormItem = Form.Item;

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
									<Popover
							        	content={<div>www</div>}
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
							        	content={<div>www</div>}
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
    	}
    }

    const interactionEditor = {
    	content: (<div>111</div>)
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