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

			<div className="designer-body-previewer"></div>

			<iframe 
				name="gospel-designer" 
				width={props.designer.deviceList[props.designer.defaultDevice].width} 
				height={props.designer.deviceList[props.designer.defaultDevice].height} 
				className="designer-previewer" 
				frameBorder="0" 
				// src="static/designer/weui/designer.html"
				src="http://localhost:6767/"
				>
			</iframe>

		</div>
  	);

};

function mapSateToProps({ previewer, designer }) {
	return { previewer, designer };
}

export default connect(mapSateToProps)(previewer);
