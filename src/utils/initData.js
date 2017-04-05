import initState from './initUIState'

const initData = function (props, application) {

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
