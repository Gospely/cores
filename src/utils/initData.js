const initState = function (props) {

    const initDataOperate = {
        'common': function(){

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

export default initState;
