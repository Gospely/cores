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

	const styles = {
		label: {
			marginRight: '18px',
			fontWeight: 'bold'
		}
	}

	const handleSubmit = (e) => {
	    e.preventDefault();
		console.log(e);
	}

    const formItemLayout = {
      	labelCol: { span: 4 },
      	wrapperCol: { span: 20 }
    };

	return (
		<div>
			<Collapse className="noborder" bordered={false} defaultActiveKey={['1']}>
			    <Panel header="link" key="1">

			      	<Form onSubmit={handleSubmit}>
			      		{props.attr.formItems.map( item => {

					    	const attrTypeActions = {

					    		input (attr) {

					    			return (
										<FormItem {...formItemLayout} label={attr.title}>
						             		<Input placeholder={attr.title} />
						         		</FormItem>
					    			);

					    		},

					    		toggle (attr) {

					    			
					    			
					    		},

					    		select (attr) {

					    		}

					    	}

					    	return attrTypeActions[item.type](item);

			      		})}
			      	</Form>

			    </Panel>
			    <Panel header="text" key="2">
			      
			    </Panel>
			    <Panel header="style" key="3">
			      <p>style</p>
			    </Panel>
			  </Collapse>
		</div>
	);

};

function mapStateToProps({ designer, attr }) {
  return { designer, attr };
}

export default connect(mapStateToProps)(Attr);
