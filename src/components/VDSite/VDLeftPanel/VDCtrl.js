import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Row, Col } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

const Component = (props) => {

	const panels = props.vdctrl.controllers.map((item, i) => {
		if(item.content) {
			const panelCtrl = item.content.map((ctrl, j) => {
				return (
			    	<Col key={ctrl.key} span={8}>
			    		<div className="anticons-list-item">
			    			{ctrl.icon}
			    			<div className="anticon-class">{ctrl.name}</div>
			    		</div>
			    	</Col>
				);
			});

			return (
				<Panel header={item.name} key={item.key}>
			      	<Row>
			      		{panelCtrl}
			      	</Row>
			    </Panel>
			);
		}
	})

  	return (
  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['layout', 'basic', 'typo', 'media', 'forms', 'components']}>
			    {panels}
			</Collapse>
  		</div>
  	);

};

function mapSateToProps({ vdctrl }) {
  return { vdctrl };
}

export default connect(mapSateToProps)(Component);
