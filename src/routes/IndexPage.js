import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

import {Row, Col} from 'antd';

import TopBar from '../components/TopBar';
import Panels from '../components/Panels';

function IndexPage() {
  return (
    <div className="body">
      <div className={styles.sidebar}>
        <TopBar></TopBar>
      </div>
      <div className={styles.rightPanel}>
          <Row type="flex" justify="space-between">
            <Col span={4} offset={16}>
              <Panels></Panels>
            </Col>
          </Row>        
      </div>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
