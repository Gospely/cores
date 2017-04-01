import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal, Input, Select, Switch } from 'antd';

const TemplateSaving = (props) => {

      const TemplateTypeList = props.vdcore.TemplateType.map(function(item,index){
                              return (
                                        <Option value={item}>{item}</Option>
                                    )
                                })
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
    },
    onChangeFree(){
      props.dispatch({
          type: 'vdcore/changeTemplateIsFree',
      })
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
                <p>模板名称 :</p>
                <Input placeholder="输入模板名称" onChange={TemplateSavingProps.onChange} value={props.vdcore.TemplateSavingModal.name} />
                <p  style={{marginTop: '20px'}} >模板描述 :</p>
                <Input type="textarea" placeholder="输入模板描述"/>
                <p className="template-sort-select-input-label">模板分类:</p>
                <Select style={{width: '25%', marginRight: '15%'}}>
                    {TemplateTypeList}
                </Select>
                <p className="template-sort-select-input-label">是否免费:</p>
                <Switch defaultChecked={props.vdcore.TemplateSavingModal.isFree} onChange={TemplateSavingProps.onChangeFree} style={{marginRight: '15%'}}/>
                { props.vdcore.TemplateSavingModal.isFree ? <p className="template-sort-select-input-label"> 模板价格:</p> : <p></p>}
                { props.vdcore.TemplateSavingModal.isFree ? <Input placeholder="输入模板价格"  style={{width:'30%', display: "inline-block"}} /> : <div></div>} 
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
