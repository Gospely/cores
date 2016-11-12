import React , {PropTypes} from 'react';
import { Tree, Button, Icon, Tooltip, Row, Col} from 'antd';
import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

const TreeNode = Tree.TreeNode;

const ButtonGroup = Button.Group;

const ConstructionTree = () => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}

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

      <Tree className="myCls" showLine defaultExpandAll
        onSelect={onSelect} onCheck={onCheck}
      >
      
        <TreeNode title=".git" key="0-0">
          <TreeNode title="branches" key="0-0-0">
        <TreeNode title="hook" key="0-0-0-0" />
            <TreeNode title="objects" key="0-0-0-1" />
          </TreeNode>
            <TreeNode title="index.php" key="0-0-1">
              <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
            </TreeNode>
        </TreeNode>

      </Tree>

    </div>

  );

};

export default ConstructionTree;
