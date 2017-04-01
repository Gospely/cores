import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Spin, Button, Modal, Input, Select, Switch } from 'antd';

const TemplateSaving = (props) => {

      const TemplateTypeList = props.vdcore.TemplateType.map(function(item,index){
                              return (
                                        <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
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
              confirmLoading:true,
              type: props.vdcore.TemplateType
          }
      })
      props.dispatch({
        type: 'vdcore/TemplateSaving',
      })

  },
    onChange(s,e){

        console.log(e);
        console.log(s);
        var value = e.target ? e.target.value: e;
        props.dispatch({
            type: 'vdcore/changeTemplateSavingState',
            payload: {
                value : value,
                target: s
            }
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
              <Spin spinning={props.vdcore.templateLoading}>
              <div>
                <p>模板名称 :</p>
                <Input placeholder="输入模板名称" onChange={TemplateSavingProps.onChange.bind(this,'name')} value={props.vdcore.TemplateSavingModal.name} />
                <p  style={{marginTop: '20px'}} >模板描述 :</p>
                <Input type="textarea" placeholder="输入模板描述" onChange={TemplateSavingProps.onChange.bind(this,'description')} value={props.vdcore.TemplateSavingModal.description}/>
                <p className="template-sort-select-input-label">模板分类:</p>
                <Select style={{width: '25%', marginRight: '15%'}} onSelect={TemplateSavingProps.onChange.bind(this,'type')}>
                    {TemplateTypeList}
                </Select>
                <p className="template-sort-select-input-label">是否免费:</p>
                <Switch defaultChecked={!props.vdcore.TemplateSavingModal.isFree} onChange={TemplateSavingProps.onChangeFree} style={{marginRight: '15%'}}/>
                { props.vdcore.TemplateSavingModal.isFree ? <p className="template-sort-select-input-label"> 模板价格:</p> : <p></p>}
                { props.vdcore.TemplateSavingModal.isFree ? <Input placeholder="输入模板价格" onChange={TemplateSavingProps.onChange.bind(this,'price')} value={props.vdcore.TemplateSavingModal.price}  style={{width:'30%', display: "inline-block"}} /> : <div></div>}
                <img src={props.vdcore.TemplateSavingModal.previewUrl} style={{width:'100%', height:'300px', marginTop: '20px'}} />
              </div>
              </Spin>
            </Modal>
      </div>

  );

};

function mapSateToProps({ vdcore }) {
  return { vdcore };
}

export default connect(mapSateToProps)(TemplateSaving);
