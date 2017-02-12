import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'vdstyles',
	state: {

		stylesList: {
		    ".body":{
		        "height":"100%"
		    },
		    ".designer-wrapper":{
		        "width":"100%",
		        "background":"url(./assets/preview_device_bg.png)",
		        "overflow":"auto"
		    },
		    ".designer-header":{
		        "padding-right":"10px",
		        "padding-left":"10px",
		        "padding-top":"5px",
		        "padding-bottom":"5px",
		        "background":"#fff"
		    },
		    ".dynamic-delete-button":{
		        "cursor":"pointer",
		        "position":"relative",
		        "top":"4px",
		        "font-size":"24px",
		        "color":"#999",
		        "transition":"all .3s"
		    },
		    ".vd-right-panel":{
		        "height":"100vh"
		    },
		    ".vd-right-panel .ant-tabs":{
		        "height":"100%"
		    },
		    ".vd-right-panel .ant-tabs-content":{
		        "height":"e(\"calc(100vh - 39px)\")"
		    },
		    ".vd-right-panel .ant-tabs-tab":{
		        "margin-right":"0!important",
		        "padding-left":"16px!important",
		        "padding-right":"16px!important",
		        "padding-top":"10px!important",
		        "padding-bottom":"9px!important"
		    }
		},


	},

	reducers: {

		setCurrentActivePageListItem(state, { payload: key }) {
			state.currentActivePageListItem = key;
			return {...state};
		}

	}

}