const packUIStage = function (params) {

	const packByType = {
		'ha': function(){

		},
		wechat: function(){

		},
		vd: function(){
			return {vdpm: params.vdpm};
		},
		common: function(){

		},

	}
	var uiState = {
      	rightbar: {
                  activeMenu: params.rightbar.activeMenu
      	},

      	sidebar: {
                  activeMenu: params.sidebar.activeMenu
      	},

      	devpanel: params.devpanel,

      	designer: {
                  layout: params.designer.layout,
                  layoutState: params.designer.layoutState,
                  defaultDevice: params.designer.defaultDevice
      	},
		previewer: params.cpre,
		vdpm: params.vdpm
	}

	return uiState;

}

export default packUIStage;
