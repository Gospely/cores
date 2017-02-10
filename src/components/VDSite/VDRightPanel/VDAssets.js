import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Upload } from 'antd';

const TabPane = Tabs.TabPane;

const Component = (props) => {

	const assetsProps = {
		handlePreview (file) {
			props.dispatch({
				type: 'vdassets/handlePreview',
				payload: {
			      	previewImage: file.url || file.thumbUrl,
			      	previewVisible: true,
			    }
			});
		},

		handleChange (fileList) {
			props.dispatch({
				type: 'vdassets/handleChange',
				payload: fileList
			});
		},

		handleCancel () {
			props.dispatch({
				type: 'vdassets/handleCancel'
			});
		}
	}

    const uploadButton = (
      <div style={{height: '100%'}}>
        <Icon type="plus" style={{lineHeight: '2.2'}} />
        <div className="ant-upload-text">上传</div>
      </div>
    );	

  	return (
		<div className="clearfix" style={{textAlign: 'center', marginTop: '10px'}}>
        	<Upload
          		action="/upload.do"
          		listType="picture-card"
          		fileList={props.vdassets.fileList}
          		onPreview={assetsProps.handlePreview}
          		onChange={assetsProps.handleChange}
        	>
        		     	{uploadButton}
        	</Upload>
        	<Modal visible={props.vdassets.previewVisible} footer={null} onCancel={assetsProps.handleCancel}>
          		<img alt="assets" style={{ width: '100%' }} src={props.vdassets.previewImage} />
        	</Modal>
      </div>
  	);

};

function mapSateToProps({ vdassets }) {
  return { vdassets };
}

export default connect(mapSateToProps)(Component);