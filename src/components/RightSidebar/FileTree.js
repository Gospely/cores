import React , {PropTypes} from 'react';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

const ConstructionTree = () => {

	var onSelect = function () {

	}

	var onCheck = function() {

	}

  return (

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

  );

};

export default ConstructionTree;
