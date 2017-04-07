import initState from './initUIState'

const initData = function (props, application, layout) {

    const initDataOperate = {
        'common': function(){
            initState(props, application);
        },
        'vd': function(){
            console.log('vd');
            props.dispatch({
                type: 'vdpm/getInitialData',
            });
            props.dispatch({
                type: 'vdCtrlTree/getInitialData',
            });
            props.dispatch({
                type: 'vdstyles/getInitialData',
            });
            props.dispatch({
                type: 'vdcore/getInitialData',
            });
            if(layout){
                console.log(layout);
                var UIState = JSON.parse(localStorage.UIState);
                UIState.applicationId = application.id;
                UIState.UIState.vdCtrlTree.layout = layout;
                console.log(UIState);
                localStorage.UIState = JSON.stringify(UIState);
                props.dispatch({
                    type: 'UIState/initConfig',
                    payload: {
                        id: application.id
                    }
                })
            }
        }
    };

    console.log('initData');
    if(initDataOperate[localStorage.image.split(':')[0]]){
        initDataOperate[localStorage.image.split(':')[0]]();
    }else {
        initDataOperate.common();
    }
}

export default initData;
