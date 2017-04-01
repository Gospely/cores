import React, { PropTypes } from 'react';
import { connect } from 'dva';

import { Button, Modal, Spin } from 'antd';

const VDDesignerPanel = (props) => {

    const VDDesignerPanelProps = {

        hide() {
            props.dispatch({
                type: 'dashboard/hideDash'
            });
        },

        handleDesPanelLoaded() {
            window.VDDesignerFrame = window.frames["vdsite-designer"];
            setTimeout(function() {
                VDDesignerFrame.postMessage({
                    VDDesignerLoaded: {
                        load: true
                    }
                }, '*');


                setTimeout(function(){
                    window.VDDesignerFrame.postMessage({
                        pageSelected: props.vdCtrlTree.layout[props.vdCtrlTree.activePage.key]
                    }, '*');
                }, 2500);

                //加载全局CSS
                props.dispatch({
                    type: 'vdstyles/applyCSSStyleIntoPage',
                    payload: {
                        activeCtrl: props.vdCtrlTree.activeCtrl
                    }
                });


                // window.VDDesignerFrame.postMessage({
    	    	// 	pageSelected: props.vdCtrlTre.layout[props.vdCtrlTre.activePage.key]
    	    	// }, '*');
                //加载动画js
                setTimeout(function(){
                    props.dispatch({
                        type: 'vdanimations/applyScriptIntoPage'
                    });

                    props.vdCtrlTree.activeCtrl.vdid && window.VDDesignerFrame.postMessage({
                        VDCtrlSelected: {
                            vdid: props.vdCtrlTree.activeCtrl.vdid,
                            isFromCtrlTree: true
                        }
                    }, '*');
                }, 2600);


                //绑定按键

                // $(window).off("keyup");
                // $(window).on("keyup", {props}, function (e) {
                //     e.stopPropagation();
                //     e.preventDefault();
                //     // console.log(e.keyCode, e.ctrlKey, e.shiftKey, e.altKey, e.commandKey)
                //     if (e.keyCode === 46) {
                //         e.data.props.dispatch({
                //             type: 'vdCtrlTree/deleteCtrl',
                //             payload: {
                //                 fromKeyboard: true
                //             }
                //         })
                //     }
                // })

            }, 500);


        },
    };

    const vdsiteDesignerBorderStyle = {
        height: props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].height,
        width: props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].width,
        transform: 'translate(-50%, 0%)',
        marginBottom: 0
    }

    vdsiteDesignerBorderStyle.transform = props.vdcore.VDDesigner.activeSize == 'pc' ? 'translate(-50%, 0%)' : 'translate(-50%, 15%)';

    vdsiteDesignerBorderStyle.marginBottom = props.vdcore.VDDesigner.activeSize == 'pc' ? 0 : '15%';

    return ( <div className = "designer-wrapper"
                  style = {{ height: '100%', overflow: 'auto' }}
                  id = "designer-wrapper"
             >
                <Spin spinning={props.vdcore.loading} style={{ height: 100, top: 'calc(100% - 50px)' }}>
                    <div className="vdsite-designer-border"
                        style={vdsiteDesignerBorderStyle}>
                        <iframe className="centen-VD"
                            name="vdsite-designer"
                            width={props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].width}
                            height={props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].height}
                            frameBorder="0"
                            src="static/designer/vdsite/index.html"
                            onLoad={ VDDesignerPanelProps.handleDesPanelLoaded }
                        >
                        </iframe>
                    </div>
                    <div id="closeVDLeftPanel" className='close-VD-left-panel'></div>
                </Spin>
            </div>
    );

};

function mapSateToProps({ vdCtrlTree, vdcore, vdanimations }) {
    return { vdCtrlTree, vdcore, vdanimations };
}

export default connect(mapSateToProps)(VDDesignerPanel);
