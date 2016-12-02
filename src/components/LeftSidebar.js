import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover, Collapse } from 'antd';

import ConstructionTree from './RightSidebar/ConstructionTree';
import FileTree from './RightSidebar/FileTree';
import Controllers from './RightSidebar/Controllers';
import CloumnLayout from './RightSidebar/CloumnLayout';
import Attr from './RightSidebar/Attr';
import SettingPanel from './RightSidebar/SettingPanel';

import SplitPane from 'react-split-pane';
import { connect } from 'dva';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const RightSidebar = (props) => {

	var callback = function(key) {
		console.log(key);
	}

	var styles = {
		tab: {
			minHeight: '100vh'
		},

		icon: {
			marginRight: '0px',
			marginBottom: '8px'
		},

		span: {
		 	writingMode: 'tb-rl'
		}
	}
	console.log(props.sidebar.visible);
	return (
	  	<Tabs tabPosition="left" defaultActiveKey={props.devpanel.devType.defaultActiveKey} onChange={callback}>
	    	<TabPane style={styles.tab} tab={<span style={styles.span} hidden={!props.devpanel.devType.visual}><Icon style={styles.icon} type="bars" />结构</span>} key="controllers">
				<Collapse  className="noborder attrCollapse consCollapse" bordered={false} defaultActiveKey={['controllers', 'construction']}>
				    <Panel header="结构" key="construction" hidden="true">
	    	    		<ConstructionTree></ConstructionTree>
				    </Panel>
				    <Panel header="控件" key="controllers" hidden="true">
	    	    		<Controllers></Controllers>
				    </Panel>
				</Collapse>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="setting" />设置</span>} key="setting">
	    		<SettingPanel></SettingPanel>
	    	</TabPane>
	  	</Tabs>
	)

}
function mapStateToProps({ sidebar, devpanel}) {
  return { sidebar, devpanel};
}

export default connect(mapStateToProps)(RightSidebar);
