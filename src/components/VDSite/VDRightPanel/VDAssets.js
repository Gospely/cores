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

			const linkToWhere = props.vdcore.rightTabsPane.linkTo;
			if(linkToWhere == 'settings'){

				props.dispatch({
					type: 'vdcore/changeTabsPane',
					payload: {
						activeTabsPane: 'settings',
          				linkTo: '',
					}
				});

				props.dispatch({
					type: 'vdCtrlTree/uploadPreviewImg',
					payload: file
				})

			}else if(linkToWhere == 'style'){

				props.dispatch({
					type: 'vdcore/changeTabsPane',
					payload: {
						activeTabsPane: 'style',
          				linkTo: '',
					}
				});

				props.dispatch({
					type: 'vdstyles/showBackgroundStyleSettingPane',
					payload: false
				});

				props.dispatch({
					type: 'vdCtrlTree/uploadBgImg',
					payload: file
				});

				props.dispatch({
					type: 'vdstyles/changeVDStylePaneSpinActive',
					payload: true
				});

				console.log($("#VDRightPanel"));

				$("#VDRightPanel").ready(function(){
						props.dispatch({
						type: 'vdstyles/changeVDStylePaneSpinActive',
						payload: false
					});
				});

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
			console.log('uploadImage');
			console.log(image);
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
