import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

const Dashboard = (props) => {

  const DashboardProps = {

    hide () {
      // props.dispatch({
      //   type: 'dashboard/hide'
      // });
    },

    src () {
      if(document.domain == 'localhost') {
        return 'http://localhost:8088';
      }else {
        return 'http://dash.gospely.com';
      }
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
          // onCancel={DashboardProps.hide()}
        >
          <iframe
            name="gospel-designer" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            src={DashboardProps.src()}
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