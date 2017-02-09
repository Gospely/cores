import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Row, Col } from 'antd';

const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (

    <ul className="ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-menu-root symbol-list" role="menu">
      <li className="ant-dropdown-menu-item" role="menuitem">
        <Row>
          <Col span={4}>
            <svg width="26" height="26" viewBox="0 0 26 26" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)', color: 'rgba(0, 0, 0, 0.521569)', flexShrink: '0'}}><path fill="currentColor" d="M13-.08l-.37.14L0,5V20.66l13,5.47,13-5.47V5ZM24,6.46l0-.06h0ZM13,10.29,2.64,6.15,13,2.07,23.32,6.15ZM2,6.4l0,.06V6.41ZM2,8.05l10,4v11.5L2,19.34ZM14,23.54V12l10-4V19.34Z"></path><polygon fill="currentColor" opacity=".3" points="1.71 19.59 12.8 24.16 12.98 11.34 1.62 6.76 1.71 19.59"></polygon></svg>
          </Col>
          <Col span={18}>
            <a href="http://www.alipay.com/">底部</a>
            <p>7 个控件</p>
          </Col>
          <Col span={2}>
            <Icon type="edit" />
          </Col>
        </Row>
      </li>
      <li className="ant-dropdown-menu-item-divider"></li>

      <li className="ant-dropdown-menu-item" role="menuitem">
        <Row>
          <Col span={4}>
            <svg width="26" height="26" viewBox="0 0 26 26" className="bem-Svg " style={{display: 'block', transform: 'translate(0px, 0px)', color: 'rgba(0, 0, 0, 0.521569)', flexShrink: '0'}}><path fill="currentColor" d="M13-.08l-.37.14L0,5V20.66l13,5.47,13-5.47V5ZM24,6.46l0-.06h0ZM13,10.29,2.64,6.15,13,2.07,23.32,6.15ZM2,6.4l0,.06V6.41ZM2,8.05l10,4v11.5L2,19.34ZM14,23.54V12l10-4V19.34Z"></path><polygon fill="currentColor" opacity=".3" points="1.71 19.59 12.8 24.16 12.98 11.34 1.62 6.76 1.71 19.59"></polygon></svg>
          </Col>
          <Col span={18}>
            <a href="http://www.alipay.com/">头部</a>
            <p>7 个控件</p>
          </Col>
          <Col span={2}>
            <Icon type="edit" />
          </Col>
        </Row>
      </li>
      <li className=" ant-dropdown-menu-item-divider"></li>
    </ul>

  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);