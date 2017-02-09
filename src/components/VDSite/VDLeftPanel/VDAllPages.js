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

  const pageDetailSettings = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

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
              <Popover placement="right" title="设置页面的详细信息" content={pageDetailSettings} trigger="click">
                <Icon type="setting" />
              </Popover>
            </Tooltip>
          </Col>
        </Row>
      </Menu.Item>
    	<SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
      		<MenuItemGroup title="Item 1">
        		<Menu.Item key="1">Option 1</Menu.Item>
        		<Menu.Item key="2">Option 2</Menu.Item>
      		</MenuItemGroup>
      		<MenuItemGroup title="Item 2">
        		<Menu.Item key="3">Option 3</Menu.Item>
        		<Menu.Item key="4">Option 4</Menu.Item>
      		</MenuItemGroup>
    	</SubMenu>
    	<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
      		<Menu.Item key="5">Option 5</Menu.Item>
      		<Menu.Item key="6">Option 6</Menu.Item>
      		<SubMenu key="sub3" title="Submenu">
        		<Menu.Item key="7">Option 7</Menu.Item>
        		<Menu.Item key="8">Option 8</Menu.Item>
      		</SubMenu>
    	</SubMenu>
    	<SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
      		<Menu.Item key="9">Option 9</Menu.Item>
      		<Menu.Item key="10">Option 10</Menu.Item>
      		<Menu.Item key="11">Option 11</Menu.Item>
      		<Menu.Item key="12">Option 12</Menu.Item>
    	</SubMenu>
    </Menu>
	);

};

function mapSateToProps({ vdpm }) {
  return { vdpm };
}

export default connect(mapSateToProps)(Component);
