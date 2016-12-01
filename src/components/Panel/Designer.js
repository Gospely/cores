import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Menu, Dropdown, Icon } from 'antd';

const Designer = (props) => {

	const designerProps = {

		onSelectDevice(val) {
			props.dispatch({
				type: 'designer/handleDeviceSelected',
				payload: val.key
			})
		}

	};

	const deviceMenuItem = props.designer.deviceList.map((device, index) => (
		<Menu.Item key={index}>{device.name}</Menu.Item>
	));

	const deviceSelectedMenu = (
	  	<Menu onSelect={designerProps.onSelectDevice}>
	    	{deviceMenuItem}
	  	</Menu>
	);

  	return (
		<div className="designer-wrapper">

			<div className="designer-header">
				<label className="bold">设备</label>

				<Dropdown overlay={deviceSelectedMenu} trigger={['click']}>
					<Button 
						className="deviceSelectorBtn">
						{props.designer.deviceList[props.designer.defaultDevice].name} <Icon type="down" />
					</Button>
				</Dropdown>
			</div>

			<div className="designer-body">
				<iframe 
					name="gospel-designer" 
					width={props.designer.deviceList[props.designer.defaultDevice].width} 
					height={props.designer.deviceList[props.designer.defaultDevice].height} 
					className="designer" 
					frameBorder="0" 
					// src="static/designer/weui/designer.html"
					src="http://localhost:6767/"
					>
				</iframe>
			</div>

		</div>
  	);

};

function mapSateToProps({ designer }) {
	return { designer };
}

export default connect(mapSateToProps)(Designer);
