import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './IndexPage.css';

import {Row, Col} from 'antd';

import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import DevPanel from '../components/DevPanel';

import SplitPane from 'react-split-pane';

function IndexPage(props) {

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
            <LeftSidebar></LeftSidebar>
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
