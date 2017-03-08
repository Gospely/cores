import React, { PropTypes } from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';

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

                window.VDDesignerFrame.postMessage({
                    pageSelected: props.vdCtrlTree.layout[props.vdCtrlTree.activePage.key]
                }, '*');
                //加载全局CSS
                props.dispatch({
                    type: 'vdstyles/applyCSSStyleIntoPage',
                    payload: {
                        activeCtrl: props.vdCtrlTree.activeCtrl
                    }
                });

            }, 500);
            $(window).off("keyup");
            $(window).on("keyup", {props}, function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (e.keyCode === 46) {
                    e.data.props.dispatch({
                        type: 'vdCtrlTree/deleteCtrl',
                        payload: {
                            fromKeyboard: true
                        }
                    })
                }
            })

        },

    };

    return ( <div className = "designer-wrapper" style = {{ height: '100%' }}>
            <iframe className = "centen-VD"
                name = "vdsite-designer"
                width = { props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].width }
                height = { props.vdcore.VDDesigner[props.vdcore.VDDesigner.activeSize].height }
                frameBorder = "0"
                src = "static/designer/vdsite/index.html"
                onLoad = { VDDesignerPanelProps.handleDesPanelLoaded }
            >
            </iframe>
        </div>
    );

};

function mapSateToProps({ vdCtrlTree, vdcore }) {
    return { vdCtrlTree, vdcore };
}

export default connect(mapSateToProps)(VDDesignerPanel);
