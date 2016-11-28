import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button ,Menu, Dropdown, message} from 'antd';
import { Collapse, Switch } from 'antd';

import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;

const Attr = (props) => {

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

    const attrFormProps = {

    	handleAttrFormInputChange: (attrName, dom) => {
    		var newVal = dom.target.value;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName
    			}
    		});
    	},

    	handleAttrFormSwitchChange: (attrName, checked) => {
    		console.log(attrName, checked);
			var newVal = checked;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName
    			}
    		});
    	},

    	handleAttrFormSelectChange: (attrName, selectedVal) => {
			var newVal = selectedVal;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName
    			}
    		});
    	}

    }

	return (
		<div>
			<Collapse className="noborder attrCollapse" bordered={false} defaultActiveKey={['1']}>
			    <Panel header="属性" key="1">

			      	<Form onSubmit={handleSubmit}>
			      		{props.attr.formItems.map( (item, index) => {

			      			console.log('change formItems', props.attr.formItems, props.attr.activeFormItem);

					    	const attrTypeActions = {
					    		input (attr) {
					    			return (
										<FormItem key={index} {...formItemLayout} label={attr.title}>
						             		<Input value={attr._value}
						             				onChange={attrFormProps.handleAttrFormInputChange.bind(this, attr.attrName)} 
						             				className="attrInput" 
						             				placeholder={attr.title} />
						         		</FormItem>
					    			);
					    		},

					    		toggle (attr) {
					    			return (
										<FormItem key={index} {...formItemLayout} label={attr.title}>
						    				<Switch onChange={attrFormProps.handleAttrFormSwitchChange.bind(this, attr.attrName)} 
						    						checked={attr._value} />
										</FormItem>
					    			);
					    		},

					    		select (attr) {
					    			return (
										<FormItem key={index} {...formItemLayout} label={attr.title}>
										    <Select onChange={attrFormProps.handleAttrFormSelectChange.bind(this, attr.attrName)} 
										    		value={attr._value}>
										    	{attr.value.map( type => (
											      	<Option key={type} value={type}>{type}</Option>
										    	))}
										    </Select>
										</FormItem>
					    			);
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
