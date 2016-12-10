import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button ,Menu, Dropdown, message, Tag} from 'antd';
import { Collapse, Switch } from 'antd';

import { connect } from 'dva';

// import randomString from '../../utils/randomString';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;
const CheckableTag = Tag.CheckableTag;

const Attr = (props) => {
	const styles = {
		label: {
			marginRight: '18px',
			fontWeight: 'bold'
		}
	};

	const handleSubmit = (e) => {
	    e.preventDefault();
		console.log(e);
	};

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

    const attrFormProps = {

    	handleAttrFormInputChange: (attr, parentAtt, dom) => {
    		console.log(parentAtt)
    		var newVal = dom.target.value;
    		var attrName = attr.attrName;

    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName,
    				parentAtt: parentAtt
    			}
    		});

    		props.dispatch({
    			type: 'designer/handleAttrRefreshed'
    		})
    	},

    	handleAttrFormSwitchChange: (attr, parentAtt, checked) => {
			var newVal = checked;
			var attrName = attr.attrName;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName,
    				parentAtt: parentAtt
    			}
    		});

    		props.dispatch({
    			type: 'designer/handleAttrRefreshed'
    		})

    	},

    	handleAttrFormSelectChange: (attr, parentAtt, selectedVal) => {
			var newVal = selectedVal;
			var attrName = attr.attrName;
    		props.dispatch({
    			type: 'designer/handleAttrFormChange',
    			payload: {
    				newVal: newVal,
    				attrName: attrName,
    				parentAtt: parentAtt
    			}
    		});

    		props.dispatch({
    			type: 'designer/handleAttrRefreshed'
    		})

    	}

    };

    let itemKey = 1;
    let pageKey = props.attr.theKey;
    // alert(pageKey)

    const attrTypeActions = {
		input (attr, parentAtt) {

			if (attr.hidden) {
				return '';
			}

			return (
				<FormItem key={pageKey + (itemKey ++)} {...formItemLayout} label={attr.title}>
             		<Input value={attr._value}
         				type={attr.attrType}
         				onChange={attrFormProps.handleAttrFormInputChange.bind(this, attr, parentAtt)}
         				className="attrInput"
         				placeholder={attr.title} />
         		</FormItem>
			);
		},

		toggle (attr, parentAtt) {
			return (
				<FormItem key={pageKey + (itemKey ++)} {...formItemLayout} label={attr.title}>
    				<Switch onChange={attrFormProps.handleAttrFormSwitchChange.bind(this, attr, parentAtt)}
						checked={attr._value} />
				</FormItem>
			);
		},

		select (attr, parentAtt) {
			return (
				<FormItem key={pageKey + (itemKey ++)} {...formItemLayout} label={attr.title}>
				    <Select onChange={attrFormProps.handleAttrFormSelectChange.bind(this, attr, parentAtt)}
				    		value={attr._value}>
				    	{attr.value.map( type => (
					      	<Option key={type} value={type}>{type}</Option>
				    	))}
				    </Select>
				</FormItem>
			);
		},

		'app_select' (attr, parentAtt) {
			return (
				<FormItem key={pageKey + (itemKey ++)} {...formItemLayout} label={attr.title}>
				    <Select onChange={attrFormProps.handleAttrFormSelectChange.bind(this, attr, parentAtt)}
				    		value={attr._value}>
				    	{attr._value.map( type => (
					      	<Option key={type} value={type}>{type}</Option>
				    	))}
				    </Select>
				</FormItem>
			);
		},

		children (attr, parentAtt) {
			console.log('children', attr);
			parentAtt = parentAtt || attr;
			var attrChildren = attr._value;
			var arrAttrChildren = [];

			for(var att in attrChildren) {
				attrChildren[att]['attrName'] = att;
				arrAttrChildren.push(attrChildren[att]);
			}

			const children = arrAttrChildren.map( (att, i) => {
				console.log(att)
				return attrTypeActions[att.type](att, parentAtt);
			});

			console.log(children);

			return (
				<div key={pageKey + (itemKey ++)}>
    				<Tag>
			            {attr.title}
			        </Tag>
			        <br/>
			        {children}
				</div>
			);
		}
	};

	const form = props.attr.formItems.map( (item, index) => {
		if(!item.backend) {
			return attrTypeActions[item.type](item);			
		}
	});


    if (props.designer.loaded) {
    	 
		return (
			<div>
				<Collapse className="noborder attrCollapse nomin" bordered={false} defaultActiveKey={['1']}>
				    <Panel header="属性" key="1">

				      	<Form onSubmit={handleSubmit}>
				      		{form}
				      	</Form>

				    </Panel>
				  </Collapse>
			</div>
		);

	}else {
		return (
			<p>无处理对象</p>
		);
	}
	
};

function mapStateToProps({ designer, attr}) {
  return { designer, attr};
}

export default connect(mapStateToProps)(Attr);
