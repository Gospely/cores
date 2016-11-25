import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button ,Menu, Dropdown, message} from 'antd';
import { Collapse } from 'antd';

import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;

const Attr = (props) => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}
	var onClick = function(){

	}
	var styles = {
		label: {
			marginRight: '18px',
			fontWeight: 'bold'
		},
	}
	const selectAfter = (
	  <Select defaultValue="px" style={{ width: 50 }}>
	    <Option value="em">em</Option>
	    <Option value="%">%</Option>
	    <Option value=".ex">ex</Option>
	  </Select>
	);
	const menu = (
	  <Menu onClick={onClick}>
	    <Menu.Item key="1">1st menu item</Menu.Item>
	    <Menu.Item key="2">2nd menu item</Menu.Item>
	    <Menu.Item key="3">3d menu item</Menu.Item>
	  </Menu>
	);
	const dropdown = (
		<Dropdown.Button onClick={onClick} overlay={menu} type="ghost">
	      	Dropdown
	    	</Dropdown.Button>
	);
	const  btnGroup = (
		<ButtonGroup>
		<Button>L</Button>
		<Button>M</Button>
		<Button>R</Button>
		</ButtonGroup>
	)
	
	return (
		<div>
			<Collapse className={noborder} bordered={false} defaultActiveKey={['1']}>
			    <Panel header="link" key="1">
			   	 <p>
			   	 	<label style={styles.label}>Type</label>
			   	 	{btnGroup}
			   	 </p>
		    		{dropdown}
			    </Panel>
			    <Panel header="text" key="2">
			      <Input style={{ marginBottom: 16 }} placeholder="输入文字"/>
			      <div style={{ marginBottom: 16 }}>
				      <label style={styles.label}>Size</label>
				      <Input addonAfter={selectAfter} defaultValue="10" />
			    </div>
			    <div style={{ marginBottom: 16 }}>
				      <label style={styles.label}>Align</label>
				      {btnGroup}
			    </div>
			    <div style={{ marginBottom: 16 }}>
				      <label style={styles.label}>Weigth</label>
				       {dropdown}
			    </div>
			     <div style={{ marginBottom: 16 }}>
				      <label style={styles.label}>Color</label>
				       {dropdown}
			    </div>
			    </Panel>
			    <Panel header="style" key="3">
			      <p>style</p>
			    </Panel>
			  </Collapse>
		</div>
	);

};

function mapStateToProps({ designer }) {
  return { designer };
}

export default connect(mapStateToProps)(Attr);
