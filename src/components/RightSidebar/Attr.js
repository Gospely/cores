import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button ,Menu, Dropdown, message, Tag, Modal} from 'antd';
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
    		});

    		var specialEvt = {
    			alias: function() {
	    			props.dispatch({
	    				type: 'designer/handlePageAliasChanged',
	    				payload: {
	    					newVal: newVal,
		    				attr: attr,
		    				parentAtt: parentAtt
	    				}
	    			});    				
    			},

    			enableTabs: function() {
	    			props.dispatch({
	    				type: 'designer/handleEnableTabs',
	    				payload: newVal
	    			});
    			}
    		}

    		specialEvt[attr.attrName]();

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

    	},

    	handleAttrFormBtnClicked: (attr, parentAtt, e) => {
    		props.dispatch({
    			type: attr.onClick
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

		span (attr, parentAtt) {
			return (
				<FormItem key={pageKey + (itemKey ++)} {...formItemLayout} label={attr.title}>
					<span>{attr._value}</span>
				</FormItem>
			);
		},

		button (attr, parentAtt) {
			return (
				<FormItem key={pageKey + (itemKey ++)} {...formItemLayout} label={attr.title}>
					<Button type="ghost" size="small" onClick={attrFormProps.handleAttrFormBtnClicked.bind(this, attr, parentAtt)}>{attr._value}</Button>
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

	const modalTabs = {
		handleOk: () => {
			props.designer.modalTabsVisible = false;
		},

		handleCancel: () => {
			props.designer.modalTabsVisible = false;
		}
	};

    const tabList = props.designer.layout[0].attr.tabBar._value.list.value;

	const tabFormProps = {

		onAddTab: () => {
			if(tabList.length === 5) {
				message('不能再加了哦，最多只能5个');
				return false;
			}

			var obj = {
				pagePath: {
					type: 'select',
					title: '页面路径',
					value: ['page-home'],
					isClassName: false,
					isHTML: false,
					_value: 'page-home'
				},

				text: {
					type: 'input',
					attrType: 'text',
					title: '菜单名称',
					value: ['page-home'],
					isClassName: false,
					isHTML: false,
					_value: '菜单'
				},

				iconPath: {
					type: 'input',
					attrType: 'text',
					title: '图片路径(<=40kb)',
					value: ['page-home'],
					isClassName: false,
					isHTML: false,
					_value: ''
				},

				selectedIconPath: {
					type: 'input',
					attrType: 'text',
					title: '选中时图片路径(<=40kb)',
					value: ['page-home'],
					isClassName: false,
					isHTML: false,
					_value: ''
				}
			}
			props.designer.layout[0].attr.tabBar._value.list.value.push(obj);
		},

		remove: (index) => {

		}

	};

    const tabFormItemLayoutWithOutLabel = {
      wrapperCol: { span: 20, offset: 4 },
    };

    const makeAttrObject2Array = (obj) => {
    	var tmp = [];
		for(var key in obj) {
			try {
				obj[key]['attrName'] = key;
				tmp.push(obj[key]);
			} catch(e) {
				console.log(e.message)
			}
		}

		return tmp
    }

    const attrArr = [];

    for (var i = 0; i < tabList.length; i++) {
    	var tmp = makeAttrObject2Array(tabList[i])
    	attrArr.push(tmp);
    };

    console.log('--------------------------------attrArr--------------------------------', attrArr);

    const tabFormItems = attrArr.map( (attrs , index) => {
		var items =  attrs.map( (attr, key) => {
			if(key === 0) {
	    		return (
		        	<FormItem required={true} key={pageKey + (itemKey ++)} {...tabFormItemLayoutWithOutLabel}>
				        <Icon
				            className="dynamic-delete-button"
				            type="minus-circle-o"
				            disabled={tabList.length <= 2}
				            onClick={tabFormProps.remove(index)}/>
				         <div style={{marginRight:'10px'}}></div>        	
						<Input placeholder={attr.title} style={{ width: '60%', marginRight: 8 }} />
			      	</FormItem>
				);
			}else {
	    		return (
		        	<FormItem required={true} key={pageKey + (itemKey ++) + 2} {...tabFormItemLayoutWithOutLabel}>
						<Input placeholder={attr.title} style={{ width: '60%', marginRight: 8 }} />
			      	</FormItem>
				);
			}
    	});
    	return (
			<Form inline>
	      		{items}
	      	</Form>
		);
    });

	let attrForms = props.attr.formItems.map( (item, index) => {
		if(!item.backend) {
			return attrTypeActions[item.type](item);			
		}
	});

	if(attrForms == '') {
		attrForms = ( <p>暂无属性</p> );
	}

    if (props.designer.loaded) {
    	 
		return (
			<div>
				<Collapse className="noborder attrCollapse nomin" bordered={false} defaultActiveKey={['1']}>
				    <Panel header="属性" key="1">

				      	<Form onSubmit={handleSubmit}>
				      		{attrForms}
				      	</Form>

				    </Panel>
			  	</Collapse>

        		<Modal width="80%" title="配置底部菜单栏" visible={props.designer.modalTabsVisible}
	          		onOk={modalTabs.handleOk} onCancel={modalTabs.handleCancel}>
		          		{tabFormItems}
		          		<Form inline>
				        	<FormItem {...tabFormItemLayoutWithOutLabel}>
				          		<Button onClick={tabFormProps.onAddTab} type="dashed" style={{ width: '60%' }}>
				            		<Icon type="plus" /> 添加菜单项
				          		</Button>
				        	</FormItem>
				      	</Form>
	        	</Modal>

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
