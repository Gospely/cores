import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

import {Row, Col} from 'antd';

import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import DevPanel from '../components/DevPanel';

function IndexPage() {
  return (
    <div className="body">
      <div className={styles.sidebar}>
        <LeftSidebar></LeftSidebar>
      </div>
      <div className={styles.rightPanel}>
          <Row type="flex" justify="space-between">
            <Col span={19}>
              <div className={styles.devbar}>
                <DevPanel></DevPanel>
              </div>
            </Col>
            <Col span={4} offset={19}>
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
};

export default connect()(IndexPage);
