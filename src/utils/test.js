
function getCtrlByKey(state, key, activePage) {
	let obj = {
			index: 0,
			level: 1,
			controller: undefined
		},

		controllers = state.layout[activePage.key];

	const loopControllers = function(controllers, level) {
		level = level || 1;
		for (let i = 0; i < controllers.length; i++) {
			let currentControl = controllers[i];
			if (currentControl.children) {
				loopControllers(currentControl.children, level++);
			}
			if (currentControl.vdid === key) {
				obj.index = i;
				obj.level = level;
				obj.controller = currentControl;
				break;
			}
		}
		return obj;
	}

	return loopControllers(controllers, 1);
}


function deepTree(state, key, activePage) {
	
}
export default {
    getCtrlByKey: getCtrlByKey,
    deepTree: deepTree
};
