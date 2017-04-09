const initState = function (props, applicationId, layout) {

    var UIState = JSON.parse(localStorage.UIState);
    if(layout){
        UIState = layout;
    }
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

            localStorage.create = 'false';
            localStorage.createPage = 'false';
            props.dispatch({
                type: 'sidebar/setActiveMenu',
                payload: 'vdsite-controllers'
            });

            props.dispatch({
                type: 'vdstyles/applyCSSStyleIntoPage',
                payload: {
                    activeCtrl: props.vdCtrlTree.activeCtrl
                }
            });

            if(window.frames["vdsite-designer"]){
                window.frames["vdsite-designer"].location.reload();
            }
            setTimeout(function(){
                props.dispatch({
                    type: 'vdcore/handleLoading',
                    payload: false
                });
            }, 3000)

            if(layout){
                props.dispatch({
                    type: 'UIState/initConfig',
                    payload: {
                        id: applicationId
                    }
                })
            }
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
