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

    	handleAttrFormInputChange: (attr, dom) => {
    		var newVal = dom.target.value;
    		var attrName = attr.attrName;

    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName
    			}
    		});

    		props.dispatch({
    			type: 'designer/handleAttrRefreshed'
    		})
    	},

    	handleAttrFormSwitchChange: (attr, checked) => {
			var newVal = checked;
			var attrName = attr.attrName;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName
    			}
    		});
    	},

    	handleAttrFormSelectChange: (attr, selectedVal) => {
			var newVal = selectedVal;
			var attrName = attr.attrName;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName
    			}
    		});
    	}

    }
    if (props.designer.layout.length) {
		return (
			<div>
				<Collapse className="noborder attrCollapse nomin" bordered={false} defaultActiveKey={['1']}>
				    <Panel header="属性" key="1">

				      	<Form onSubmit={handleSubmit}>
				      		{props.attr.formItems.map( (item, index) => {

				      			//console.log('change formItems', props.attr.formItems, props.attr.activeFormItem);

						    	const attrTypeActions = {
						    		input (attr) {
						    			return (
											<FormItem key={index} {...formItemLayout} label={attr.title}>
							             		<Input value={attr._value}
							             				type={attr.attrType}
							             				onChange={attrFormProps.handleAttrFormInputChange.bind(this, attr)} 
							             				className="attrInput" 
							             				placeholder={attr.title} />
							         		</FormItem>
						    			);
						    		},

						    		toggle (attr) {
						    			return (
											<FormItem key={index} {...formItemLayout} label={attr.title}>
							    				<Switch onChange={attrFormProps.handleAttrFormSwitchChange.bind(this, attr)} 
							    						checked={attr._value} />
											</FormItem>
						    			);
						    		},

						    		select (attr) {
						    			return (
											<FormItem key={index} {...formItemLayout} label={attr.title}>
											    <Select onChange={attrFormProps.handleAttrFormSelectChange.bind(this, attr)} 
											    		value={attr._value}>
											    	{attr.value.map( type => (
												      	<Option key={type} value={type}>{type}</Option>
											    	))}
											    </Select>
											</FormItem>
						    			);
						    		}
						    	}
								if(item.type) {
									return attrTypeActions[item.type](item);
								}

				      		})}
				      	</Form>

				    </Panel>
				  </Collapse>
			</div>
		);
	}else {
		return null;
	}

};

function mapStateToProps({ designer, attr }) {
  return { designer, attr };
}

export default connect(mapStateToProps)(Attr);
