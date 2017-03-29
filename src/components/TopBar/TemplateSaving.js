import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal, Input } from 'antd';

const TemplateSaving = (props) => {

  const TemplateSavingProps = {

    hide () {
      props.dispatch({
        type: 'vdcore/changeTemplateSavingVisible',
        payload: {
              visible:false,
              confirmLoading:false
          }
      });
    },

    handleOk () {
      props.dispatch({
        type: 'vdcore/changeTemplateSavingVisible',
        payload: {
              visible:true,
              confirmLoading:true
          }
      })
      props.dispatch({
        type: 'vdcore/TemplateSaving',
      })

  },
    onChange(e){

        props.dispatch({
            type: 'vdcore/changeTemplateSavingState',
            payload: e.target.value
        });
    }
  };

  return (

      <div>
            <Modal
              title="发布到商城"
              visible={props.vdcore.TemplateSavingModal.visible}
              wrapClassName="TemplateSaving-wrapper"
              onOk={TemplateSavingProps.handleOk}
              onCancel={TemplateSavingProps.hide}
              okText="保存"
              confirmLoading={props.vdcore.TemplateSavingModal.confirmLoading}
            >
              <div>
                <p>项目名称 :</p>
                <Input placeholder="输入项目名称" onChange={TemplateSavingProps.onChange} value={props.vdcore.TemplateSavingModal.name} />
                <p  style={{marginTop: '20px'}} >项目描述 :</p>
                <Input type="textarea" placeholder="输入项目描述"/>
                <img src={props.vdcore.TemplateSavingModal.previewUrl} style={{width:'100%', height:'300px', marginTop: '20px'}} />
              </div>
            </Modal>
      </div>

  );

};

function mapSateToProps({ vdcore }) {
  return { vdcore };
}

export default connect(mapSateToProps)(TemplateSaving);
