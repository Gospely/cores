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

	const text = `
  		A dog is a type of domesticated animal.
  		Known for its loyalty and faithfulness,
  		it can be found as a welcome guest in many households across the world.
	`;

  	return (
  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['layout', 'basic', 'typo', 'media', 'forms', 'components']}>
			    <Panel header="布局" key="layout">
				  	<Row>
				    	<Col span={8}>
				    		<div className="anticons-list-item">
								<svg width="62" height="50" viewBox="0 0 62 50" className="bem-Svg"  style={{'transform': 'translate(0px, 0px)'}}><path opacity=".25" fill="currentColor" d="M59 1H3c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h56c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 3c.8 0 1.5.7 1.5 1.5S15.3 6 14.5 6 13 5.3 13 4.5 13.7 3 14.5 3zm-5 0c.8 0 1.5.7 1.5 1.5S10.3 6 9.5 6 8 5.3 8 4.5 8.7 3 9.5 3zm-5 0C5.3 3 6 3.7 6 4.5S5.3 6 4.5 6 3 5.3 3 4.5 3.7 3 4.5 3zM59 47H3V8h56v39z"></path><path opacity=".2" fill="currentColor" d="M5 10h52v16H5z"></path><g fill="currentColor"><path d="M5 10h2v4H5zm50 0h2v4h-2zM7 10h2v2H7zm16 0h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zM23 24h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zm6-14h4v2h-4zm0 14h4v2h-4z"></path><path d="M53 10h4v2h-4zm2 12h2v4h-2zM5 22h2v4H5zm0-6h2v4H5zm50 0h2v4h-2zm-2 8h2v2h-2z"></path><path d="M5 24h4v2H5z"></path></g><g opacity=".3" fill="currentColor"><path d="M5 29h2v4H5zm50 0h2v4h-2zM7 29h2v2H7zm16 0h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zM23 43h4v2h-4zm-6 0h4v2h-4zm-6 0h4v2h-4zm18 0h4v2h-4zm6 0h4v2h-4zm6 0h4v2h-4zm6-14h4v2h-4zm0 14h4v2h-4z"></path><path d="M53 29h4v2h-4zm2 12h2v4h-2zM5 41h2v4H5zm0-6h2v4H5zm50 0h2v4h-2zm-2 8h2v2h-2z"></path><path d="M5 43h4v2H5z"></path></g><path opacity=".4" d="M57 10v16H5V10h52m1-1H4v18h54V9z"></path></svg>
				    			<div className="anticon-class">区段</div>
				    		</div>
				    	</Col>
				    	<Col span={8}>
				    		<div className="anticons-list-item">
				    			<svg width="62" height="50" viewBox="0 0 62 50" className="bem-Svg" style={{'transform': 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M14 10h34v34H14z"></path><g fill="currentColor"><path d="M14 10h2v4h-2zm32 0h2v4h-2zm-30 0h2v2h-2zm10 0h4v2h-4zm-6 0h4v2h-4zm12 0h4v2h-4zm-6 32h4v2h-4zm-6 0h4v2h-4zm12 0h4v2h-4zm6-32h4v2h-4zm0 32h4v2h-4z"></path><path d="M44 10h4v2h-4zm2 30h2v4h-2zm-32 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm32 6h2v4h-2zm-32 6h2v4h-2zm32 0h2v4h-2zm-32 6h2v4h-2zm32 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M14 42h4v2h-4z"></path></g><path opacity=".25" fill="currentColor" d="M59 1H3c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h56c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 3c.8 0 1.5.7 1.5 1.5S15.3 6 14.5 6 13 5.3 13 4.5 13.7 3 14.5 3zm-5 0c.8 0 1.5.7 1.5 1.5S10.3 6 9.5 6 8 5.3 8 4.5 8.7 3 9.5 3zm-5 0C5.3 3 6 3.7 6 4.5S5.3 6 4.5 6 3 5.3 3 4.5 3.7 3 4.5 3zM59 47H3V8h56v39z"></path><path opacity=".4" d="M48 10v34H14V10h34m1-1H13v36h36V9z"></path></svg>
				    			<div className="anticon-class">容器</div>
				    		</div>
				    	</Col>
				    	<Col span={8}>
				    		<div className="anticons-list-item">
								<svg width="62" height="50" viewBox="0 0 62 50" className="bem-Svg" style={{'transform': 'translate(0px, 0px)'}}><path opacity=".2" fill="currentColor" d="M14 10h16v34H14zm19 0h16v34H33z"></path><g fill="currentColor"><path d="M14 10h2v4h-2zm14 0h2v4h-2zm-12 0h2v2h-2zm4 0h4v2h-4zm0 32h4v2h-4z"></path><path d="M26 10h4v2h-4zm2 30h2v4h-2zm-14 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm14 6h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M14 42h4v2h-4zm19-32h2v4h-2zm14 0h2v4h-2zm-12 0h2v2h-2zm4 0h4v2h-4zm0 32h4v2h-4z"></path><path d="M45 10h4v2h-4zm2 30h2v4h-2zm-14 0h2v4h-2zm0-18h2v4h-2zm0-6h2v4h-2zm14 6h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm-14 6h2v4h-2zm14 0h2v4h-2zm0-18h2v4h-2zm-2 26h2v2h-2z"></path><path d="M33 42h4v2h-4z"></path></g><path opacity=".25" fill="currentColor" d="M59 1H3c-1.1 0-2 .9-2 2v44c0 1.1.9 2 2 2h56c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zM14.5 3c.8 0 1.5.7 1.5 1.5S15.3 6 14.5 6 13 5.3 13 4.5 13.7 3 14.5 3zm-5 0c.8 0 1.5.7 1.5 1.5S10.3 6 9.5 6 8 5.3 8 4.5 8.7 3 9.5 3zm-5 0C5.3 3 6 3.7 6 4.5S5.3 6 4.5 6 3 5.3 3 4.5 3.7 3 4.5 3zM59 47H3V8h56v39z"></path><path opacity=".4" d="M30 10v34H14V10h16m1-1H13v36h18V9zm18 1v34H33V10h16m1-1H32v36h18V9z"></path></svg>
				    			<div className="anticon-class">栅格</div>
				    		</div>
				    	</Col>
				  	</Row>
			    </Panel>
			    <Panel header="基础控件" key="basic">
			      	<p>{text}</p>
			    </Panel>
			    <Panel header="段落" key="typo">
			      	<p>{text}</p>
			    </Panel>
			    <Panel header="媒体" key="media">
			      	<p>{text}</p>
			    </Panel>
			    <Panel header="表单" key="forms">
			      	<p>{text}</p>
			    </Panel>
			    <Panel header="组件" key="components">
			      	<p>{text}</p>
			    </Panel>
			</Collapse>
  		</div>
  	);

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Component);
