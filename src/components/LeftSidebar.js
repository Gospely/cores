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
import VDCollections from './VDSite/VDLeftPanel/VDCollections.js';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const leftSidebar = (props) => {

	var handleTabChanged = function(key) {
		props.dispatch({
			type: 'sidebar/handleTabChanged',
			payload: key
		});
	}

	var closePage = () => {
		props.dispatch({
			type: 'vdpm/visibleChange',
			payload: false
		});
		props.dispatch({
			type: 'vdCollections/changeCollectionsItemVisible',
			payload: false
		});
		props.dispatch({
			type: 'vdCollections/setCollectionsItem',
			payload: {
				item:{
						name:'',
						key: '',
						url: '',
						collectionsItemList: [],
						list: [],
					},
				index:-1 
			}
		});
		props.dispatch({
			type: 'vdCollections/changeItemlistVisible',
			payload:false
		})
		props.dispatch({
			type: 'vdCollections/changeCollectionsItemPreviewVisible',
			payload: false
		})
		props.dispatch({
			type: 'vdCollections/changeItemListPopoverLayout',
			payload: false
		})
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
		 	//writingMode: 'tb-rl',
		 	// WebkitWritingMode: 'vertical-rl'
		 	dispaly: 'block',
		 	width: '35%'
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
			    		<Icon style={styles.icon} type="file-text" /><br/>文<br/>件</span>}
			    		key="file"
			    		disabled={window.disabled}
			    	>
			    		<FileTree></FileTree>
			    	</TabPane>
				);
			}
		}

		return [];
	}

	let constructionTreeComponent = () => {
		return window.isWeapp ? (
		    	<TabPane style={styles.tab}
		    		tab={<span style={styles.span}>
		    			<Icon style={styles.icon} type="bars" /><br/>结<br/>构
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
			) : [];
	}

	let columnLayouComponent = () => {

		if(!window.isWeapp) {

			if(localStorage.image != 'vd:site') {
				return (
					<TabPane style={styles.tab} tab={<span style={styles.span}>
			    		<Icon style={styles.icon} type="eye-o" /><br/>布<br/>局</span>}
			    		key="4"
			    		disabled={window.disabled}
			    	>
			    		<CloumnLayout></CloumnLayout>
			    	</TabPane>
				);
			}
		}

		return [];
	}

	let settingLayoutComponent = () => {

		if(localStorage.image != 'vd:site') {
			return (
		    	<TabPane style={styles.tab}
		    		tab={<span style={styles.span}>
		    			<Icon style={styles.icon} type="setting" /><br/>设<br/>置
		    		</span>} key="setting"
		    		disabled={window.disabled}
		    	>
		    		<SettingPanel></SettingPanel>
		    	</TabPane>
			);
		}

		return [];

	}

	let VDControllersComponent = () => {

		var sidebarMenu = [];

		if(localStorage.image == 'vd:site') {
	    	sidebarMenu = (
	    		<TabPane style={styles.tab}
	    			tab={<span id="vdsiteCtrlBtn" style={styles.span}>
	    				<Icon style={styles.icon} type="inbox" /><br/>控<br/>件
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

		var sidebarMenu = [];

		if(localStorage.image == 'vd:site') {
	    	sidebarMenu = (
				<TabPane style={styles.tab}
	    			tab={<span id="vdsitePagesBtn" style={styles.span}>
	    				<Icon style={styles.icon} type="copy" /><br/>页<br/>面
	    			</span>} key="vdsite-pages"
	    			disabled={window.disabled}
	    		>
	    			<VDPages></VDPages>
	    		</TabPane>
	    	);
		}

		return sidebarMenu;
	}

	let VDCollectionsA = () => {
		var sidebarMenu = [];

		if(localStorage.image == 'vd:site') {
	    	sidebarMenu = (
				<TabPane style={styles.tab}
	    			tab={<span id="vdsiteCollectionsBtn" style={styles.span}>
	    				<Icon style={styles.icon} type="hdd" /><br/>数<br/>据<br/>集
	    			</span>} key="vdsite-collections"
	    			disabled={window.disabled}
	    		>
	    			<VDCollections></VDCollections>
	    		</TabPane>
	    	);
		}

		return sidebarMenu;		
	}

	const tabContent = () => {

		var content = [];

		content[0] = constructionTreeComponent();
		content[1] = FileTreeComponent();
		content[2] = columnLayouComponent();
		content[3] = settingLayoutComponent();
		content[4] = VDControllersComponent();
		content[5] = VDPagesComponent();
		content[6] = VDCollectionsA();

		for (var i = 0; i < content.length; i++) {
			var c = content[i];
			if(c.length) {
				content.splice(i, 1);
			}
		};

		return content;
	}

	return (
	  	<Tabs tabPosition="left" 
	  		  defaultActiveKey={props.devpanel.devType.defaultActiveKey} 
	  		  activeKey={props.sidebar.activeMenu} 
	  		  onChange={handleTabChanged}
	  		  onTabClick={closePage}
	  		  >
	  		{tabContent()}
	  	</Tabs>
	)

}

function mapStateToProps({ sidebar, devpanel, vdpm, vdCollections}) {
  return { sidebar, devpanel, vdpm, vdCollections};
}

export default connect(mapStateToProps)(leftSidebar);
