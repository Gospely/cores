import dva from 'dva';
import request from '../utils/request.js';

export default {
	namespace: 'sidebar',
	state: {
		modalNewAppVisible: false,
		modalSwitchAppVisible: false,
		modalModifyGitOriginVisible: false,

		modifyGitOriginInput: {
			value: '',
			isGit: false
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {
          		dispatch({
            		type: 'isGitProject'
          		});
	      	});
		}
	},

	effects: {

		*isGitProject({payload: params}, {call, put, select}) {
      		var isGit = yield request('fs/git/', {
      			method: 'POST',
      			body: JSON.stringify({
      				dir: 'node-hello_ivydom'
      			})
      		});

      		if(isGit.data.fields) {
      			//获取origin源
      			var origin = yield request('fs/origin/git', {
	      			method: 'POST',
	      			body: JSON.stringify({
	      				dir: 'node-hello_ivydom'
	      			})
	      		});

	      		yield put({ type: 'setOriginValue', payload: origin })
      		}else {
	      		yield put({ type: 'setIsGit', payload: isGit });      			
      		}

		},

		*modifyGitOrigin({payload: params}, {call, put}) {
			// const dirName = params.treeNode.props.eventKey;
   //    		var fileList = yield request('fs/list/file/?id=' + dirName);
   //    		yield put({ type: 'treeOnLoadData', payload: {
   //    			fileList,
   //    			dirName
   //    		} });
		},

		*pushGit() {

		},

		*pullGit() {

		}

	},

	reducers: {

		showModalNewApp(state) {
			return {...state, modalNewAppVisible: true};
		},

		hideModalNewApp(state) {
			return {...state, modalNewAppVisible: false};
		},

		createApp(state) {
			
		},

		showModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: true};
		},

		hideModalSwitchApp(state) {
			return {...state, modalSwitchAppVisible: false};
		},

		switchApp(state) {

		},

		selectApp(state) {

		},

		showModalModifyGitOrgin(state) {
			return {...state, modalModifyGitOriginVisible: true};
		},

		hideModalModifyGitOrigin(state) {
			return {...state, modalModifyGitOriginVisible: false};
		},

		handleModifyGitOriginInputChange(state, {payload: val}) {
			return {...state, modifyGitOriginInput: {
				value: val
			}}
		},

		setIsGit(state, {payload: flag}) {
			return {...state, modifyGitOriginInput: {
				isGit: flag.data.fields	
			}}
		},

		setOriginValue(state, {payload: origin}) {
			return {...state, modifyGitOriginInput: {
				value: origin.data.fields
			}}			
		}

	}

}