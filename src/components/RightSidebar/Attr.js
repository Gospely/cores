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
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

	return (
		<div>
			<Collapse className="noborder attrCollapse" bordered={false} defaultActiveKey={['1']}>
			    <Panel header="属性" key="1">

			      	<Form onSubmit={handleSubmit}>
			      		{props.attr.formItems.map( (item, index) => {

					    	const attrTypeActions = {

					    		input (attr) {

					    			return (
										<FormItem key={index} {...formItemLayout} label={attr.title}>
						             		<Input className="attrInput" placeholder={attr.title} />
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
			  </Collapse>
		</div>
	);

};

function mapStateToProps({ designer, attr }) {
  return { designer, attr };
}

export default connect(mapStateToProps)(Attr);
