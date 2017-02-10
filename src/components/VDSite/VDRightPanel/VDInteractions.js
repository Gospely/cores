import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip, Row, Col } from 'antd';

const TabPane = Tabs.TabPane;

const Component = (props) => {

  return (
    <div style={{padding: '15px'}}>

    	<Row>
    		<Col span={18}><p>交互动画列表：</p></Col>
    		<Col span={6} style={{textAlign: 'right'}}>
    			<Button size="small"><Icon type="plus" /></Button>
    		</Col>
    	</Row>

    </div>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);