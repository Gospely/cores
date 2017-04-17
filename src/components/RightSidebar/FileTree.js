import React , { PropTypes } from 'react';
import { notification, Tree, Switch, Button, Icon, Tooltip, TreeSelect,
         Row, Col, Popover, Input, Dropdown, Menu, Popconfirm, message,
         Modal, AutoComplete, Upload, Spin } from 'antd';
import TreeStyle from './styles.css';
import EditorStyle from '../Panel/Editor.css';

import { connect } from 'dva';

const TreeNode = Tree.TreeNode;
const ButtonGroup = Button.Group;
const InputGroup = Input.Group;

const FileTree = (props) => {

  if (!window.fileFlag) {

    window.addEventListener('click', function (data) {

      if(localStorage.onSelect == 'false'){
        props.dispatch({type: 'file/hideContextMenu'});
      }else{
          return false;
      }
    }, false)

  }

  window.fileFlag = true;

  let maxHeight = document.documentElement.clientHeight - 68;

  const styles = {
    searchSuggestions: {
      border: ' 1px solid rgba(0, 0, 0, .2)',
      borderRadius: '5px'
    },
    searchSuggestionsItem: {
      padding: '3px 5px'
    },
    fileTreeMaxHeight: {
        maxHeight: maxHeight,
        overflow: 'auto'
    }
  }

  const text = <span>Title</span>;
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  let treeNodes = {};

  const buttonWidth = 70;
  sessionStorage.preClickTimestamp = sessionStorage.preClickTimestamp || 0;
  var preClickTimestamp_search = 0;

  const fileTreeMenuStyles = {
    position: props.file.contextMenuStyles.position,
    top: props.file.contextMenuStyles.top,
    left: props.file.contextMenuStyles.left,
    display:  props.file.contextMenuStyles.display
  }

  localStorage.currentFolder = localStorage.currentFolder || 'node-hello_ivydom';

  const FileTreeProps = {
    treeData: props.file.treeData,

    onDragEnter: function(info) {
    },

    onDrop: function(info) {
      const dropFolder = info.node.props.eventKey;
      var dragFile = info.dragNode.props.eventKey;

      if(!info.node.props.isLeaf) {
        props.dispatch({
          type: 'file/mvFile',
          payload: {
            fileName: dragFile.split('/').pop(),
            newFileName: dropFolder
          }
        })
      }else {
        message.error('请将文件移动到文件夹');
      }
    },

    onSelect: function(e, node) {
      localStorage.onSelect = true;
      if(e.length > 0) {
        localStorage.currentSelectedFile = e[0];
        var file = e[0];
        file = file.split('/');
        var files = e[0].split(".")
        var suffix = files[files.length-1];
        if(suffix != undefined){
          localStorage.suffix = suffix;
        }
        props.dispatch({
  				type: 'devpanel/dynamicChangeSyntax',
  				payload:{suffix}
  			});
        var isLeaf = node.node.props.isLeaf;
        if(e[0] != localStorage.dir && isLeaf){
          file.pop();
        }
        localStorage.currentFolder = file.join('/') + "/";
        localStorage.currentFileIsDir = !node.node.props.isLeaf;
      }

      var currentClickTimestamp = new Date().getTime();

      //双击事件
      if(currentClickTimestamp - parseInt(sessionStorage.preClickTimestamp) <= 300) {
        // alert(currentClickTimestamp - parseInt(sessionStorage.preClickTimestamp))
        var fileName = localStorage.currentSelectedFile;
        localStorage.onSelect = false;
        if(node.node.props.isLeaf) {
            props.dispatch({
                type: 'file/readFile',
                payload: localStorage.currentSelectedFile.split('/').pop()
            })
        }
      }

      sessionStorage.preClickTimestamp = currentClickTimestamp;

      // alert(preClickTimestamp);

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
      var fileName = proxy.node.props.eventKey,
          root = false;

      if(fileName == localStorage.dir){
        root = true;
      }

      localStorage.onSelect = false;

      localStorage.currentSelectedFile = fileName;
      fileName = fileName.split('/');
      fileName.pop();
      fileName = fileName.join('/') + '/';
      localStorage.currentFolder = fileName;

      localStorage.currentFileIsDir = !proxy.node.props.isLeaf;
      var event = proxy;
      props.dispatch({
        type: 'file/showContextMenu',
        payload: {event, root}
      });
    },

    renameModal: {

      visible: props.file.renameModal.visible,
      value: props.file.renameModal.value,

      ok: function() {
        props.dispatch({
          type: 'file/renameFile',
          payload: {
            fileName: localStorage.currentSelectedFile.split('/').pop()
          }
        })
        props.dispatch({
          type: 'file/hideRenameModal'
        })
      },

      cancel: function() {
        props.dispatch({
          type: 'file/hideRenameModal'
        })
      },

      onChange: function(e) {
          console.log(e.target.value);
        props.dispatch({
          type: 'file/handleRenameInputChange',
          payload: e.target.value
        })
      }

    },
    saveModal: {

      visible: props.file.saveModal.visible,
      title: props.file.saveModal.title,

      ok: function() {

        const editorId = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].activeEditor.id;
        var fileName = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].file;
        var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;

        if(fileName == localStorage.currentFolder) {
          message.error('请输入文件名');
          return false;saveModal
        }

        props.dispatch({
          type: 'file/writeFile',
          payload: {
            fileName,
            content
          }
        });

        props.dispatch({
          type: 'file/hideSaveModal'
        });

        if(localStorage.currentFileOperation == 'remove') {
          props.dispatch({
            type: 'devpanel/remove',
            payload: JSON.parse(localStorage.removeAction)
          });
        }
      },

      cancel: function() {

        props.dispatch({
          type: 'file/hideSaveModal'
        });
        if(localStorage.currentFileOperation == 'remove') {
          props.dispatch({
            type: 'devpanel/remove',
            payload: JSON.parse(localStorage.removeAction)
          });
        }
      },
    },

    uploadModal: {

      params: {
        visible: props.file.uploadModal.visible,
        title: props.file.uploadModal.title,
        onOk: function() {

          let value = props.file.uploadInput.value;
          // props.dispatch({
          //   type: 'file/',
          //   payload: {
          //     value
          //   }
          // });


          if (value.length == 0) {
            props.dispatch({
                type: 'file/hideUploadModal'
              });
            return false;
          }
          props.dispatch({
            type: 'file/showUploading'
          });
          var info = props.file.fileInfo;
          props.dispatch({
            type: 'file/fetchUploadFile',
             payload: info
          });

        },

        onCancel: function() {

          props.dispatch({
            type: 'file/hideUploadModal'
          });
        }
      },

      folderChange(val, node, extra) {
        props.dispatch({
            type: 'file/handleUploadFolderChange',
            payload: {
                val,
                node,
                extraF
            }
        })
      },

      switchIsOver: function (checked) {
          props.dispatch({
            type: 'file/switchIsOver',
            payload: checked
          })
      },

      // confirmUnZip: function () {
      //     props.dispatch({
      //       type: 'file/unZipFile'
      //     })
      // },

      uploadInput: {
        name:'fileUp',
        fileList: props.file.uploadInput.value,

        // disabled: props.file.uploadInput.disabled,

        multiple: true,

        onChange: function(info) {
          props.dispatch({
             type: 'file/handleUploadInputChange',
             payload: info
          })
        },
        beforeUpload() {
            if(props.file.uploadModal.folderValue == '') {
                message.error("请选择文件夹");
                return false;
            }
        },
        customRequest(info){
        	props.dispatch({
	            type: 'file/initFileInfo',
	             payload: info
	       });
        }
      },

    },

    reloadFile () {
      props.dispatch({
        type: 'file/fetchFileList'
      });
      treeNodes = loopData(props.file.treeData);
    },

    newFileNameModal: {

      visible: props.file.newFileNameModal.visible,
      value: props.file.newFileNameModal.value,
      title: props.file.newFileNameModal.title,

      ok: function() {

        var activePane = props.devpanel.panels.panes[props.devpanel.panels.activePane.key],
        editorId = activePane.activeEditor.id,
        tabKey = activePane.activeTab.key,
        paneKey = props.devpanel.panels.activePane.key,
        fileName = props.file.newFileNameModal.value;
        fileName = localStorage.currentFolder + '/' + fileName;

        var content = props.devpanel.panels.panes[props.devpanel.panels.activePane.key].editors[editorId].value;

        if(fileName == localStorage.currentFolder) {
          message.error('请输入文件名');
          return false;
        }

        props.dispatch({
          type: 'file/writeFile',
          payload: {
            fileName,
            content
          }
        });

        props.dispatch({
          type: 'devpanel/handleFileSave',
          payload: {
            tabKey: tabKey, pane: paneKey
          }
        });

        var value = props.file.newFileNameModal.value;

        props.dispatch({
          type: 'devpanel/changeTabTitle',
          payload: {
            value
          }
        })

        props.dispatch({
          type: 'file/hideNewFileNameModal'
        })

        var suffix = 'js';
        if(fileName != undefined && fileName != '新文件'　&& fileName != '新标签页'){
          fileName = fileName.split('.');
          suffix= fileName[fileName.length-1];
          if(suffix != undefined){
            localStorage.suffix = suffix;
          }
        }

        props.dispatch({
          type: 'devpanel/dynamicChangeSyntax',
          payload: {suffix}
        });

        if(localStorage.currentFileOperation == 'remove') {
          props.dispatch({
            type: 'devpanel/remove',
            payload: JSON.parse(localStorage.removeAction)
          });
        }

      },

      cancel: function() {

        props.dispatch({
          type: 'file/hideNewFileNameModal'
        })
        if(localStorage.currentFileOperation == 'remove') {
          props.dispatch({
            type: 'devpanel/remove',
            payload: JSON.parse(localStorage.removeAction)
          });
        }
      },

      onChange: function(e) {

          const illegalLetter = ['!',' ', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']',
                              '{', '}', '\\', '|', ':', ';', '\'', '"', '<', '>', ',', '.', '/', '?'];
          let theCurrentLetter = e.target.value.replace(props.file.newFileNameModal.value, '');
          if(illegalLetter.indexOf(theCurrentLetter) !== -1) {
              notification['warning']({
                  message: '请勿输入非法字符: \' ' + theCurrentLetter + ' \'',
                  description: '请重新输入'
              });
              return false;
          }
        props.dispatch({
          type: 'file/handleNewFileModelInputChange',
          payload: e.target.value
        })
      }

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
        });

        props.dispatch({
          type: 'file/hideNewFilePopup'
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
    searchFile: function () {

      var value = props.file.searchInput.value;
      props.dispatch({
        type: 'file/handleSearch',
        payload:{value}
      });
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

        var value = props.file.searchInput.value;
        props.dispatch({
          type: 'file/handleSearch',
          payload:{value}
        });
      }
    },

    uploadFile: function () {
        props.dispatch({
            type: 'file/showUploadModal'
        })
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

    visible: props.file.newFileInput.visible,

    onVisibleChange (visible) {
      props.dispatch({
        type: 'file/handleFilePopVisibleChange',
        payload: visible
      });
    },

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

    visible: props.file.newFolderInput.visible,

    onVisibleChange (visible) {
      props.dispatch({
        type: 'file/handleFolderPopVisibleChange',
        payload: visible
      });
    },

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

  const searchFilePop = {
    title: <span>搜索文件</span>,

    visbile: props.file.searchInput.visbile,

    content: (
      <div>
        <InputGroup style={searchCls}>
          <Input
            {...FileTreeProps.searchInput}
            onChange={FileTreeProps.searchInput.onChange}
          />
          <div className="ant-input-group-wrap">
            <Button icon="plus" style={btnCls} onClick={FileTreeProps.searchInput.onPressEnter}/>
          </div>
        </InputGroup>
      </div>
    )
  }

  const fileTreeMenuProps = {
    onClick: function(item) {

      var action = {
        read: function() {
          props.dispatch({
            type: 'file/readFile',
            payload: localStorage.currentSelectedFile.split('/').pop()
          })
        },

        rename: function() {
          props.dispatch({
            type: 'file/showRenameModal'
          })
        },

        copy: function() {
          localStorage.itemToCopy = localStorage.currentSelectedFile;
          localStorage.itemToCut = undefined;
        },

        paste: function() {
          var item = localStorage.itemToCopy;

          if(item != 'undefined') {

            var newFileName = localStorage.currentFileIsDir == 'true' ?
                localStorage.currentSelectedFile  + '/' + item.split('/').pop() :
                localStorage.currentFolder + item.split('/').pop();

            props.dispatch({
              type: 'file/copyFile',
              payload: {
                fileName: item.split('/').pop(),
                newFileName: newFileName
              }
            });
          }

          item = localStorage.itemToCut;

          if(item != 'undefined') {

            var newFileName = localStorage.currentFileIsDir == 'true' ?
                localStorage.currentSelectedFile + '/' + item.split('/').pop() :
                localStorage.currentFolder + item.split('/').pop();

            props.dispatch({
              type: 'file/mvFile',
              payload: {
                fileName: item.split('/').pop(),
                newFileName: newFileName
              }
            });
          }

          localStorage.itemToCopy = undefined;
          localStorage.itemToCut = undefined;
        },

        cut: function() {
          localStorage.itemToCut = localStorage.currentSelectedFile;
          localStorage.itemToCopy = undefined;
        },

        remove: function() {

          if(localStorage.currentFileIsDir == 'true') {
            props.dispatch({
              type: 'file/rmdir',
              payload: localStorage.currentSelectedFile.split('/').pop()
            })
          }else {
            props.dispatch({
              type: 'file/removeFile',
              payload: localStorage.currentSelectedFile.split('/').pop()
            })
            props.dispatch({
              type: 'devpanel/removeFile',
              payload: localStorage.currentSelectedFile.split('/').pop()
            })
          }

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
      <Menu.Item key="read" disabled={props.file.root || props.file.isLeaf}>打开</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="rename" disabled={props.file.root}>重命名</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="copy" disabled={props.file.root}>复制</Menu.Item>
      <Menu.Item key="paste">粘贴</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="cut" disabled={props.file.root}>剪切</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="remove">删除</Menu.Item>
    </Menu>
  );

  const loopData = data => data.map((item) => {

    if (item.children) {
      return <TreeNode title={item.name} value={item.key} isLeaf = {item.isLeaf} key={item.key}>{loopData(item.children)}</TreeNode>;
    }
    return (
        <TreeNode title={item.name} value={item.key} key={item.key} isLeaf={item.isLeaf} disabled={item.key === 'root'} />
    );
  });

  const searchThisFile = function(fileName) {

    fileName = props.file.searchFilePane.currentFolder || fileName;

    var file = fileName;

    file = file.split('.');
    var suffix = file[file.length-1];
    if(suffix != undefined){
      localStorage.suffix = suffix;
    }
    props.dispatch({
      type: 'devpanel/dynamicChangeSyntax',
      payload:{suffix}
    });
    fileName = fileName.replace(localStorage.currentProject,'')
    props.dispatch({
      type: 'file/readFile',
      payload: fileName
    })
    //切换语法
    props.dispatch({
      type: 'file/hideSearchPane'
    })
  }

  const handleKeyUp = function (Proxy) {
      if(Proxy.keyCode == 27) {
        props.dispatch({
          type: 'file/hideSearchPane'
        })
      }

      if (Proxy.keyCode == 38) {
        props.dispatch({
            type: 'file/searchPrvFile'
        })
      }

      if (Proxy.keyCode == 40) {
        props.dispatch({
            type: 'file/searchNextFile'
        })
      }

      if (Proxy.keyCode == 13) {
        searchThisFile();
      }
  }

  const searchPaneInputChange = function (e) {
      var value = e.target.value;
      props.dispatch({
        type: 'file/searchPaneInputChange',
        payload: e.target.value
      });
  }

  const fileSearchPane = {

    content: (
        <div className={TreeStyle.fileSearchPane}
             onClick={() => {props.dispatch({type: 'file/hideSearchPane'})}}
             onKeyUp={handleKeyUp}
        >
          <div onClick={(e) => e.stopPropagation()} style={{maxWidth: 400, margin: '0 auto'}}>
            <Input autoFocus="autofocus" size="large" placeholder="index.js" onChange={searchPaneInputChange} value={props.file.searchFilePane.inputValue}/>
            <div style={{overflow: 'auto', maxHeight: 500}} id="toSetScroll">
                {props.file.searchFilePane.files.map((file, i)=> {
                  return  (
                    <div onClick={searchThisFile.bind(this,file.folder)}
                      key={file.id}
                      id={props.file.searchFilePane.currentIndex == i && 'activeFileOption'}
                      className={TreeStyle.fileSearchPaneOption +  ' ' +
                      (props.file.searchFilePane.currentIndex == i && TreeStyle.fileSearchPaneOptionActive)}
                      >
                          {file.folder}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
    )
  }

  treeNodes = loopData(FileTreeProps.treeData);

  return (

    <div className={TreeStyle.wrapper}>

      <Modal title="更改文件名" visible={FileTreeProps.renameModal.visible}
        onOk={FileTreeProps.renameModal.ok} onCancel={FileTreeProps.renameModal.cancel}
      >
        <InputGroup style={searchCls}>
          <Input
            value={FileTreeProps.renameModal.value}
            onChange={FileTreeProps.renameModal.onChange}
            onPressEnter={FileTreeProps.renameModal.ok}
          />
          <div className="ant-input-group-wrap">
            <Button icon="check" style={btnCls} onClick={FileTreeProps.renameModal.ok}/>
          </div>
        </InputGroup>
      </Modal>
      <Modal title={FileTreeProps.saveModal.title} visible={FileTreeProps.saveModal.visible}
        onOk={FileTreeProps.saveModal.ok} onCancel={FileTreeProps.saveModal.cancel}
      >
        <span>您想要保存该文件吗？</span>
      </Modal>
      <Modal title={FileTreeProps.newFileNameModal.title} visible={FileTreeProps.newFileNameModal.visible}
        onOk={FileTreeProps.newFileNameModal.ok} onCancel={FileTreeProps.newFileNameModal.cancel}
      >
        <InputGroup style={searchCls}>
          <Input
            value={FileTreeProps.newFileNameModal.value}
            onChange={FileTreeProps.newFileNameModal.onChange}
            onPressEnter={FileTreeProps.newFileNameModal.ok}
          />
          <div className="ant-input-group-wrap">
            <Button icon="check" style={btnCls} onClick={FileTreeProps.newFileNameModal.ok}/>
          </div>
        </InputGroup>
      </Modal>

      <Modal {...FileTreeProps.uploadModal.params} style={{maxWidth: 400}}>
          <Spin spinning={props.file.uploadModal.isUploading}>
            上传到：
            <TreeSelect
                showSearch
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                loadData={FileTreeProps.onLoadData}
                style={{ width: 300, marginBottom: 10 }}
                treeNodeFilterProp='title'
                onSelect={FileTreeProps.uploadModal.folderChange}
                searchPlaceholder=' 可在此输入搜索'
                placeholder='文件夹'
                value={props.file.uploadModal.folderValue}
            >
                {treeNodes}
            </TreeSelect>
            <div className={TreeStyle.uploadInput}>
                <Upload.Dragger {...FileTreeProps.uploadModal.uploadInput}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或拖拽上传</p>
                </Upload.Dragger>
            </div>
            {props.file.uploadModal.needUnZip ?
                 (<div style={{marginTop: 10, paddingLeft: 48}}>
                    解压后覆盖同名文件?
                    <br />
                    <Switch defaultChecked = {false}
                            checkedChildren={'是'}
                            unCheckedChildren={'否'}
                            onChange={FileTreeProps.uploadModal.switchIsOver}
                    />

                 </div>) :
                 (<div style={{marginTop: 10, paddingLeft: 48}}>同目录下若有同名文件将被覆盖</div>)
            }
        </Spin>
    </Modal>

      <Spin spinning={props.file.treeLoading} tip={props.file.treeLoadingInfo} style={{height: 'calc(100vh - 38px)'}}>
          <div className={TreeStyle.header}>

            <Row>
              <Col span={5}>
                <Tooltip placement="bottom" title="新建文件">
                  <Popover placement="left" {...newFilePop} trigger="click">
                    <Button onClick={FileTreeProps.createFile} className={EditorStyle.topbarBtnColumn}><Icon type="file-text" /></Button>
                  </Popover>
                </Tooltip>
              </Col>
              <Col span={5}>
                <Tooltip placement="bottom" title="新建文件夹">
                  <Popover placement="left" {...newFolderPop} trigger="click">
                    <Button onClick={FileTreeProps.createFoler} className={EditorStyle.topbarBtnColumn}><Icon type="folder" /></Button>
                  </Popover>
                </Tooltip>
              </Col>
              <Col span={5}>
                <Tooltip placement="bottom" title="上传文件">
                    <Button onClick={FileTreeProps.uploadFile} className={EditorStyle.topbarBtnColumn}><Icon type="cloud-upload-o" /></Button>
                </Tooltip>
              </Col>
              <Col span={5}>
                <Tooltip placement="bottom" title="搜索文件">
                    <Button onClick={FileTreeProps.searchFile} className={EditorStyle.topbarBtnColumn}><Icon type="search" /></Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip placement="bottom" title="刷新文件列表">
                    <Button onClick={FileTreeProps.reloadFile} className={EditorStyle.topbarBtnColumn}><Icon type="reload" /></Button>
                </Tooltip>
              </Col>
            </Row>
          </div>

          {fileTreeMenu}
            <div style={styles.fileTreeMaxHeight}>
                <Tree showLine
                  onSelect={FileTreeProps.onSelect}
                  onCheck={FileTreeProps.onCheck}
                  loadData={FileTreeProps.onLoadData}
                  onRightClick={FileTreeProps.onRightClick}
                  draggable={true}
                  onDragEnter={FileTreeProps.onDragEnter}
                  onDrop={FileTreeProps.onDrop}
                  defaultExpandedKeys={[localStorage.dir]}
                >
                  {treeNodes}
                </Tree>
            </div>
          {props.file.searchFilePane.visible ? fileSearchPane.content : null}
      </Spin>
    </div>

  );

};

function mapStateToProps({ file, devpanel}) {
  return { file, devpanel };
}

export default connect(mapStateToProps)(FileTree);
