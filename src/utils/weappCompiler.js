const weappCompiler = {
	layout: {},

	init: function(layout) {
		this.layout = layout;
		return this;
	},

	compile: function() {
		return true;
	},

	cloudPack: function() {
		return true;
	},

	download: function() {

	}

}

export default weappCompiler;