import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

const Dashboard = (props) => {

  const DashboardProps = {

    hide () {
      props.dispatch({
        type: 'dashboard/hideDash'
      });
    }

  };

  return (
    <div className="designer-wrapper">

        <Modal
          title="控制台 | Gospel - Web在线可视化集成开发环境"
          wrapClassName="vertical-center-modal"
          visible={props.dashboard.visible}
          wrapClassName="dashboard-wrapper"
          onCancel={DashboardProps.hide}
        >
          <iframe
            name="gospel-designer" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            src={props.dashboard.src}
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