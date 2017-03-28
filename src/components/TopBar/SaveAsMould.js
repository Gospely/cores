import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal, Input } from 'antd';



const SaveAsMould = (props) => {

  const SaveAsMouldProps = {

    hide () {
      props.dispatch({
        type: 'vdcore/changeSaveAsMouldeVisible',
        payload: {
              visible:false,
              confirmLoading:false
          }
      });
    },

    handleOk () {
      props.dispatch({
        type: 'vdcore/changeSaveAsMouldeVisible',
        payload: {
              visible:true,
              confirmLoading:true
          }
      })
      props.dispatch({
        type: 'vdcore/saveTemplate',
      })

  },
    onChange(e){

        props.dispatch({
            type: 'vdcore/changesaveAsMouldState',
            payload: e.target.value
        });
    }
  };

  return (

      <div>
            <Modal
              title="设置为模板"
              visible={props.vdcore.saveAsMouldModal.visible}
              wrapClassName="saveAsMould-wrapper"
              onOk={SaveAsMouldProps.handleOk}
              onCancel={SaveAsMouldProps.hide}
              okText="保存"
              confirmLoading={props.vdcore.saveAsMouldModal.confirmLoading}
            >
              <div>
                <Input placeholder="设置模板名" onChange={SaveAsMouldProps.onChange} value={props.vdcore.saveAsMouldModal.name}/>
                <img src={props.vdcore.saveAsMouldModal.previewUrl} style={{width:'300px', height:'300px'}} />
              </div>

            </Modal>
      </div>

  );

};

function mapSateToProps({ vdcore }) {
  return { vdcore };
}

export default connect(mapSateToProps)(SaveAsMould);
