import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal } from 'antd';



const Preview = (props) => {

  window.onbeforeunload = function(){
    
      props.dispatch({
        type: 'preview/hidePreview'
      });    
}

  const PreviewProps = {

    hide () {
      props.dispatch({
        type: 'preview/hidePreview'
      });
    },

    hideSpin () {
      console.log('onload');
      props.dispatch({
        type: 'preview/hideSpin',
        payload: false
      })
    }

  };

  return (
    
      <div className="designer-wrapper">
            <Modal
            title="预览| Gospel - Web在线可视化集成开发环境"
              wrapClassName="vertical-center-modal"
              visible={props.preview.visible}
              wrapClassName="dashboard-wrapper"
              onCancel={PreviewProps.hide}
            >
            <div id="previewSpin">
              <Spin spinning={props.preview.spinVisible} tip="Loading..." size="large">
                <iframe
                  name="gospel-designer" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  src={props.preview.src}
                  onLoad={PreviewProps.hideSpin}
                  >
                 
                </iframe>
              </Spin>
            </div>   
            </Modal>
      </div>
      
  );

};

function mapSateToProps({ preview }) {
  return { preview };
}

export default connect(mapSateToProps)(Preview);