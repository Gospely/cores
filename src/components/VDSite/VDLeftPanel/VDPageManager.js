import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Collapse } from 'antd';
import { Popover } from 'antd';

import { Row, Col } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;

import { Form, Input, Cascader, Select, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const Component = (props) => {

	const allPagesProps = {
		handlePageListItemClick (e) {

		}
	}

  	const formItemLayout = {
    	labelCol: { span: 8 },
    	wrapperCol: { span: 16 },
  	};

  	const tailFormItemLayout = {
    	wrapperCol: {
      		span: 14,
      		offset: 0,
    	},
  	};

	const newFolderPopoverProps = {

		treeSelectOnChange (value) {
			props.dispatch({
				type: 'vdpm/handleRreeSelect',
				payload: { value: value}
			});
		},

		style: {
	      	width: parseInt($(document).width()) / 2,
	      	height: parseInt($(document).height()) - 50
		},
		newFolderVisibleChange(value){

			props.dispatch({
				type: 'vdpm/handleFolderPageVisible',
				payload: { value: value}
			});
		},
		hideNewFolderPopover(){
			props.dispatch({
				type: 'vdpm/handleNewFolderVisible',
				payload: { value: false}
			});
		}
	}
	const newPagePopoverProps = {
		newPageVisibleChange(value){

			console.log(value);
			props.dispatch({
				type: 'vdpm/handleNewPageVisible',
				payload: { value: value}
			});
		},
		hideNewPagePopover(){
			props.dispatch({
				type: 'vdpm/handleNewPageVisible',
				payload: { value: false}
			});
		}
	}

	const newFolderPopover = {
		content: (
			<div style={newFolderPopoverProps.style}>
		        <h2>文件夹设置</h2>
		        <Form>
		          	<FormItem
		            	{...formItemLayout}
		            	label="上级文件夹"
		            	hasFeedback
		          		>

			      	<TreeSelect
			        	showSearch
			        	style={{ width: '100%' }}
			        	value={props.vdpm.pageManager.treeSelect.value}
			        	dropdownStyle={{ maxHeight: '100%', overflow: 'auto' }}
			        	placeholder="请选择父级文件夹"
			        	allowClear
			        	treeDefaultExpandAll
			        	onChange={newFolderPopoverProps.treeSelectOnChange}
			      	>
			        	<TreeNode value="parent 1" title="parent 1" key="0-1">
			          		<TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
			            	<TreeNode value="leaf1" title="my leaf" key="random" />
			            	<TreeNode value="leaf2" title="your leaf" key="random1" />
			          	</TreeNode>
			          	<TreeNode value="parent 1-1" title="parent 1-1" key="random2">
			            	<TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
			          	</TreeNode>
			        	</TreeNode>
			      	</TreeSelect>

		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label={(
		              <span>
		                文件夹名称&nbsp;
		                <Tooltip title="建议使用英文">
		                  <Icon type="question-circle-o" />
		                </Tooltip>
		              </span>
		            )}
		            hasFeedback
		          >
		            <Input />
		          </FormItem>

		          <FormItem {...tailFormItemLayout}>
		            <Button type="primary" htmlType="submit" onClick={newFolderPopoverProps.hideNewFolderPopover}>创建</Button>
		          </FormItem>
		        </Form>
			</div>
		)
	}

	const newPagePopover = {
		content: (
			<div style={newFolderPopoverProps.style}>
		        <h2>文件夹设置</h2>
		        <Form>
		          	<FormItem
		            	{...formItemLayout}
		            	label="上级文件夹"
		            	hasFeedback
		          		>

			      	<TreeSelect
			        	showSearch
			        	style={{ width: '100%' }}
			        	value={props.vdpm.pageManager.treeSelect.value}
			        	dropdownStyle={{ maxHeight: '100%', overflow: 'auto' }}
			        	placeholder="请选择父级文件夹"
			        	allowClear
			        	treeDefaultExpandAll
			        	onChange={newFolderPopoverProps.treeSelectOnChange}
			      	>
			        	<TreeNode value="parent 1" title="parent 1" key="0-1">
			          		<TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
			            	<TreeNode value="leaf1" title="my leaf" key="random" />
			            	<TreeNode value="leaf2" title="your leaf" key="random1" />
			          	</TreeNode>
			          	<TreeNode value="parent 1-1" title="parent 1-1" key="random2">
			            	<TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
			          	</TreeNode>
			        	</TreeNode>
			      	</TreeSelect>

		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label={(
		              <span>
		                页面名称&nbsp;
		                <Tooltip title="建议使用英文">
		                  <Icon type="question-circle-o" />
		                </Tooltip>
		              </span>
		            )}
		            hasFeedback
		          >
		            <Input />
		          </FormItem>
		        </Form>
		        <h2>SEO设置</h2>
		        <Form>
		          <FormItem
		            {...formItemLayout}
		            label={(
		              <span>
		                Title&nbsp;
		                <Tooltip title="建议页面单独地定义一个title标签，而不是重复的使用默认标题">
		                  <Icon type="question-circle-o" />
		                </Tooltip>
		              </span>
		            )}
		            hasFeedback
		          >
		            <Input />
		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label={(
		              <span>
		                Description&nbsp;
		                <Tooltip title="Description用来描述网站，通常是比较通顺的一句话组成，不建议刻意堆积关键词，字数一般不超过100个汉字。">
		                  <Icon type="question-circle-o" />
		                </Tooltip>
		              </span>
		            )}
		            hasFeedback
		          >
		            <Input type="textarea" rows={4} />
		          </FormItem>
		        </Form>
		        <h2>自定义代码</h2>
		        <Form>
		          <FormItem
		            {...formItemLayout}
		            label="在<head>标签内"
		            hasFeedback
		          >
		            <Input type="textarea" rows={6} />
		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label="在</body>标签前"
		            hasFeedback
		          >
		            <Input type="textarea" rows={6} />
		          </FormItem>

		          <FormItem {...tailFormItemLayout}>
		            <Button type="primary" htmlType="submit" onClick={newPagePopoverProps.hideNewPagePopover}>创建</Button>
		          </FormItem>
		        </Form>

			</div>
		)
	}

  	return (

	    <ul className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
         	<Popover placement="right" title="新建文件夹" content={newFolderPopover.content} trigger="click" visible={props.vdpm.pageManager.newFolderVisible}  onVisibleChange={newFolderPopoverProps.newFolderVisibleChange}>
	      		<li className="ant-dropdown-menu-item" role="menuitem">
					<Icon type="folder-open" />&nbsp;新建文件夹
	      		</li>
			</Popover>
	      	<li className=" ant-dropdown-menu-item-divider"></li>

         	<Popover placement="right" title="新建页面" content={newPagePopover.content} trigger="click"  visible={props.vdpm.pageManager.newPageVisible}  onVisibleChange={newPagePopoverProps.newPageVisibleChange}>
			    <li className="ant-dropdown-menu-item" role="menuitem">
					<Icon type="file" />&nbsp;新建页面
			    </li>
  			</Popover>
	      	<li className=" ant-dropdown-menu-item-divider"></li>

	    </ul>

   	);

};

function mapSateToProps({ vdpm }) {
  return { vdpm };
}

export default connect(mapSateToProps)(Component);
