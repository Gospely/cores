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

    handleDesPnelLoaded() {
        window.frames["vdsite-designer"].postMessage({
            VDDesignerLoaded: {
                load: true
            }
        }, '*');
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
          onLoad={VDDesignerPanelProps.handleDesPnelLoaded}
          >
        </iframe>
    </div>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(VDDesignerPanel);