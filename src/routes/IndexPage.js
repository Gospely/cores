import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

import {Row, Col} from 'antd';

import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import DevPanel from '../components/DevPanel';

function IndexPage({ location, dispatch, sidebar }) {

  const leftSidebarProps = {

    handleClick(key) {
      console.log(key);
      dispatch({
        type: 'sidebar/showModalNewApp'
      });
    },

    cancelNewApp() {
      dispatch({
        type: 'sidebar/hideModalNewApp'
      })
    },

    createApp() {
      dispatch({
        type: 'sidebar/createApp'
      })
    },

    modalNewAppVisible: sidebar.modalNewAppVisible
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
