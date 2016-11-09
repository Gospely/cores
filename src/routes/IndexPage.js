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

        },

        commit() {

        },

        'push'() {

        },

        pull() {

        },

        file() {

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

    modalNewAppVisible: props.sidebar.modalNewAppVisible
  };

  return (
    <div className="body">
      <div className={styles.sidebar}>
        <LeftSidebar {...leftSidebarProps}></LeftSidebar>
      </div>
      <div className={styles.rightPanel}>
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <div className={styles.devbar}>
                <DevPanel></DevPanel>
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
  sidebar: PropTypes.object
};

// 指定订阅数据，这里关联了 indexPage
function mapStateToProps({ sidebar }) {
  return {sidebar};
}

export default connect(mapStateToProps)(IndexPage);
