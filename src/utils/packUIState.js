const packUIStage = function (params) {
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
