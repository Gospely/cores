import initState from './initUIState'

const initData = function (props, application, layout) {

    const initDataOperate = {
        'common': function(){
            initState(props, application);
        },
        'vd': function(){
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
            props.dispatch({
                type: 'vdassets/getInitialData',
            });
            props.dispatch({
                type: 'vdanimations/getInitialData',
            });
            if(!layout){
                props.dispatch({
                    type: 'UIState/initConfig',
                    payload: {
                        id: application
                    }
                })
            }
        }
    };

    if(initDataOperate[localStorage.image.split(':')[0]]){
        initDataOperate[localStorage.image.split(':')[0]]();
    }else {
        initDataOperate.common();
    }
}

export default initData;
