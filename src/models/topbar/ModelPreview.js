import dva from 'dva';

export default {
  namespace: 'preview',

  state: {
    visible: false,

    src: ''
  },

  subscriptions: {

    setup({ dispatch, history }) {
          history.listen(({ pathname }) => {

            var src = '';

            if(document.domain == 'localhost') {
              src = 'http://'+localStorage.domain
            }else {
              src = 'http://dash.gospely.com';
            }

            let visible = !!sessionStorage.previewVisibe;

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
  //

  reducers: {

    hidePreview(state) {
      state.visible = false;
      sessionStorage.previewVisibe = '';
      return {...state};
    },

    showPreview(state) {
      state.visible = true;
      sessionStorage.previewVisibe = true;
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
