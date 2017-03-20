import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal, Input } from 'antd';



const SaveAsMould = (props) => {

  const SaveAsMouldProps = {

    hide () {
      props.dispatch({
        type: 'sidebar/changeSaveAsMouldeVisible',
        payload: {
              visible:false,
              confirmLoading:false
          }
      });
    },
    
    handleOk () {
      props.dispatch({
        type: 'sidebar/changeSaveAsMouldeVisible',
        payload: {
              visible:true,
              confirmLoading:true
          }
      })

      setTimeout(() => {
        props.dispatch({
          type: 'sidebar/changeSaveAsMouldeVisible',
          payload: {
              visible:false,
              confirmLoading:false
          }
        });
      }, 2000);
    }

  };

  return (
    
      <div>
            <Modal
              title="设置为模板"
              visible={props.sidebar.saveAsMouldModal.visible}
              wrapClassName="saveAsMould-wrapper"
              onOk={SaveAsMouldProps.handleOk}
              onCancel={SaveAsMouldProps.hide}
              confirmLoading={props.sidebar.saveAsMouldModal.confirmLoading}
            >
              <div>
                <Input placeholder="设置模板名" />
              </div>
              
            </Modal>
      </div>
      
  );

};

function mapSateToProps({ sidebar }) {
  return { sidebar };
}

export default connect(mapSateToProps)(SaveAsMould);