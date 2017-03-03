import React , {PropTypes} from 'react';
import dva from 'dva';

export default {
	namespace: 'cpre',
	state: {
		fullscreen: true,
		loaded: false
	},

	reducers: {
		handleFullscreenSwitchChange (state, { payload: checked }) {
			return {...state, fullscreen: checked};
		},

		setLoaded(state) {
			state.loaded = true;
			return {...state};
		},

		setLoading(state) {
			state.loaded = false;
			return {...state};
		},
		initState(state, { payload: params }) {

			state.fullscreen = params.UIState.fullscreen;
			state.loaded = params.loaded;
			return {...state};
		}

	}

}

/*

element.style {
    top: 0px;
    left: 0px;
    transform: translate(447px, 1673px);
    width: 26px;
    height: 26px;
}

.wf-outline.active {
    opacity: 0.99;
}
.wf-outline.is-dynamic {
    border-color: #9B7CF2;
}
.bem-OutlineSelectedNode {
    border: 1px solid rgba(23, 141, 247, 0.93);
    z-index: 8;
}
.wf-outline {
    position: absolute;
    color: #178df7;
    pointer-events: none;
    opacity: 0.00;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

body {
  font-family: Lato, sans-serif;
  color: #333;
  font-size: 14px;
  line-height: 20px;
}
h1 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: white;
  font-size: 58px;
  line-height: 60px;
  font-weight: 300;
}
h2 {
  margin-top: 20px;
  margin-bottom: 40px;
  color: white;
  font-size: 20px;
  line-height: 26px;
  font-weight: 300;
}
h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
}
h4 {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
}
h5 {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
}
h6 {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 700;
}
p {
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 300;
}



*/
