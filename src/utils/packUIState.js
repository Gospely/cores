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
	console.log(params);
	var uiState = {
      	rightbar: {
                  activeMenu: params.rightbar.activeMenu
      	},

      	sidebar: {
                  activeMenu: params.sidebar.activeMenu
      	},

       	devpanel: params.devpanel,
		//
     //  	designer: {
        //           layout: params.designer.layout,
        //           layoutState: params.designer.layoutState,
        //           defaultDevice: params.designer.defaultDevice
     //  	},
		previewer: params.cpre,
		vdpm: params.vdpm,
		vdcore: params.vdcore,
		vdCtrlTree: {
			activeCtrl: params.vdCtrlTree.activeCtrl,
			layout: params.vdCtrlTree.layout,
			layoutState: params.vdCtrlTree.layoutState,
			activePage: params.vdCtrlTree.activePage || {
	    		key: 'index.html'
	    	},
			symbols: params.vdCtrlTree.symbols,
			selectIndex: params.vdCtrlTree.selectIndex || 0
		},
		vdstyles: params.vdstyles,
		vdanimations: params.vdanimations,
	}

	return uiState;

}

export default packUIStage;
