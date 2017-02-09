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

  const generatePageDetailSettings = () => {
    return (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );
  };

	return (
    <Menu onClick={allPagesProps.handlePageListItemClick}
    	style={{ width: 240 }}
    	defaultOpenKeys={['sub1']}
    	selectedKeys={[props.vdpm.currentActivePageListItem]}
    	mode="inline"
    >
      <Menu.Item key="index.html">
        <Row>
          <Col span={20}>
            主页
          </Col>
          <Col span={4}>
            <Tooltip placement="top" title="设置页面的详细信息">
              <Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings()} trigger="click">
                <Icon type="setting" />
              </Popover>
            </Tooltip>
          </Col>
        </Row>
      </Menu.Item>
    	<SubMenu key="folder1" title={<span><Icon type="folder" />文件夹1</span>}>
        <Menu.Item key="1">
          <Row>
            <Col span={20}>
              页面2
            </Col>
            <Col span={4}>
              <Tooltip placement="top" title="设置页面的详细信息">
                <Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings()} trigger="click">
                  <Icon type="setting" />
                </Popover>
              </Tooltip>
            </Col>
          </Row>
        </Menu.Item>
        <Menu.Item key="2">
          <Row>
            <Col span={20}>
              页面3
            </Col>
            <Col span={4}>
              <Tooltip placement="top" title="设置页面的详细信息">
                <Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings()} trigger="click">
                  <Icon type="setting" />
                </Popover>
              </Tooltip>
            </Col>
          </Row>
        </Menu.Item>

        <SubMenu key="folder2" title={<span><Icon type="folder" />文件夹2</span>}>
          <Menu.Item key="3">
            <Row>
              <Col span={20}>
                页面4
              </Col>
              <Col span={4}>
                <Tooltip placement="top" title="设置页面的详细信息">
                  <Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings()} trigger="click">
                    <Icon type="setting" />
                  </Popover>
                </Tooltip>
              </Col>
            </Row>
          </Menu.Item>
          <Menu.Item key="4">
            <Row>
              <Col span={20}>
                页面5
              </Col>
              <Col span={4}>
                <Tooltip placement="top" title="设置页面的详细信息">
                  <Popover placement="right" title="设置页面的详细信息" content={generatePageDetailSettings()} trigger="click">
                    <Icon type="setting" />
                  </Popover>
                </Tooltip>
              </Col>
            </Row>
          </Menu.Item>
        </SubMenu>
    	</SubMenu>
    </Menu>
	);

};

function mapSateToProps({ vdpm }) {
  return { vdpm };
}

export default connect(mapSateToProps)(Component);
