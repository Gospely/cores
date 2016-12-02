import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Input } from 'antd';

const previewer = (props) => {

	const previewerProps = {

		handleInputChange(e) {
			props.dispatch({
				type: 'previewer/handleInputChange',
				payload: e.target.value
			})
		}

	};

  	return (
		<div className="designer-wrapper">

			<div className="designer-header">
				<div style={{width: '100%', textAlign: 'center'}}>
					<Input style={{width: 288, marginRight: 29, marginBottom: 10, marginTop: 10}} onChange={previewerProps.handleInputChange} value={props.previewer.siteValue} placeholder="输入网址"/>
					<Button span='4' type="primary">刷新</Button>
				</div>
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

function mapSateToProps({ previewer, designer }) {
	return { previewer, designer };
}

export default connect(mapSateToProps)(previewer);
