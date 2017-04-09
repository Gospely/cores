import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Popover } from 'antd';

import { Menu, Modal, message, Popconfirm} from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { Row, Col } from 'antd';

const TabPane = Tabs.TabPane;

import { Form, Input, Cascader, Select, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const Component = (props) => {

	const allPagesProps = {

		handlePageListItemClick (e) {
			var key = e.key;
			localStorage.popoverKey = key;

			//保存页面
			if(props.vdpm.currentActivePageListItem != key){
				// props.dispatch({
				// 	type: 'vdpm/savePage',
				// 	payload: props.vdpm.currentActivePageListItem
				// });
			}
			props.dispatch({
				type: 'vdpm/setCurrentActivePageListItem',
				payload: key
			});
		},
		visibleChange(e){
			// setTimeout(function(){
			// 	if(localStorage.popoverKay == props.vdpm.currentActivePageListItem && !props.vdpm.pageManager.updatePopoverVisible){
			// 		props.dispatch({
			// 			type: 'vdpm/handleUpdatePopoverVisible',
			// 		});
			// 	}
			// }, 200)
			props.dispatch({
				type: 'vdpm/handleUpdatePopoverVisible',
			});

			e.stopPropagation();
		}
	}
	const formItemProps = {

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
		},
		updatePage(){
			props.dispatch({
				type: 'vdpm/updatePage',
			});
		},
		deletePage(){

			if(props.vdpm.currentActivePageListItem == 'index.html'){
				message.error('主页面不能删除');
				return;
			}
			confirm({
				title: '即将删除',
				content: '确认删除',
				onOk() {

					props.dispatch({
						type: 'vdpm/deletePage',
					});
					props.dispatch({
						type: 'vdCtrlTree/deletePage',
						payload: {
							key: props.vdpm.currentActivePageListItem
						}
					});
					props.dispatch({
						type: 'vdpm/removeFile',
						payload: {
							fileName: props.vdpm.currentActivePageListItem
						}
					});
				},
				onCancel() {

				},
			});

		},
		delete(item){

			if(item.key == 'index.html'){
				message.error('主页面不能删除');
				return;
			}
			props.dispatch({
				type: 'vdpm/deletePage',
				payload: item.key
			});
			props.dispatch({
				type: 'vdCtrlTree/deletePage',
				payload: {
					key: item.key
				}
			});
			props.dispatch({
				type: 'vdpm/removeFile',
				payload: {
					fileName: item.key
				}
			});
		},

		deletePopoverVisibleChange(item, e){
			if(props.vdpm.currentActivePageListItem != item.key){
				// props.dispatch({
				// 	type: 'vdpm/savePage',
				// 	payload: props.vdpm.currentActivePageListItem
				// });
			}
			if(!item.children){
				props.dispatch({
					type: 'vdpm/setCurrentActivePageListItem',
					payload: item.key
				});
			}
			

			if(item.key == 'index.html'){
				message.error('主页面不能删除');
				return;
			}
			e.stopPropagation()
		},
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

  const config = {
    rules: [{ type: 'object', required: true, message: 'Please select time!' }],
  };
  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  };

  const generatePageDetailSettings = () => {

    var myStyle = {
      width: parseInt($(document).width()) / 2,
      height: parseInt($(document).height()) - 50
    }

    return (
      <div style={myStyle}>
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
            <Input  value={props.vdpm.newPageFrom.seo.title} onChange={formItemProps.handlePageTitleChange}/>
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
            <Input type="textarea" rows={4} value={props.vdpm.newPageFrom.seo.description} onChange={formItemProps.handlePageDescriptionChange}/>
          </FormItem>
        </Form>
        <h2>自定义代码</h2>
        <Form>
          <FormItem
            {...formItemLayout}
            label="在<head>标签内"
            hasFeedback
          >
            <Input type="textarea" rows={10} value={props.vdpm.newPageFrom.script.head} onChange={formItemProps.handlePageHeadChange}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="在</body>标签前"
            hasFeedback
          >
            <Input type="textarea" rows={10} value={props.vdpm.newPageFrom.script.script} onChange={formItemProps.handlePageScriptChange}/>
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={formItemProps.updatePage}>保存</Button>
            <Button type="danger" style={{marginLeft: '10px'}} onClick={formItemProps.deletePage}>删除页面</Button>
          </FormItem>
        </Form>
      </div>
    );
  };

  const pageTreeGenerator = (tree, isFolder) => {
          var tpl = [];

          for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if(item != null && item.children && item.children != undefined) {
                  tpl.push((
                    <SubMenu key={item.key} title={<Row>
    				  <Col span={18}>
    					  <Icon type="folder" />{item.name}
    				  </Col>
    				  <Col span={4}>
						  <Popconfirm title="确认删除吗？" onConfirm={formItemProps.delete.bind(this, item)} okText="确定" cancelText="取消">
	    					<Tooltip placement="top" title="删除文件夹">
	    						<Icon type="delete" onClick={formItemProps.deletePopoverVisibleChange.bind(this, item)} />
	    					</Tooltip>
						  </Popconfirm>
    				  </Col>
    				</Row>}>
                      {pageTreeGenerator(item.children, true)}
                    </SubMenu>
                  ))
            }else {
    			if(item != null){
    				tpl.push((
    				  <Menu.Item key={item.key}>
    					<Row>
    					  <Col span={18}>
    						<Icon type="file" />{item.name}
    					  </Col>
    					  <Col span={2}>
						   <Popconfirm title="确认删除吗？" onConfirm={formItemProps.delete.bind(this, item)} okText="确定" cancelText="取消">
	    						<Tooltip placement="top" title="删除文件">
	    							<Icon type="delete" onClick={formItemProps.deletePopoverVisibleChange.bind(this, item)} />
	    						</Tooltip>
							</Popconfirm>
    					  </Col>
    					  <Col span={2}>
    						<Tooltip placement="top" title="设置页面的详细信息">
    							<Icon type="setting" onClick={allPagesProps.visibleChange}/>
    						</Tooltip>
    					  </Col>
    					</Row>
    				  </Menu.Item>
    				));
    			}
            }
          };

          return tpl;

        },

        pageTreeTpl = pageTreeGenerator(props.vdpm.pageList);

    const onPageSelect = (val, option) => {
    	props.dispatch({
    		type: 'vdCtrlTree/setActivePage',
    		payload: {
    			activePage: val
    		}
    	});
      $("#vdsitePagesBtn").click();
    }

	return (
    <div className="vd-allpages-list">
		<Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings()} onClick={allPagesProps.handlePageListItemClick} visibleChange={allPagesProps.visibleChange}  visible={props.vdpm.pageManager.updatePopoverVisible}>
			<Menu
				style={{ width: '100%' }}
				defaultOpenKeys={['index.html']}
				selectedKeys={[props.vdpm.currentActivePageListItem]}
				mode="inline"
				onSelect={onPageSelect}
			>
			{pageTreeTpl}
			</Menu>
  		</Popover>

    </div>
	);

};

function mapSateToProps({ vdpm, vdCtrlTree }) {
  return { vdpm, vdCtrlTree };
}

export default connect(mapSateToProps)(Component);
