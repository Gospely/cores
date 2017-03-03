import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (
    <div>2333</div>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);