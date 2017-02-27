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

import VDControllers from './VDSite/VDLeftPanel/VDControllers.js';
import VDPages from './VDSite/VDLeftPanel/VDPages.js';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const leftSidebar = (props) => {

	var handleTabChanged = function(key) {
		props.dispatch({
			type: 'sidebar/handleTabChanged',
			payload: key
		});

		props.dispatch({
			type: 'vdpm/handleNewPageVisible',
			payload: { value: false}
		});
		props.dispatch({
			type: 'vdpm/handleNewFolderVisible',
			payload: { value: false}
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
		 	writingMode: 'tb-rl',
		 	// WebkitWritingMode: 'vertical-rl'
		}
	}

	let collapseOnChange = function(e) {
		computeDomHeight.leftSidebarCollapseChange(e);
	}

	let FileTreeComponent = () => {

		if(!window.isWeapp) {

			if(localStorage.image != 'vd:site') {
				return (
		    		<TabPane style={styles.tab} tab={<span style={styles.span}>
			    		<Icon style={styles.icon} type="file-text" />文件</span>}
			    		key="file"
			    		disabled={window.disabled}
			    	>
			    		<FileTree></FileTree>
			    	</TabPane>
				);
			}
		}

		return '';
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

	let columnLayouComponent = () => {

		if(!window.isWeapp) {

			if(localStorage.image != 'vd:site') {
				return (
					<TabPane style={styles.tab} tab={<span style={styles.span}>
			    		<Icon style={styles.icon} type="eye-o" />布局</span>}
			    		key="4"
			    		disabled={window.disabled}
			    	>
			    		<CloumnLayout></CloumnLayout>
			    	</TabPane>
				);
			}
		}

		return '';
	}

	let settingLayoutComponent = () => {

		if(localStorage.image != 'vd:site') {
			return (
		    	<TabPane style={styles.tab}
		    		tab={<span style={styles.span}>
		    			<Icon style={styles.icon} type="setting" />设置
		    		</span>} key="setting"
		    		disabled={window.disabled}
		    	>
		    		<SettingPanel></SettingPanel>
		    	</TabPane>
			);
		}

		return ''

	}

	let VDControllersComponent = () => {

		var sidebarMenu = '';

		if(localStorage.image == 'vd:site') {
	    	sidebarMenu = (
	    		<TabPane style={styles.tab}
	    			tab={<span id="vdsiteCtrlBtn" style={styles.span}>
	    				<Icon style={styles.icon} type="plus" />控件
	    			</span>} key="vdsite-controllers"
	    			disabled={window.disabled}
	    		>
	    			<VDControllers></VDControllers>
	    		</TabPane>
	    	);
		}

		return sidebarMenu;
	}

	let VDPagesComponent = () => {

		var sidebarMenu = '';

		if(localStorage.image == 'vd:site') {
	    	sidebarMenu = (
				<TabPane style={styles.tab}
	    			tab={<span id="vdsitePagesBtn" style={styles.span}>
	    				<Icon style={styles.icon} type="copy" />页面
	    			</span>} key="vdsite-pages"
	    			disabled={window.disabled}
	    		>
	    			<VDPages></VDPages>
	    		</TabPane>
	    	);
		}

		return sidebarMenu;
	}

	return (
	  	<Tabs tabPosition="left" defaultActiveKey={props.devpanel.devType.defaultActiveKey} activeKey={props.sidebar.activeMenu} onChange={handleTabChanged}>
	  		{constructionTreeComponent()}
	    	{FileTreeComponent()}
	    	{columnLayouComponent()}
	    	{settingLayoutComponent()}
	    	{VDControllersComponent()}
	    	{VDPagesComponent()}
	  	</Tabs>
	)

}

function mapStateToProps({ sidebar, devpanel, vdpm}) {
  return { sidebar, devpanel, vdpm};
}

export default connect(mapStateToProps)(leftSidebar);
