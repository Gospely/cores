import React , {PropTypes} from 'react';
import { Tree, Button, Icon, Tooltip, Row, Col } from 'antd';
import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

import { connect } from 'dva';

const TreeNode = Tree.TreeNode;

const ButtonGroup = Button.Group;

const FileTree = (props) => {

  console.log(props);

  var onLoadData = function(treeNode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const treeData = [...treeData];
        getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
        this.setState({ treeData });
        resolve();
      }, 1000);
    });
  }

  function generateTreeNodes(treeNode) {
    const arr = [];
    const key = treeNode.props.eventKey;
    for (let i = 0; i < 3; i++) {
      arr.push({ name: `leaf ${key}-${i}`, key: `${key}-${i}` });
    }
    return arr;
  }

  const FileTreeProps = {
    treeData: props.file.treeData,

    onSelect: function(e) {
      console.log(e);
    },

    onCheck: function() {

    },

    onLoadData: function(treeNode) {
      props.dispatch({
        type: 'file/fetchFileNode',
        payload: treeNode
      })
    }
  }

  const loopData = data => data.map((item) => {
    if (item.children) {
      return <TreeNode title={item.name} key={item.key}>{loopData(item.children)}</TreeNode>;
    }
    return <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} disabled={item.key === 'root'} />;
  });

  const treeNodes = loopData(FileTreeProps.treeData);

  return (

    <div className={TreeStyle.wrapper}>

      <div className={TreeStyle.header}>

        <Row>
          <Col span={6}>
            <Tooltip placement="bottom" title="新建文件">
              <Button className={EditorStyle.topbarBtnColumn}><Icon type="file-text" /></Button>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Tooltip placement="bottom" title="新建文件夹">
              <Button className={EditorStyle.topbarBtnColumn}><Icon type="folder" /></Button>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Tooltip placement="bottom" title="上传文件">
              <Button className={EditorStyle.topbarBtnColumn}><Icon type="cloud-upload-o" /></Button>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Tooltip placement="bottom" title="搜索文件">
              <Button className={EditorStyle.topbarBtnColumn}><Icon type="search" /></Button>
            </Tooltip>
          </Col>
        </Row>
      </div>

      <Tree className="myCls" showLine
        onSelect={FileTreeProps.onSelect}
        onCheck={FileTreeProps.onCheck}
        loadData={FileTreeProps.onLoadData}
      >
        {treeNodes}
      </Tree>

    </div>

  );

};

function mapStateToProps({ file }) {
  return { file };
}


export default connect(mapStateToProps)(FileTree);
