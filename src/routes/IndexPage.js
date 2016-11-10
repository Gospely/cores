import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

import {Row, Col} from 'antd';

import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import DevPanel from '../components/DevPanel';

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

    onChange(active) {
      props.dispatch({
        type: 'devpanel/tabChanged',
        payload: active
      });
    },

    onEdit(targetKey, action) {
      props.dispatch({
        type: 'devpanel/' + action,
        payload: {targetKey, action}
      })
    }
  }

  return (
    <div className="body">
      <div className={styles.sidebar}>
        <LeftSidebar {...leftSidebarProps}></LeftSidebar>
      </div>
      <div className={styles.rightPanel}>
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <div className={styles.devbar}>
                <DevPanel {...devPanelProps}></DevPanel>
              </div>
            </Col>
            <Col span={4}>
              <div className={styles.rightbar}>
                <RightSidebar></RightSidebar>
              </div>
            </Col>
          </Row>
      </div>
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
