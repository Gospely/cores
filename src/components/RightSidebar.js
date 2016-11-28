import React , {PropTypes} from 'react';
import { Tabs, Icon, Popover } from 'antd';

import FileTree from './RightSidebar/FileTree';
import CloumnLayout from './RightSidebar/CloumnLayout';
import Attr from './RightSidebar/Attr';
import SettingPanel from './RightSidebar/SettingPanel';

const TabPane = Tabs.TabPane;

import { connect } from 'dva';

const RightSidebar = (props) => {

	var callback = function(key) {
		props.dispatch({
			type: 'rightbar/handleTabChanged',
			payload: key
		});
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

	return (
	  	<Tabs tabPosition="right" activeKey={props.rightbar.activeMenu} onChange={callback}>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="exception" />属性</span>} key="attr">
	    		<Attr></Attr>
	    	</TabPane>	    	
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="file-text" />文件</span>} key="file">
	    		<FileTree></FileTree>
	    	</TabPane>
	    	<TabPane style={styles.tab} tab={<span style={styles.span}><Icon style={styles.icon} type="eye-o" />布局</span>} key="4">
	    		<CloumnLayout></CloumnLayout>
	    	</TabPane>	    	
	  	</Tabs>
	)

}

function mapStateToProps({ rightbar }) {
  return { rightbar };
}

export default connect(mapStateToProps)(RightSidebar);
