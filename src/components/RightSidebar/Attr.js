import React , {PropTypes} from 'react';
import { Tree, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button ,Menu, Dropdown, message, Tag, Modal, Table, Popconfirm} from 'antd';
import { Collapse, Switch } from 'antd';

import { connect } from 'dva';

import MonacoEditor from 'react-monaco-editor';

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
    editable: false
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
	};

    const formItemLayout = {
      	labelCol: { span: 8 },
      	wrapperCol: { span: 16 }
    };

    let activeElem = props.attr.activeElem;

    const handleLinkedComponent = (attr, dom, cb) => {
		const findChildrenByIndexAndLvl = (elem, index, lvl, attrName, currentLvl) => {
			for (var i = 0; i < elem.length; i++) {
				var currentElem = elem[i];

				if(currentElem.children) {
					var result = findChildrenByIndexAndLvl(currentElem.children, index, lvl, attrName, currentLvl + 1);
					if(result) {
						return result;
					}
				}

				for(var key in currentElem.attr) {
					var currentAttr = currentElem.attr[key];
					if(key == attrName && i == index && currentLvl == lvl) {
						return currentElem;
					}
				}

			};

			return false;
		}

		var linkedComponent = findChildrenByIndexAndLvl(activeElem.children, attr.componentInfo.index, attr.componentInfo.level, attr.componentInfo.attr, 1);
		var linkedComponentAttr = linkedComponent.attr[attr.componentInfo.attr];
		linkedComponentAttr['attrName'] = attr.componentInfo.attr;

        props.dispatch({
            type: 'designer/handleTreeChanged',
            payload: {
                key: linkedComponent.key,
                type: 'controller'
            }
        });

        props.dispatch({
            type: 'designer/handleCtrlSelected'
        });

		cb(linkedComponentAttr, undefined, dom);

        props.dispatch({
            type: 'designer/handleTreeChanged',
            payload: {
                key: activeElem.key,
                type: 'controller'
            }
        });
    }

    const attrFormProps = {

    	handleAttrFormInputChange: (attr, parentAtt, dom) => {
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

    		if(attr.isComponentAttr) {
    			handleLinkedComponent(attr, dom, attrFormProps.handleAttrFormInputChange);
    			return false;
    		}

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

    		if(specialEvt[attr.attrName]) {
	    		specialEvt[attr.attrName]();
    		}

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

    		if(attr.isComponentAttr) {
    			handleLinkedComponent(attr, checked, attrFormProps.handleAttrFormSwitchChange);
    			return false;
    		}

    		props.dispatch({
    			type: 'designer/handleAttrRefreshed'
    		});

    		if(attr.onChange) {
    			props.dispatch({
    				type: attr.onChange,
    				payload: checked
    			});
    		}

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
    			

    		if(attr.isComponentAttr) {
    			handleLinkedComponent(attr, selectedVal, attrFormProps.handleAttrFormSelectChange);
    			return false;
    		}

    		props.dispatch({
    			type: 'designer/handleAttrRefreshed'
    		})

    	},

    	handleAttrFormBtnClicked: (attr, parentAtt, e) => {
    		if(attr.params) {
	    		props.dispatch({
	    			type: attr.onClick,
	    			payload: attr.params
	    		});
    		}else {
	    		props.dispatch({
	    			type: attr.onClick
	    		});    			
    		}
    	}

    };

    let itemKey = 1;
    let pageKey = props.attr.theKey;

    const attrTypeActions = {
		input (attr, parentAtt) {
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
    				<Switch checkedChildren={attr.checkedChildren} unCheckedChildren={attr.unCheckedChildren} disabled={attr.disabled} onChange={attrFormProps.handleAttrFormSwitchChange.bind(this, attr, parentAtt)}
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
			parentAtt = parentAtt || attr;
			var attrChildren = attr._value;
			var arrAttrChildren = [];

			for(var att in attrChildren) {
				attrChildren[att]['attrName'] = att;
				arrAttrChildren.push(attrChildren[att]);
			}

			const children = arrAttrChildren.map( (att, i) => {
				if(!att.backend) {
					return attrTypeActions[att.type](att, parentAtt);					
				}
			});

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
				message.warning('最多只能使用5个菜单, 不能再加了哦');
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
					_value: 'http://i64.tinypic.com/2a9711u.png'
				},

				selectedIconPath: {
					type: 'input',
					attrType: 'text',
					title: '选中时图片路径(<=40kb)',
					value: ['page-home'],
					isClassName: false,
					isHTML: false,
					_value: 'http://i64.tinypic.com/2a9711u.png'
				}
			}
			
			props.designer.layout[0].attr.tabBar._value.list.value.push(obj);

			gospelDesignerPreviewer.postMessage({
				tabBarAdded: props.designer.layout[0].attr.tabBar._value
			}, '*');
		},

		remove: (index) => {
			return () => {
				props.designer.layout[0].attr.tabBar._value.list.value.splice(index, 1);

				gospelDesignerPreviewer.postMessage({
					tabBarRemoved: props.designer.layout[0].attr.tabBar._value
				}, '*');
			}
		},

		onPagePathChange: (index, record) => {
			return (value) => {				

				props.designer.layout[0].attr.tabBar._value.list.value[index]['pagePath']._value = value;

				gospelDesignerPreviewer.postMessage({
					tabBarUpdated: props.designer.layout[0].attr.tabBar._value
				}, '*');
			}
		},

		onTextChange: (index, record) => {
			return (value) => {				

				props.designer.layout[0].attr.tabBar._value.list.value[index]['text']._value = value;

				gospelDesignerPreviewer.postMessage({
					tabBarUpdated: props.designer.layout[0].attr.tabBar._value
				}, '*');
			}
		},

		onIconPathChange: (index, record) => {
			return (value) => {				

				props.designer.layout[0].attr.tabBar._value.list.value[index]['iconPath']._value = value;

				gospelDesignerPreviewer.postMessage({
					tabBarUpdated: props.designer.layout[0].attr.tabBar._value
				}, '*');
			}
		},

		onSelectedIconPathChange: (index, record) => {
			return (value) => {				

				props.designer.layout[0].attr.tabBar._value.list.value[index]['selectedIconPath']._value = value;

				gospelDesignerPreviewer.postMessage({
					tabBarUpdated: props.designer.layout[0].attr.tabBar._value
				}, '*');
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
  	      	width: '20%',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}
		          onChange={tabFormProps.onPagePathChange(index, record)}/>
		    )
    	}, {
      		title: '菜单名称',
      		dataIndex: 'text',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}
		          onChange={tabFormProps.onTextChange(index, record)}/>
		    )      		
    	}, {
      		title: '图片路径',
      		dataIndex: 'iconPath',
	      	render: (text, record, index) => (
	      		<div>
		        	<img style={{height: 27, width: 27}}  src={text} />
		        	<EditableCell
		          		value={text}
		          		onChange={tabFormProps.onIconPathChange(index, record)}/>
	      		</div>
		    )
    	}, {
      		title: '选中时图片路径',
      		dataIndex: 'selectedIconPath',
	      	render: (text, record, index) => (
		        <EditableCell
		          value={text}
		          onChange={tabFormProps.onSelectedIconPathChange(index, record)}/>
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

	const modalCSSEditorProps = {
		handleOk () {
			props.dispatch({
				type: 'designer/hideCSSEditor'
			});			
		},

		handleCSSEditorChanged (value) {
			props.dispatch({
				type: 'designer/handleCSSEditorSaved',
				payload: value
			});
		},

		handleCancel () {
			props.dispatch({
				type: 'designer/hideCSSEditor'
			});
		}
	}

	let aceHeight = (parseInt(document.body.clientHeight) - 300);

	const CSSEditor = () => {

		if(props.designer.layoutState.activeKey == 'page-app') {
    		return (
				<MonacoEditor
					width="100%"
					height={aceHeight}
					language="css"
					options={props.editor.options}
					value={props.designer.layout[0].attr.css._value}
					onChange={modalCSSEditorProps.handleCSSEditorChanged}/>
    		);
    	}else {
    		return (
				<MonacoEditor
					width="100%"
					height={aceHeight}
					language="css"
					options={props.editor.options}
					value={props.designer.layout[0].children[props.designer.layoutState.activePage.index].attr.css._value}
					onChange={modalCSSEditorProps.handleCSSEditorChanged}/>
    		);
    	}

	}

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
		          		<span>&nbsp;&nbsp;注：菜单项只在主页面中显示</span>
		      	      	<Table bordered dataSource={tabsTableDatasource} columns={tabsTablesColumns} />
	        	</Modal>

        		<Modal width="80%" title="CSS编辑器（自动保存，请保证语法正确，否则无法解析）" 
        			visible={props.designer.modalCSSEditorVisible}
	          		onOk={modalCSSEditorProps.handleOk} onCancel={modalCSSEditorProps.handleCancel}
	          		footer={[
		            	<Button key="refresh" type="ghost" size="small" onClick={() => { location.reload() }}>编辑器无法使用请点这里刷新</Button>,
		            	<Button key="back" type="ghost" size="small" onClick={modalCSSEditorProps.handleCancel}>返回</Button>,
			            <Button key="submit" type="primary" size="small" onClick={modalCSSEditorProps.handleOk}>
			              确定
			            </Button>,
			        ]}>
			        {CSSEditor()}
	        	</Modal>

			</div>
		);

	}else {
		return (
			<p>无处理对象</p>
		);
	}
	
};

function mapStateToProps({ designer, attr, editor}) {
  return { designer, attr, editor};
}

export default connect(mapStateToProps)(Attr);
