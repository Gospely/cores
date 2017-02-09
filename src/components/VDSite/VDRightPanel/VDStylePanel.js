import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Select } from 'antd';
const Option = Select.Option;

const TabPane = Tabs.TabPane;

import { Collapse, Menu, Dropdown } from 'antd';
import { Row, Col } from 'antd';

const Panel = Collapse.Panel;

const Component = (props) => {

	const cssSelector = {

		cssClassNameList: [(
			<Option key="a10">a10</Option>
		), (
			<Option key="a11">a11</Option>
		)],

		cssClassListForDropdown: (
		  	<Menu>
		    	<Menu.Item key="1">1st menu item</Menu.Item>
		    	<Menu.Item key="2">2nd menu item</Menu.Item>
		    	<Menu.Item key="3">3d menu item</Menu.Item>
		  	</Menu>
		)

	}

  	return (
  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['css', 'layout', 'basic', 'typo', 'media', 'forms', 'components']}>
			    <Panel header={<span><i className="fa fa-css3"></i>&nbsp;CSS类选择器</span>} key="css">
				  	<p style={{marginBottom: '10px'}}>选择类名：</p>
				  	<Col span={21} className="css-selector">
				      	<Select
					    	multiple
					    	style={{ width: '100%' }}
					    	placeholder="请选择CSS类"
					    	defaultValue={['a10', 'a11']}
					    	size="small"
					  	>
					    	{cssSelector.cssClassNameList}
					  	</Select>
				  	</Col>
      				<Col span={3}>
      				    <Dropdown overlay={cssSelector.cssClassListForDropdown}>
						  	<Button style={{marginBottom: '10px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', marginLeft: '-1px'}} size="small">
		  		              	<Tooltip placement="left" title="选择CSS类进行编辑">
							  		<i className="fa fa-pencil"></i>
		      					</Tooltip>
						  	</Button>
				  	    </Dropdown>
      				</Col>
			    </Panel>
			    <Panel header="布局设置" key="layout">
			      	<p>基础控件</p>
			    </Panel>
			    <Panel header="字体设置" key="typo">
			      	<p>段落</p>
			    </Panel>
			    <Panel header="背景设置" key="media">
			      	<p>媒体</p>
			    </Panel>
			    <Panel header="边框设置" key="forms">
			      	<p>表单</p>
			    </Panel>
			    <Panel header="阴影设置" key="components">
			      	<p>组件</p>
			    </Panel>
			    <Panel header="过度和变换" key="transitions-transforms">
			      	<p>组件</p>
			    </Panel>
			    <Panel header="效果" key="effects">
			      	<p>组件</p>
			    </Panel>
			</Collapse>
  		</div>
  	);

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);