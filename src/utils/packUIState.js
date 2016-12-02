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
	            layouState: params.designer.layouState,
	            defaultDevice: params.designer.defaultDevice
	      }
	}

	return uiState;

}

export default packUIStage;