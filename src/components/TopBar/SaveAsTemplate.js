import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal, Input } from 'antd';



const SaveAsTemplate = (props) => {

  const SaveAsTemplateProps = {

    hide () {
      props.dispatch({
        type: 'vdcore/changeSaveAsTemplateVisible',
        payload: {
              visible:false,
              confirmLoading:false
          }
      });
    },

    handleOk () {
      props.dispatch({
        type: 'vdcore/changeSaveAsTemplateVisible',
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
            type: 'vdcore/changesaveAsTemplateState',
            payload: e.target.value
        });
    }
  };

  return (

      <div>
            <Modal
              title="设置为模板"
              visible={props.vdcore.saveAsTemplateModal.visible}
              wrapClassName="saveAstemplate-wrapper"
              onOk={SaveAsTemplateProps.handleOk}
              onCancel={SaveAsTemplateProps.hide}
              okText="保存"
              confirmLoading={props.vdcore.saveAsTemplateModal.confirmLoading}
            >
              <div>
                <Input placeholder="设置模板名" onChange={SaveAsTemplateProps.onChange} value={props.vdcore.saveAsTemplateModal.name}/>
                <img src={props.vdcore.saveAsTemplateModal.previewUrl} style={{width:'300px', height:'300px'}} />
              </div>

            </Modal>
      </div>

  );

};

function mapSateToProps({ vdcore }) {
  return { vdcore };
}

export default connect(mapSateToProps)(SaveAsTemplate);
