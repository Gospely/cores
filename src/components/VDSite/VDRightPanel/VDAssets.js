import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal, Spin } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';

import { Upload } from 'antd';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const Component = (props) => {

	const assetsProps = {
		handlePreview (file) {

			const linkToSettings = props.vdcore.rightTabsPane.linkTo;

			if(linkToSettings){
				    console.log(file);
            		console.log(props.vdCtrlTree.layoutState);
				props.dispatch({
					type: 'vdcore/changeTabsPane',
					payload: {
						activeTabsPane: 'settings',
          				linkTo: false,
					}
				});

				props.dispatch({
					type: 'vdCtrlTree/uploadPreviewImg',
					payload: file
				})

			}else{

				props.dispatch({
					type: 'vdassets/handlePreview',
					payload: {
			      		previewImage: file.url || file.thumbUrl,
			      		previewVisible: true,
			    	}

			});
			}
		},

		handleChange (image) {

			if(image.file.status == 'removed'){

				confirm({
					title: '即将删除图片',
					content: '确认删除图片? ',
					onOk() {
						props.dispatch({
							type: 'vdassets/deletImage',
							payload: image.file.name,
						});
					},
					onCancel() {

					},
				});
			}
		},
		customRequest(image){
			props.dispatch({
				type: 'vdassets/uploadImage',
				payload: image,
			});
	   },
		handleCancel () {

			props.dispatch({
				type: 'vdassets/handleCancel'
			});
		},
	}

    const uploadButton = (
      <div style={{height: '100%'}}>
        <Icon type="plus" style={{lineHeight: '2.2'}} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

  	return (
		<Spin spinning={props.vdassets.isUploading}>
		<div className="clearfix" style={{textAlign: 'center', marginTop: '10px'}}>
        	<Upload
				name='fileUp'
          		listType="picture-card"
          		fileList={props.vdassets.fileList}
          		onPreview={assetsProps.handlePreview}
          		onChange={assetsProps.handleChange}
				customRequest={assetsProps.customRequest}
        	>
        		     	{uploadButton}
        	</Upload>
        	<Modal visible={props.vdassets.previewVisible} footer={null} onCancel={assetsProps.handleCancel}>
          		<img alt="assets" style={{ width: '100%' }} src={props.vdassets.previewImage} />
        	</Modal>
      </div>
	  </Spin>
  	);

};

function mapSateToProps({ vdassets, vdcore, vdCtrlTree}) {
  return { vdassets, vdcore, vdCtrlTree};
}

export default connect(mapSateToProps)(Component);
