import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button ,Menu, Dropdown, message, Tag, Modal, Table, Popconfirm} from 'antd';
import { Collapse, Switch } from 'antd';

import { connect } from 'dva';

// import randomString from '../../utils/randomString';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;
const CheckableTag = Tag.CheckableTag;

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (<div className="editable-cell">
      {
        editable ?
        <div className="editable-cell-input-wrapper">
          <Input
            value={value}
            onChange={this.handleChange}
            onPressEnter={this.check}
          />
          <Icon
            type="check"
            className="editable-cell-icon-check"
            onClick={this.check}
          />
        </div>
        :
        <div className="editable-cell-text-wrapper">
          {value || ' '}
          <Icon
            type="edit"
            className="editable-cell-icon"
            onClick={this.edit}
          />
        </div>
      }
    </div>);
  }
}

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
				    	{attr.value.map( type => (
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
				message.error('最多只能使用5个菜单, 不能再加了哦');
				return false;
			}

			var obj = {
				pagePath: {
					type: 'select',
					title: '页面路径',
					value: ['page-home'],
					isClassName: false,
					isHTML: false,
					_value: ''
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
			return () => {
				props.designer.layout[0].attr.tabBar._value.list.value.splice(index, 1);				
			}
		}

	};

	let attrForms = props.attr.formItems.map( (item, index) => {
		if(!item.backend) {
			return attrTypeActions[item.type](item);			
		}
	});

	if(attrForms == '') {
		attrForms = ( <p>暂无属性</p> );
	}

	const tabsTableDatasource = function(tabList) {
		var tmp = [];
		for (var i = 0; i < tabList.length; i++) {
			var tab = tabList[i];
			tmp.push({
				pagePath: tab.pagePath._value,
				text: tab.text._value,
				iconPath: tab.iconPath._value,
				selectedIconPath: tab.selectedIconPath._value
			});
		};

		return tmp;
	}(tabList);

	const tabsTablesColumns = [{
	      	title: '路径',
	      	dataIndex: 'pagePath',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}/>
		    )
    	}, {
      		title: '菜单名称',
      		dataIndex: 'text',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}/>
		    )      		
    	}, {
      		title: '图片路径',
      		dataIndex: 'iconPath',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}/>
		    )
    	}, {
      		title: '选中时图片路径',
      		dataIndex: 'selectedIconPath',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}/>
		    )
		}, {
      		title: '操作',
      		dataIndex: 'operations',
  		    render: (text, record, index) => {
		        return (
		          index >= 2 ?
		          (
		            <Popconfirm title="确定删除吗？" onConfirm={tabFormProps.remove(index)}>
		              <a href="#">删除</a>
		            </Popconfirm>
		          ) : null
		        );
		    }
		}];

    if (props.designer.loaded) {
		return (
			<div>
				<div>
					<Collapse className="noborder attrCollapse nomin" bordered={false} defaultActiveKey={['1']}>
					    <Panel header="属性" key="1">
					      	<Form onSubmit={handleSubmit}>
					      		{attrForms}
					      	</Form>
					    </Panel>
				  	</Collapse>
				</div>
        		<Modal width="80%" title="配置底部菜单栏" visible={props.designer.modalTabsVisible}
	          		onOk={modalTabs.handleOk} onCancel={modalTabs.handleCancel}>
		          		<Button onClick={tabFormProps.onAddTab} type="dashed" style={{ marginBottom: '15px' }}>
		            		<Icon type="plus" /> 添加菜单项
		          		</Button>
		      	      	<Table bordered dataSource={tabsTableDatasource} columns={tabsTablesColumns} />
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
