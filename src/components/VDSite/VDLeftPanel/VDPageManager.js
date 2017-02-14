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
	const loopData = data => data.map((item) => {

		if (item.children != null) {
			return <TreeNode title={item.name} value={item.key} key={item.key} >{loopData(item.children)}</TreeNode>;
		}
		return (
		  <TreeNode title={item.name} value={item.key} key={item.key} disabled="true" />
		);
    });
	const newFolderPopoverProps = {

		newFolderTreeSelectOnChange (value) {
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
				type: 'vdpm/handleNewFolderVisible',
				payload: { value: true}
			});
		},
		handleFolderNameChange(value){

			props.dispatch({
				type: 'vdpm/handleFolderName',
				payload: { value: value.target.value}
			});
		},
		handleCreate(){
			props.dispatch({
				type: 'vdpm/handleCreateFolder',
			});
		},
		createFolder(){

			var value = props.vdpm.pageManager.newFolderVisible
			setTimeout(function(){
				props.dispatch({
					type: 'vdpm/handleNewFolderVisible',
					payload: { value: !value}
				});
			}, 200);
		},
	}
	const newPagePopoverProps = {
		newPageTreeSelectOnChange (value) {
			props.dispatch({
				type: 'vdpm/handleNewPageRreeSelect',
				payload: { value: value}
			});
		},
		newPageVisibleChange(value){

			props.dispatch({
				type: 'vdpm/handleNewPageVisible',
				payload: { value: true}
			});
		},
		handlePageNameChange(value){

			props.dispatch({
				type: 'vdpm/handleFolderName',
				payload: { target: 'name', value: value.target.value}
			});
		},
		createPage(){


			var value = props.vdpm.pageManager.newPageVisible;

			setTimeout(function(){
				props.dispatch({
					type: 'vdpm/handleNewPageVisible',
					payload: { value: !value}
				});
				props.dispatch({
					type: 'vdpm/handleNewFolderVisible',
					payload: { value:false}
				});
			}, 200);

		},
		handleCreatePage(){

			localStorage.createPage = 'false'
			props.dispatch({
				type: 'vdpm/handleCreatePage',
				payload: { value: false}
			});
			setTimeout(function(){
				props.dispatch({
					type: 'vdpm/handleNewPageVisible',
					payload: { value: false}
				});
			}, 500)
		},
		handlePageNameChange(value){

			props.dispatch({
				type: 'vdpm/handNewPageFormChange',
				payload: { target: 'name', value: value.target.value}
			});
		},
		handlePageTitleChange(value){
			props.dispatch({
				type: 'vdpm/handNewPageFormChange',
				payload: { target: 'seo.title', value: value.target.value}
			});
		},
		handlePageDescriptionChange(value){

			props.dispatch({
				type: 'vdpm/handNewPageFormChange',
				payload: { target: 'seo.description', value: value.target.value}
			});
		},
		handlePageHeadChange(value){
			props.dispatch({
				type: 'vdpm/handNewPageFormChange',
				payload: { target: 'script.head', value: value.target.value}
			});
		},
		handlePageScriptChange(value){
			props.dispatch({
				type: 'vdpm/handNewPageFormChange',
				payload: { target: 'script.script', value: value.target.value}
			});
		}
	}
	let treeNodes = loopData(props.vdpm.pageList);

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
			        	onChange={newFolderPopoverProps.newFolderTreeSelectOnChange}
			      	>
			        	{treeNodes}
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
		            <Input value={props.vdpm.newFolderForm.name} onChange={newFolderPopoverProps.handleFolderNameChange}/>
		          </FormItem>

		          <FormItem {...tailFormItemLayout}>
		            <Button type="primary" htmlType="submit" onClick={newFolderPopoverProps.handleCreate}>创建</Button>
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
			        	onChange={newPagePopoverProps.newPageTreeSelectOnChange}
			      	>
			        	{treeNodes}
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
		            <Input value={props.vdpm.newPageFrom.name} onChange={newPagePopoverProps.handlePageNameChange}/>
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
		            <Input  value={props.vdpm.newPageFrom.seo.title} onChange={newPagePopoverProps.handlePageTitleChange}/>
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
		            <Input type="textarea" rows={4}  value={props.vdpm.newPageFrom.seo.description} onChange={newPagePopoverProps.handlePageDescriptionChange}/>
		          </FormItem>
		        </Form>
		        <h2>自定义代码</h2>
		        <Form>
		          <FormItem
		            {...formItemLayout}
		            label="在<head>标签内"
		            hasFeedback
		          >
		            <Input type="textarea" rows={6}  value={props.vdpm.newPageFrom.script.head}  onChange={newPagePopoverProps.handlePageHeadChange}/>
		          </FormItem>
		          <FormItem
		            {...formItemLayout}
		            label="在</body>标签前"
		            hasFeedback
		          >
		            <Input type="textarea" rows={6} value={props.vdpm.newPageFrom.script.script}  onChange={newPagePopoverProps.handlePageScriptChange}/>
		          </FormItem>

		          <FormItem {...tailFormItemLayout}>
		            <Button type="primary" htmlType="submit" onClick={newPagePopoverProps.handleCreatePage}>创建</Button>
		          </FormItem>
		        </Form>

			</div>
		)
	}

  	return (

	    <ul className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
         	<Popover placement="right" title="新建文件夹" content={newFolderPopover.content} trigger="click" onClick={newFolderPopoverProps.createFolder}  visible={props.vdpm.pageManager.newFolderVisible}  onVisibleChange={newFolderPopoverProps.newFolderVisibleChange}>
	      		<li className="ant-dropdown-menu-item" role="menuitem">
					<Icon type="folder-open" />&nbsp;新建文件夹
	      		</li>
			</Popover>
	      	<li className=" ant-dropdown-menu-item-divider"></li>

         	<Popover placement="right" title="新建页面" content={newPagePopover.content} trigger="click" onClick={newPagePopoverProps.createPage}  visible={props.vdpm.pageManager.newPageVisible}  onVisibleChange={newPagePopoverProps.newPageVisibleChange}>
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
