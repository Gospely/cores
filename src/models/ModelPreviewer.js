import dva from 'dva';
import key from 'keymaster';

export default {
	namespace: 'previewer',
	state: {
		siteValue: ''
	},

	subscriptions: {
		keyEvent(dispatch) {
	      key('esc', () => { dispatch({type:'devpanel/loadPreviewer', payload: false}) });
	    },
	},

	effects: {

	},

	reducers: {
		handleInputChange(state,{payload: val}) {
			return {...state, siteValue: val};
		}
	}
}