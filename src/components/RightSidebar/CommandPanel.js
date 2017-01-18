import { connect } from 'dva';
import React , { PropTypes } from 'react';

const CommandPanel = (props) => {

	const commandProps = {
		onClick() {
			dispatch({
				type: 'CommandPanel/showCommandPanel'
			})
		}
	}

	// <div className={TreeStyle.fileSearchPane}
 //             onClick={() => {props.dispatch({type: 'file/hideSearchPane'})}}
 //             onKeyUp={handleKeyUp}
 //        >
 //          <div onClick={(e) => e.stopPropagation()} style={{maxWidth: 400, margin: '0 auto'}}>
 //            <Input autoFocus="autofocus" size="large" placeholder="index.js" onChange={searchPaneInputChange} value={props.file.searchFilePane.inputValue}/>
 //            <div style={{overflow: 'auto', maxHeight: 500}} id="toSetScroll">
 //                {props.file.searchFilePane.files.map((file, i)=> {
 //                  return  (
 //                    <div onClick={searchThisFile.bind(this,file.folder)}
 //                      key={file.id}
 //                      id={props.file.searchFilePane.currentIndex == i && 'activeFileOption'}
 //                      className={TreeStyle.fileSearchPaneOption +  ' ' +
 //                      (props.file.searchFilePane.currentIndex == i && TreeStyle.fileSearchPaneOptionActive)}
 //                      >
 //                          {file.folder}
 //                    </div>
 //                  )
 //                })}
 //            </div>
 //          </div>
 //        </div>

	return (	<Menu onClick={commandProps.onClick}
	        		style={{ width: '100%' }}
		        	defaultOpenKeys={['command']}
		        	mode="inline"
		      	>
			        <Menu.Item key="command">
						<span>查看快捷键</span>
			        </Menu.Item>
		      	</Menu>

		      	)
}

function mapStateToProps({ CommandPanel }) {
  return { CommandPanel };
}

export default connect(mapStateToProps)(CommandPanel);