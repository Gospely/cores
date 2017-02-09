import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Radio } from 'antd';

import { Tree, Form, Input, Cascader, Select, Row, Col, Checkbox, Menu, Dropdown, message, Tag, Table, Popconfirm} from 'antd';

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

  	return (

  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['basic', 'link', 'custom-attr', 'heading-type']}>
			    <Panel header="基础设置" key="basic">

			      	<Form>
						<FormItem {...formItemLayout} label="ID">
							<Input />
						</FormItem>

						<FormItem {...formItemLayout} label="可视屏幕">

							<Select
							    multiple
							    style={{ width: '100%' }}
							    placeholder="Please select"
							    defaultValue={['a10', 'c12']}
							 >
							    {children}
						  	</Select>
						</FormItem>

						<FormItem {...formItemLayout} label="标题大小">
						    <Select value="请选择">
						      	<Option key="sss" value="h1">h1</Option>
						    </Select>
						</FormItem>
			      	</Form>

			    </Panel>
			    <Panel header="链接属性" key="link">
			      	<p>段落</p>
			    </Panel>
			    <Panel header="自定义属性" key="custom-attr">
			    	<Form>
						<FormItem {...formItemLayout} label="自定义">
							<Button type="circle" size="small"><Icon type="plus" /></Button>
						</FormItem>
					</Form>
			    </Panel>
			</Collapse>
  		</div>

  	);

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);