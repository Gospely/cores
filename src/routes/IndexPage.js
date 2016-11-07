import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

// import TopBar from '../components/TopBar';
// import Panels from '../components/Panels';

function IndexPage() {
  return (
    <div className="body">
      // <TopBar>
      // </TopBar>
      // <Panels>
      // </Panels>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
