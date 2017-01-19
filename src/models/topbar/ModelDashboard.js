import dva from 'dva';

export default {
	namespace: 'dashboard',

	state: {
		visible: false,

		src: ''
	},

	subscriptions: {

		setup({ dispatch, history }) {
	      	history.listen(({ pathname }) => {

	      		var src = '';

		      	if(document.domain == 'localhost') {
		        	src = 'http://localhost:8088';
		      	}else {
		        	src = 'http://dash.gospely.com';
		      	}

		      	let visible = !!sessionStorage.dashVisibe;

		      	dispatch({
		      		type: 'setVible',
		      		payload: visible
		      	})

	      		dispatch({
	      			type: 'setSrc',
	      			payload: src
	      		});
	      	});
		}

	},

	reducers: {

		hideDash(state) {
			state.visible = false;
			sessionStorage.dashVisibe = '';
			return {...state};
		},

		showDash(state) {
			state.visible = true;
			sessionStorage.dashVisibe = true;
			return {...state};
		},

		setSrc(state, { payload: src }) {
			state.src = src;
			return {...state};
		},

		setVible(state, {payload: visible}) {
			state.visible = visible;
			return {...state};
		}

	}
}
