const initState = function (props, applicationId) {

    var UIState = JSON.parse(localStorage.UIState);
    const initStateOperate = {
        'common': function(){
            props.dispatch({
                type: 'sidebar/setActiveMenu',
                payload: 'file'
            });
            props.dispatch({
              type: 'devpanel/getConfig',
              payload: { id : applicationId, UIState: UIState.UIState.devpanel}
            });

            props.dispatch({
                type: 'devpanel/initPanel'
            });

            if (!props.sidebar.appCreatingForm.fromGit) {
                props.dispatch({
                    type: 'file/fetchFileList'
                });
            }
            props.dispatch({
                type: 'file/initFiles',
            });
        },
        'vd': function(){

            props.dispatch({
                type: 'vdpm/initState',
                payload: { UIState: UIState.UIState.vdpm }
            });
            console.log('vdCtrlTree/initState');
            console.log('vdstyles/initState');
            props.dispatch({
                type: 'vdstyles/initState',
                payload: { UIState: UIState.UIState.vdstyles }
            });
            props.dispatch({
                type: 'vdCtrlTree/initState',
                payload: { UIState: UIState.UIState.vdCtrlTree }
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
            props.dispatch({
                type: 'sidebar/setActiveMenu',
                payload: 'vdsite-controllers'
            });
        }
    };


    if(initStateOperate[localStorage.image.split(':')[0]]){
        initStateOperate[localStorage.image.split(':')[0]]();
    }else {
        initStateOperate.common();
    }
    if(UIState.UIState.previewer && UIState.UIState.previewer.loaded){
        props.dispatch({
            type: 'rightbar/setActiveMenu',
            payload: 'common-previewer'
        });
        props.dispatch({
            type: 'index/toggleCommonPreviewer'
        });
        props.dispatch({
            type: 'cpre/initState',
            payload: { UIState: UIState.UIState.previewer }
        });
    }
    setTimeout(function(){
        localStorage.flashState = true;
    }, 1000)
}

export default initState;
