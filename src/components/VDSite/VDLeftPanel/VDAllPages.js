import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Popover } from 'antd';

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

import { Row, Col } from 'antd';

const TabPane = Tabs.TabPane;

import { Form, Input, Cascader, Select, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const Component = (props) => {

	const allPagesProps = {

		handlePageListItemClick (e) {
			var key = e.key;
			props.dispatch({
				type: 'vdpm/setCurrentActivePageListItem',
				payload: key
			});
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
            <Input type="textarea" rows={10} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="在</body>标签前"
            hasFeedback
          >
            <Input type="textarea" rows={10} />
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button type="danger" style={{marginLeft: '10px'}}>删除页面</Button>            
          </FormItem>
        </Form>
      </div>
    );
  };

  const pageTreeGenerator = (tree, isFolder) => {
          var tpl = [];

          for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if(item.children) {
              tpl.push((
                <SubMenu key={item.key + i} title={<span><Icon type="folder" />{item.name}</span>}>
                  {pageTreeGenerator(item.children, true)}
                </SubMenu>
              ))
            }else {
              tpl.push((
                <Menu.Item key={item.key}>
                  <Row>
                    <Col span={20}>
                      {item.name}
                    </Col>
                    <Col span={4}>
                      <Tooltip placement="top" title="设置页面的详细信息">
                        <Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings(item)} trigger="click">
                          <Icon type="setting" />
                        </Popover>
                      </Tooltip>
                    </Col>
                  </Row>
                </Menu.Item>
              ));
            }
          };

          return tpl;

        },

        pageTreeTpl = pageTreeGenerator(props.vdpm.pageList);

	return (
    <div className="vd-allpages-list">
      <Menu onClick={allPagesProps.handlePageListItemClick}
      	style={{ width: '100%' }}
      	defaultOpenKeys={['index.html']}
      	selectedKeys={[props.vdpm.currentActivePageListItem]}
      	mode="inline"
      >
        {pageTreeTpl}
      </Menu>
    </div>
	);

};

function mapSateToProps({ vdpm }) {
  return { vdpm };
}

export default connect(mapSateToProps)(Component);
