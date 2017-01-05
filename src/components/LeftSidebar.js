import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover, Collapse } from 'antd';

import { connect } from 'dva';

import ConstructionTree from './RightSidebar/ConstructionTree';
import FileTree from './RightSidebar/FileTree';
import Controllers from './RightSidebar/Controllers';
import CloumnLayout from './RightSidebar/CloumnLayout';
import Attr from './RightSidebar/Attr';
import SettingPanel from './RightSidebar/SettingPanel';

import SplitPane from 'react-split-pane';

import computeDomHeight from '../utils/computeDomHeight'

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const leftSidebar = (props) => {

	var handleTabChanged = function(key) {
		props.dispatch({
			type: 'sidebar/handleTabChanged',
			payload: key
		});
	}

	var styles = {
		tab: {
			// minHeight: '100vh'
		},

		icon: {
			marginRight: '0px',
			marginBottom: '8px'
		},

		span: {
		 	writingMode: 'tb-rl'
		}
	}

	let collapseOnChange = function(e) {
		computeDomHeight.leftSidebarCollapseChange(e);
	}

	let FileTreeComponent = () => {
		return !window.isWeapp ? (
		    	<TabPane style={styles.tab} tab={<span style={styles.span}>
		    		<Icon style={styles.icon} type="file-text" />文件</span>} 
		    		key="file"
		    		disabled={window.disabled}
		    	>
		    		<FileTree></FileTree>
		    	</TabPane>

			) : '';
	}

	let constructionTreeComponent = () => {
		return window.isWeapp ? (
		    	<TabPane style={styles.tab} 
		    		tab={<span style={styles.span}>
		    			<Icon style={styles.icon} type="bars" />结构
		    			</span>} 
		    		key="controllers"
		    		disabled={window.disabled}
		    	>
					<Collapse className="noborder attrCollapse" bordered={false} 
						defaultActiveKey={['controllers', 'construction']}
						onChange={collapseOnChange}
					>
					    <Panel header="组件树" key="construction" className="toGetConstructionHeight">
		    	    		<ConstructionTree></ConstructionTree>
					    </Panel>
					    <Panel header="控件" key="controllers" className="consCollapseTopBorder" >
		    	    		<Controllers></Controllers>
					    </Panel>
					</Collapse>
		    	</TabPane>
			) : '';
	}
	
	return (
	  	<Tabs tabPosition="left" defaultActiveKey={props.devpanel.devType.defaultActiveKey} activeKey={props.sidebar.activeMenu} onChange={handleTabChanged}>
	  		{constructionTreeComponent()}
	    	{FileTreeComponent()}
	  	</Tabs>
	)

}

function mapStateToProps({ sidebar, devpanel}) {
  return { sidebar, devpanel};
}

export default connect(mapStateToProps)(leftSidebar);
