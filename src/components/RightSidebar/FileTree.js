import React , { PropTypes } from 'react';
import { Tree, Button, Icon, Tooltip, Row, Col, Popover, Input} from 'antd';
import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

import { connect } from 'dva';

const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;
const InputGroup = Input.Group;

const FileTree = (props) => {

  const text = <span>Title</span>;
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  const buttonWidth = 70;


  const FileTreeProps = {
    treeData: props.file.treeData,

    onSelect: function(e) {
      if(e.length > 0) {
        localStorage.currentSelectedFile = e[0];
      }
    },

    onCheck: function() {

    },

    onLoadData: function(treeNode) {
      return new Promise((resolve) => {
        props.dispatch({
          type: 'file/fetchFileNode',
          payload: {
            treeNode,
            resolve
          }
        })
      });
    },

    newFileInput: {

      value: props.file.newFileInput.value,

      onChange: function(e) {
        props.dispatch({
          type: 'file/handleNewFileInputChange',
          payload: e.target.value
        })
      },

      onPressEnter: function(e) {
        props.dispatch({
          type: 'file/handleNewFile'
        })
      }
    },

    newFolderInput: {

      value: props.file.newFolderInput.value,

      onChange: function(e) {
        props.dispatch({
          type: 'file/handleNewFolderInputChange',
          payload: e.target.value
        })
      },

      onPressEnter: function() {
        props.dispatch({
          type: 'file/handleNewFolder'
        })
      }
    },

    uploadInput: {

      value: props.file.uploadInput.value,

      onChange: function(e) {
        props.dispatch({
          type: 'file/handleUploadInputChange',
          payload: e.target.value
        })
      },

      onPressEnter: function() {
        props.dispatch({
          type: 'file/handleUpload'
        })
      }
    },

    searchInput: {

      value: props.file.searchInput.value,

      onChange: function(e) {
        props.dispatch({
          type: 'file/handleSearchInputChange',
          payload: e.target.value
        })
      },

      onPressEnter: function() {
        props.dispatch({
          type: 'file/handleSearch'
        })
      }
    }

  }

  const btnCls = {
    antSearchBtn: true,
    antSearchBtnNoempty: !!props.file.newFileInput.value.trim(),
  };

  const searchCls = {
    antSearchInput: true,
    antSearchInputFocus: props.file.focus,
  };

  const newFilePop = {
    title: <span>新建文件</span>,

    content: (
      <InputGroup style={searchCls}>
        <Input 
          {...FileTreeProps.newFileInput}
        />
        <div className="ant-input-group-wrap">
          <Button icon="plus" style={btnCls} onClick={FileTreeProps.newFileInput.onPressEnter}/>
        </div>
      </InputGroup>
    )
  }

  const newFolderPop = {
    title: <span>新建文件夹</span>,

    content: (
      <InputGroup style={searchCls}>
        <Input 
          {...FileTreeProps.newFolderInput}
        />
        <div className="ant-input-group-wrap">
          <Button icon="plus" style={btnCls} onClick={FileTreeProps.newFolderInput.onPressEnter}/>
        </div>
      </InputGroup>
    )
  }

  const uploadFilePop = {
    title: <span>上传文件</span>,

    content: (
      <InputGroup style={searchCls}>
        <Input 
          {...FileTreeProps.searchInput}
        />
        <div className="ant-input-group-wrap">
          <Button icon="plus" style={btnCls} onClick={FileTreeProps.searchInput.onPressEnter}/>
        </div>
      </InputGroup>
    )
  }

  const searchFilePop = {
    title: <span>搜索文件</span>,

    content: (
      <InputGroup style={searchCls}>
        <Input 
          {...FileTreeProps.uploadInput}
        />
        <div className="ant-input-group-wrap">
          <Button icon="plus" style={btnCls} onClick={FileTreeProps.uploadInput.onPressEnter}/>
        </div>
      </InputGroup>
    )
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
              <Popover placement="left" {...newFilePop} trigger="click">
                <Button onClick={FileTreeProps.createFile} className={EditorStyle.topbarBtnColumn}><Icon type="file-text" /></Button>
              </Popover>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Tooltip placement="bottom" title="新建文件夹">
              <Popover placement="left" {...newFolderPop} trigger="click">
                <Button onClick={FileTreeProps.createFoler} className={EditorStyle.topbarBtnColumn}><Icon type="folder" /></Button>
              </Popover>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Tooltip placement="bottom" title="上传文件">
              <Popover placement="left" {...uploadFilePop} trigger="click">
                <Button onClick={FileTreeProps.uploadFile} className={EditorStyle.topbarBtnColumn}><Icon type="cloud-upload-o" /></Button>
              </Popover>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Tooltip placement="bottom" title="搜索文件">
              <Popover placement="left" {...searchFilePop} trigger="click">
                <Button onClick={FileTreeProps.searchFile} className={EditorStyle.topbarBtnColumn}><Icon type="search" /></Button>
              </Popover>
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
