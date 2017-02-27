import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

const VDDesignerPanel = (props) => {

  const VDDesignerPanelProps = {

    hide () {
      props.dispatch({
        type: 'dashboard/hideDash'
      });
    },

    handleDesPanelLoaded() {
      window.VDDesignerFrame = window.frames["vdsite-designer"];
      setTimeout(function() {
        VDDesignerFrame.postMessage({
          VDDesignerLoaded: {
              load: true
          }
        }, '*');

        //加载全局CSS
        props.dispatch({
          type: 'vdstyles/applyCSSStyleIntoPage',
          payload: {
            activeCtrl: props.vdCtrlTree.activeCtrl
          }
        });

      }, 500);
    }

  };

  return (
    <div className="designer-wrapper" style={{height: '100%'}}>
        <iframe
          name="vdsite-designer"
          width="100%" 
          height="100%" 
          frameBorder="0" 
          src="static/designer/vdsite/index.html"
          onLoad={VDDesignerPanelProps.handleDesPanelLoaded}
          >
        </iframe>
    </div>
  );

};

function mapSateToProps({ vdCtrlTree }) {
  return { vdCtrlTree };
}

export default connect(mapSateToProps)(VDDesignerPanel);