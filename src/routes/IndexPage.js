import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

import {Row, Col} from 'antd';

import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import DevPanel from '../components/DevPanel';

import CodingEditor from '../components/Panel/Editor.js';
import Terminal from '../components/Panel/Terminal.js';

import SplitPane from 'react-split-pane';

function IndexPage(props) {

  const leftSidebarProps = {

    handleClick(activeMenu) {
      console.log(activeMenu);

      var handleActiveMenuEvent = {

        create() {
          props.dispatch({
            type: 'sidebar/showModalNewApp'
          });
        },

        'switch'() {
          props.dispatch({
            type: 'sidebar/showModalSwitchApp'
          });
        },

        commit() {

        },

        'push'() {

        },

        pull() {

        },

        terminal() {

          var title = '终端',
              content = <Terminal></Terminal>,
              type = 'terminal';

          props.dispatch({
            type: 'devpanel/add',
            payload: {title, content, type}
          })

        },

        file() {

          var title = '新文件',
              content = <CodingEditor></CodingEditor>,
              type = 'editor';

          props.dispatch({
            type: 'devpanel/add',
            payload: {title, content, type}
          });

        },

        start() {

        },

        pause() {

        }

      }

      handleActiveMenuEvent[activeMenu.key]();
    },

    cancelNewApp() {
      props.dispatch({
        type: 'sidebar/hideModalNewApp'
      })
    },

    createApp() {
      props.dispatch({
        type: 'sidebar/createApp'
      })
    },

    cancelSwitchApp() {
      props.dispatch({
        type: 'sidebar/hideModalSwitchApp'
      });
    },

    switchApp() {
      props.dispatch({
        type: 'sidebar/switchApp'
      })
    },

    modalNewAppVisible: props.sidebar.modalNewAppVisible,
    modalSwitchAppVisible: props.sidebar.modalSwitchAppVisible 
  };

  const devPanelProps = {
    panes: props.devpanel.panes,
    activeKey: props.devpanel.activeKey,
    splitType: props.devpanel.splitType,

    onChange(active) {
      props.dispatch({
        type: 'devpanel/tabChanged',
        payload: active
      });
    },

    onEdit(targetKey, action) {

      var content = '', title = undefined, type = "editor";

      if(action == 'add') {
        content = <CodingEditor></CodingEditor>;

        console.log(content);
      }

      props.dispatch({
        type: 'devpanel/' + action,
        payload: {targetKey, title, content, type}
      })
    }
  }

  var devPanelMinSize = document.body.clientWidth;
  devPanelMinSize = devPanelMinSize * 0.833333333;

  return (
    <div className="body">
      <SplitPane split="vertical" minSize={46} maxSize={46}>
          <div className="LeftSidebar">
            <LeftSidebar {...leftSidebarProps}></LeftSidebar>
          </div>
          <SplitPane split="vertical" defaultSize={devPanelMinSize}>
              <div className={styles.devbar}>
                <DevPanel {...devPanelProps}></DevPanel>
              </div>
              <RightSidebar></RightSidebar>
          </SplitPane>
      </SplitPane>
    </div>
  );
}

IndexPage.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  sidebar: PropTypes.object,
  devPanel: PropTypes.object
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ sidebar, devpanel}) {
  return {sidebar, devpanel};
}

export default connect(mapStateToProps)(IndexPage);
