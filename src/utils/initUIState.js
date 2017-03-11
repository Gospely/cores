
const initState = function (props, applicationId) {

    var UIState = JSON.parse(localStorage.UIState);
    props.dispatch({
        type: 'sidebar/initState',
        payload: { UIState: UIState.UIState.sidebar }
    });
    props.dispatch({
        type: 'rightbar/initState',
        payload: { UIState: UIState.UIState.rightbar }
    });
    props.dispatch({
        type: 'vdpm/initState',
        payload: { UIState: UIState.UIState.vdpm }
    });
    console.log(UIState.UIState);
    props.dispatch({
        type: 'vdstyles/initState',
        payload: { UIState: UIState.UIState.vdstyles }
    });
    props.dispatch({
        type: 'vdCtrlTree/initState',
        payload: { UIState: UIState.UIState.vdCtrlTree }
    });
    props.dispatch({
        type: 'vdcore/initState',
        payload: { UIState: UIState.UIState.vdcore }
    });
    props.dispatch({
        type: 'vdanimations/initState',
        payload: { UIState: UIState.UIState.vdanimations }
    });

    props.dispatch({
      type: 'devpanel/getConfig',
      payload: { id : applicationId, UIState: UIState.UIState.devpanel}
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
    }else {
        props.dispatch({
            type: 'sidebar/setActiveMenu',
            payload: 'vdsite-controllers'
        });
    }
    props.dispatch({
        type: 'UIState/setDySaveEffects'
    });
}

export default initState;
