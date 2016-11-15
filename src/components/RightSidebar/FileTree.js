import React , { PropTypes } from 'react';
import { Tree, Button, Icon, Tooltip, Row, Col, Popover, Input, Dropdown, Menu, Popconfirm, message} from 'antd';
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
  var preClickTimestamp = 0;

  const fileTreeMenuStyles = {
    position: props.file.contextMenuStyles.position,
    top: props.file.contextMenuStyles.top,
    left: props.file.contextMenuStyles.left,
    display:  props.file.contextMenuStyles.display
  } 

  localStorage.currentFolder = localStorage.currentFolder || 'node-hello_ivydom';

  const FileTreeProps = {
    treeData: props.file.treeData,

    onSelect: function(e, node) {
      if(e.length > 0) {
        localStorage.currentSelectedFile = e[0];
        var file = e[0];
        file = file.split('/');
        file.pop();
        localStorage.currentFolder = file.join('/') + '/';        
      }

      var currentClickTimestamp = new Date().getTime();

      //双击事件
      if(currentClickTimestamp - preClickTimestamp <= 200) {

        if(node.node.props.isLeaf) {
          props.dispatch({
            type: 'file/readFile',
            payload: localStorage.currentSelectedFile.split('/').pop()
          })
        }

      }

      preClickTimestamp = currentClickTimestamp;

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

    onRightClick: function(proxy) {
      var fileName = proxy.node.props.eventKey;
      localStorage.currentSelectedFile = fileName;
      fileName = fileName.split('/');
      fileName.pop();
      fileName = fileName.join('/') + '/';
      localStorage.currentFolder = fileName;
      props.dispatch({
        type: 'file/showContextMenu',
        payload: proxy
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
          type: 'file/touch'
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
          type: 'file/mkdir'
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
    borderRadius: '0px',
    marginLeft: '-1px'
  };

  const searchCls = {
    antSearchInput: true,
    antSearchInputFocus: props.file.focus,
  };

  const newFilePop = {
    title: <span>新建文件</span>,

    visbile: props.file.newFileInput.visbile,

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

    visbile: props.file.newFolderInput.visbile,

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

    visbile: props.file.uploadInput.visbile,

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

    visbile: props.file.searchInput.visbile,

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

  const fileTreeMenuProps = {
    onSelect: function(item) {

      var action = {
        read: function() {
          props.dispatch({
            type: 'file/readFile',
            payload: localStorage.currentSelectedFile.split('/').pop()
          })
        },

        rename: function() {

        },

        copy: function() {
          localStorage.itemToCopy = localStorage.currentSelectedFile;
          localStorage.itemToCut = undefined;
        },

        paste: function() {
          var item = localStorage.itemToCopy;

          if(item == 'undefined') {
            item = localStorage.itemToCut;
          }

          if(item == 'undefined') {
            message.error('请选择要操作的项目!');
          }

          localStorage.itemToCopy = undefined;
        },

        cut: function() {
          localStorage.itemToCut = localStorage.currentSelectedFile;
          localStorage.itemToCopy = undefined;
        },

        remove: function() {

        }
      }

      action[item.key]();
      props.dispatch({
        type: 'file/hideContextMenu'
      })

    }
  }

  const fileTreeMenu = (
    <Menu style={fileTreeMenuStyles} {...fileTreeMenuProps} className="context-menu">
      <Menu.Item key="read">打开</Menu.Item>
      <Menu.Item key="rename">重命名</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="copy">复制</Menu.Item>
      <Menu.Item key="paste">粘贴</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="cut">剪切</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="remove">删除</Menu.Item>
    </Menu>
  );

  const loopData = data => data.map((item) => {
    if (item.children) {
      return <TreeNode title={item.name} key={item.key}>{loopData(item.children)}</TreeNode>;
    }
    return (
        <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} disabled={item.key === 'root'} />
    );
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

      {fileTreeMenu}

      <Tree className="myCls" showLine
        onSelect={FileTreeProps.onSelect}
        onCheck={FileTreeProps.onCheck}
        loadData={FileTreeProps.onLoadData}
        onRightClick={FileTreeProps.onRightClick}
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
