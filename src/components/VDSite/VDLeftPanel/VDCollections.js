import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Row, Col } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

// window.VDDnddata = '';

const Component = (props) => {

  	return (
  		<div className="vdctrl-pane-wrapper">
			vdcollections
  		</div>
  	);

};

function mapSateToProps({ vdCollections }) {
  return { vdCollections };
}

export default connect(mapSateToProps)(Component);
