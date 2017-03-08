import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';
import { Row, Col, Spin, Alert, message } from 'antd';

import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import DevPanel from '../components/DevPanel';
import Topbar from '../components/TopBar';

import CodingEditor from '../components/Panel/Editor.js';

import SplitPane from 'react-split-pane';
import randomString from '../utils/randomString';

import VDDesignerPanel from '../components/VDSite/VDDesignerPanel.js';
import VDRightPanel from '../components/VDSite/VDRightPanel/index.js';

function IndexPage(props) {

    //判断是否打开了项目
    if (location.hash.split('/')[1] !== 'project') {
        window.disabled = true;
    }else {
        window.disabled = false;
    }

    if (props.query == '?from=dash') {
        window.reload = true;
    }

    if (props.params.id == localStorage.applicationId) {
        window.reload = false;
    } else {
        window.reload = true;
    }

    window.applicationId = props.params.id;
    const devPanelProps = {
        panes: props.devpanel.panels.panes,

        splitType: props.devpanel.panels.splitType,

        panels: props.devpanel.panels,

        onChangePane(key) {
            props.dispatch({
                type: 'devpanel/changePane',
                payload: key
            });
        },

        onChange(paneKey, active) {
            const activePane = props.devpanel.panels.panes[paneKey.paneKey];
            const activeTab = activePane.tabs[active - 1]
            localStorage.currentSelectedFile = activeTab.title;
            var file = activeTab.title;
            var suffix = 'js';

            if(!window.isWeapp) {

                if (file != undefined && file != '新文件'　 && file != '新标签页') {
                    file = file.split('.');
                    suffix = file[file.length - 1];
                    if (suffix != undefined) {
                        localStorage.suffix = suffix;
                    }
                    props.dispatch({
                        type: 'devpanel/dynamicChangeSyntax',
                        payload: { suffix }
                    });
                    if (activePane.activeEditor.id != null && activePane.activeEditor.id != '' && activePane.editors[activeTab.editorId] != null) {
                        if (activePane.editors[activeTab.editorId].value == null || activePane.editors[activeTab.editorId].value == '') {
                            props.dispatch({
                                type: 'devpanel/loadContent',
                                payload: {
                                    editorId: activeTab.editorId,
                                    paneKey: paneKey,
                                    tab: activeTab
                                }
                            });
                        }
                    }
                }

            }

            props.dispatch({
                type: 'devpanel/tabChanged',
                payload: {
                    active: active,
                    paneKey: paneKey.paneKey
                }
            });
        },

        onEdit(paneKey, targetKey, action) {

            if(location.hash.indexOf('project') == -1) {
                message.success('您还未打开任何项目，请先创建一个吧 :)');
                props.dispatch({
                    type: 'sidebar/showModalNewApp'
                });
                return false;
            }

            var content = '',
                title = undefined,
                type = "editor";
            let editorId = randomString(8, 10);

            var removeAction = { targetKey, title, content, type, editorId, paneKey: paneKey.paneKey };

            if (action == 'add') {
                localStorage.currentSelectedFile = '新标签页';
                props.dispatch({
                    type: 'sidebar/setActiveMenu',
                    payload: 'file'
                });
                props.dispatch({
                    type: 'devpanel/' + action,
                    payload: removeAction
                });
                // 更换默认语法
                localStorage.suffix = "js";
                // localStorage.isSave = true;
            }

            localStorage.currentFileOperation = action;

            if (action == 'remove') {
                console.log("remove");
                localStorage.removeAction = JSON.stringify(removeAction);
                editorId = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].activeEditor.id;
                let currentTab = props.devpanel.panels.panes[paneKey.paneKey].tabs[targetKey - 1];
                let tabType = currentTab.type;

                if(currentTab.title == 'git pull'){
                    window.pullTerminal = null;
                }
                if(currentTab.title == 'git push'){
                    window.pushTerminal = null;
                }
                if(currentTab.title == 'git commit'){
                    window.commitTerminal = null;
                }
                if (tabType != 'editor') {

                    if (tabType == 'terminal') {
                        props.dispatch({
                            type: 'devpanel/killPID',
                            payload: { pid: currentTab.editorId }
                        });
                    }
                    props.dispatch({
                        type: 'devpanel/' + action,
                        payload: removeAction
                    });

                    if (tabType == 'designer') {
                        props.dispatch({
                            type: 'designer/handleDesignerClosed'
                        })
                    }
                    return false;
                }

                var fileName = localStorage.currentSelectedFile;

                if (!currentTab.isSave) {

                    var name = 'file';
                    props.dispatch({
                        type: 'sidebar/handleTabChanged',
                        payload: name
                    });
                    if (fileName == '新标签页' || fileName == '新文件' || fileName == undefined) {
                        props.dispatch({
                            type: 'file/showNewFileNameModal',
                            payload: { targetKey, action, type }
                        })
                    } else {
                        props.dispatch({
                            type: 'file/showSaveModal',
                            payload: { targetKey, action, type }
                        })
                    }
                } else {
                    props.dispatch({
                        type: 'devpanel/' + action,
                        payload: removeAction
                    })
                }
            }

        }

    }

    var devPanelMinSize = document.body.clientWidth,
        leftBarWidth = 280,
        rightBarWidth = 480;

    devPanelMinSize = devPanelMinSize - (rightBarWidth + leftBarWidth);

    var devPanelTemplate = '';

    const onDevpanelSplitPaneDragFinished = (a, b) => {

    }

    var devPanelLayoutComponent = () => {

        const generateDefaultDevpanelTpl = (isPreviewer) => {
            return (
                <SplitPane split = "vertical" defaultSize = { devPanelMinSize }>
                    <div id="devbar" className = { styles.devbar } >
                        <DevPanel {...devPanelProps } props = { props }></DevPanel>
                    </div>
                    <RightSidebar previewer={isPreviewer}></RightSidebar>
                </SplitPane>
            );
        }

        var layoutAction = {

            shell: function() {
                return <DevPanel {...devPanelProps } props = { props }></DevPanel>;
            },

            commonA: function() {
                return generateDefaultDevpanelTpl();
            },

            common: function() {
                return <DevPanel {...devPanelProps } props = { props }></DevPanel>;
            },

            ha: function() {
                return generateDefaultDevpanelTpl();
            },

            previewer: function() {
                return generateDefaultDevpanelTpl(true);
            },

            noPreviewer: function() {
                return <DevPanel {...devPanelProps } props = { props }></DevPanel>;
            }

        }

        if(window.isWeapp) {
            return layoutAction['commonA']();
        }

        if(localStorage.image == 'vd:site') {
            return <VDDesignerPanel></VDDesignerPanel>;
        }

        if(props.index.debugType == '') {
            props.index.debugType = 'noPreviewer';
        }

        return layoutAction[props.index.debugType]();

    }

    if(window.disabled) {
        var welcomePageWidth = document.body.clientWidth;
        devPanelTemplate = (
            <SplitPane split = "vertical" minSize = { welcomePageWidth } defaultSize = { welcomePageWidth } >
                <div id="devbar" className = { styles.devbar } >
                    <DevPanel {...devPanelProps } props = { props }></DevPanel>
                </div>
                <div></div>
            </SplitPane>
        );
    }else {
        if (localStorage.image === 'vd:site') {
            devPanelTemplate = (
                <div style={{display: 'flex', height: '100%', position: 'relative'}}>
                    <div className = "LeftSidebar vdsite" >
                        <LeftSidebar></LeftSidebar>
                    </div>
                    {devPanelLayoutComponent()}
                </div>
            );
        }else {
            devPanelTemplate = (
                <SplitPane split = "vertical" minSize = { 1 } defaultSize = { leftBarWidth } >
                    <div className = "LeftSidebar" >
                        <LeftSidebar></LeftSidebar>
                    </div>
                    {devPanelLayoutComponent()}
                </SplitPane>
            );
        }
        
    }

    if (localStorage.image === 'vd:site') {
        let vdsiteCtrlBtn = $("#vdsiteCtrlBtn");
        let vdsitePagesBtn = $("#vdsitePagesBtn");
        if (vdsitePagesBtn.length && vdsitePagesBtn.length) {
            let showPanel = (elem) => {
                let btn = elem.parent();
                btn.on('click', function (e) {
                    // e.stopPropagation();
                    let panel = $(".LeftSidebar.vdsite>.ant-tabs>.ant-tabs-content");
                    if(parseInt(panel.css("width")) < 260) {
                        panel.css({
                            width: '270px'
                        })
                    }else if (btn.attr('aria-selected') === 'true'){
                        panel.css({
                            width: '0px'
                        })
                    }
                    
                })
            }
            showPanel(vdsiteCtrlBtn);
            showPanel(vdsitePagesBtn);
        }
    }

    const wholePageLayoutGenerator = () => {

        var wholePageLayout = '',
            tpl = (
                <div className="table-ftw" style = {{ paddingBottom: '0px', height: '100vh' }}>
                    <div className="tr-ftw">
                        <div className = "td-ftw" style = {{ height: '38px' }}>
                            <Topbar></Topbar>
                        </div>
                    </div>
                    <div className = "tr-ftw" >
                        <div className = "td-ftw" >
                            {devPanelTemplate}
                        </div>
                    </div>
                </div>
            );

        wholePageLayout = tpl;

        if(localStorage.image == 'vd:site') {

            wholePageLayout = (
                <Row>
                    <Col span={19}>
                    {tpl}  
                    </Col>
                    <Col span={5}>
                        <VDRightPanel></VDRightPanel>
                    </Col>
                </Row>
            );
        }

        return wholePageLayout;
    }

    return (
            <Spin tip={props.devpanel.loading.tips} spinning={props.devpanel.loading.isLoading}>
                <div className = "body" style={{height: '100vh'}}>
                    <div
                        hidden='true'
                        id="git-terminal"></div>
                    <div id="git-show"></div>
                    {wholePageLayoutGenerator()}
                </div>
            </Spin>
    );
}

IndexPage.propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    sidebar: PropTypes.object,
    devPanel: PropTypes.object
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ index, sidebar, devpanel, editorTop, file, rightbar, UIState }) {
    return { index, sidebar, devpanel, editorTop, file, rightbar, UIState };
}

export default connect(mapStateToProps)(IndexPage);
