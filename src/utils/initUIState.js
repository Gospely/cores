const initState = function (props, applicationId) {

    const initStateOperate = {
        'common':{
            before: function(props, applicationId){

            },
            middle: function(props, applicationId){

            },
            after: function(props, applicationId){

            }
        },
        'shell':{
            before: function(props, applicationId){

            },
            middle: function(props, applicationId){

            },
            after: function(props, applicationId){

            }
        },
        'ha':{
            before: function(props, applicationId){

            },
            middle: function(props, applicationId){

            },
            after: function(props, applicationId){

            }
        },
    }

    var UIState = JSON.parse(localStorage.UIState);


    props.dispatch({
        type: 'vdpm/initState',
        payload: { UIState: UIState.UIState.vdpm }
    });
    console.log('vdCtrlTree/initState');
    props.dispatch({
        type: 'vdCtrlTree/initState',
        payload: { UIState: UIState.UIState.vdCtrlTree }
    });
    console.log('vdstyles/initState');
    props.dispatch({
        type: 'vdstyles/initState',
        payload: { UIState: UIState.UIState.vdstyles }
    });
    console.log('vdcore/initState');
    props.dispatch({
        type: 'vdcore/initState',
        payload: { UIState: UIState.UIState.vdcore }
    });
    props.dispatch({
        type: 'vdanimations/initState',
        payload: { UIState: UIState.UIState.vdanimations }
    });

    localStorage.create = 'false';
    localStorage.createPage = 'false';

    if(UIState.UIState.previewer.loaded){
        props.dispatch({
            type: 'rightbar/setActiveMenu',
            payload: 'common-previewer'
        });
        props.dispatch({
            type: 'index/toggleCommonPreviewer'
        });
    }
    props.dispatch({
        type: 'cpre/initState',
        payload: { UIState: UIState.UIState.previewer }
    });

    if(localStorage.image != 'vd:site') {
        props.dispatch({
            type: 'sidebar/setActiveMenu',
            payload: 'file'
        });
        props.dispatch({
          type: 'devpanel/getConfig',
          payload: { id : applicationId, UIState: UIState.UIState.devpanel}
        });
    }else {
        props.dispatch({
            type: 'sidebar/setActiveMenu',
            payload: 'vdsite-controllers'
        });
    }
    props.dispatch({
        type: 'UIState/setDySaveEffects'
    });
    localStorage.flashState = true;
}

export default initState;
