import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

const Dashboard = (props) => {

  const DashboardProps = {

    hide () {
      // props.dispatch({
      //   type: 'dashboard/hide'
      // });
    }

  };

  return (
    <div className="designer-wrapper">

        <Modal
          title="控制台 | Gospel - Web在线可视化集成开发环境"
          wrapClassName="vertical-center-modal"
          visible={props.dashboard.visible}
          footer={[]}
          wrapClassName="dashboard-wrapper"
          onCancel={DashboardProps.hide()}
        >
          <iframe
            name="gospel-designer" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            // src="static/designer/weui/designer.html"
            src="http://dash.gospely.com"
            >
          </iframe>
        </Modal>

    </div>
  );

};

function mapSateToProps({ dashboard }) {
  return { dashboard };
}

export default connect(mapSateToProps)(Dashboard);