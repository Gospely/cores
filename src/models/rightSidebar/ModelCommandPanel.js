import dva from 'dva';
import React , {PropTypes} from 'react';

export default {
	namespace: 'commandpanel',
	state: {
		showPanel: false,
		shortcuts: [{
			desc: '新建文件',
			key: '⌥-N / Alt-N',
			canDo: true
		}, {
			desc: '撤销',
			key: '⌘-Z / Ctrl-Z',
			canDo: false
		}, {
			desc: '中止命令行',
			key: '⌃-C / Ctrl-C',
			canDo: false
		}, {
			desc: '复制',
			key: '⌘-C / Ctrl-C',
			canDo: false
		}, {
			desc: '剪切',
			key: '⌘-X / Ctrl-X',
			canDo: false
		}, {
			desc: '粘贴',
			key: '⌘-V / Ctrl-V',
			canDo: false
		}, {
			desc: '切换文件',
			key: '⌘-P / Ctrl-P',
			canDo: true
		}, {
			desc: '新建文件',
			key: '⌥-N / Alt-N',
			canDo: true
		}, {
			desc: '保存文件',
			key: '⌘-S / Ctrl-S',
			canDo: true
		}, {
			desc: '新建应用',
			key: '⌥-⇧-N / Alt-Shift-N',
			canDo: true
		}, {
			desc: '文件内查找',
			key: '⌘-F / Ctrl-F',
			canDo: false
		}, {
			desc: '跳至行尾',
			key: '⌘-Right / Ctrl-Right',
			canDo: false
		}, {
			desc: '跳至行首',
			key: '⌘-Left / Ctrl-Left',
			canDo: false
		}, {
			desc: '跳至单词首部',
			key: '⌥-Left / Alt-Left',
			canDo: false
		}, {
			desc: '跳至单词尾部',
			key: '⌥-Right / Alt+Right',
			canDo: false
		}, {
			desc: '选择单词',
			key: '⌥-D / Alt+D',
			canDo: false
		}, {
			desc: '选择全部',
			key: '⌘-A / Ctrl-A'
		}, {
			desc: '向左选择',
			key: '⇧-Left / Shift-Left',
			canDo: false
		}, {
			desc: '向右选择',
			key: '⇧-Right / Shift-Right',
			canDo: false
		}, {
			desc: '向下选择',
			key: '⇧-Down / Shift-Down',
			canDo: false
		}, {
			desc: '向上选择',
			key: '⇧-Up / Shift-Up',
			canDo: false
		}, {
			desc: '向左选择所有',
			key: '⌘-⇧-Left / Ctrl-Shift-Left',
			canDo: false
		}, {
			desc: '向右选择所有',
			key: '⌘-⇧-Right / Ctrl-Shift-Right',
			canDo: false
		}, {
			desc: '向下选择所有',
			key: '⌘-⇧-Down / Ctrl-Shift-Down',
			canDo: false
		}, {
			desc: '向上选择所有',
			key: '⌘-⇧-Up / Ctrl-Shift-Up',
			canDo: false
		}, {
			desc: '向左选择单词',
			key: '⌥-⇧-Left / Alt-Shift-Left',
			canDo: false
		}, {
			desc: '向右选择单词',
			key: '⌥-⇧-Right / Alt-Shift-Right',
			canDo: false
		}, {
			desc: '向上多行光标',
			key: '⌘-⌥-⇧-Up / Ctrl-Alt-Shift-Up',
			canDo: false
		}, {
			desc: '向下多行光标',
			key: '⌘-⌥-⇧-Down / Ctrl-Alt-Shift-Down',
			canDo: false
		}, {
			desc: '进入设置面板',
			key: '⌥-, / Alt-,',
			canDo: false
		}, {
			desc: '关闭当前tab',
			key: '⌥-W / Alt-W',
			canDo: true
		}, {
			desc: '关闭所有tab',
			key: '⌥-⇧-W, / Alt-Shift-W',
			canDo: true
		}, {
			desc: '下一个tab',
			key: '⌥-Tab, / Alt-Tab',
			canDo: true
		}, {
			desc: '上一个tab',
			key: '⌥-⇧-Tab, / Alt-Shift-Tab',
			canDo: true
		}],
		currentIndex: 0,
		currentKey: '⌥-N / Alt-N',
		visible: false,
		inputValue: ''
	},

	effects: {

	},

	reducers: {
		showCommandPanel(state) {
			state.visible = true;
			return {...state};
		},

		hideCommandPanel(state) {
			state.visible = false;
			return {...state};
		},

		goPrevCommand(state) {
			let index = state.currentIndex;
			let container = document.getElementById('toSetScrollTwo');
			let acvOpt = document.getElementById('activeFileOptionTwo');
			if (acvOpt.offsetTop - container.scrollTop < 150 && container.scrollTop != 0) {
				container.scrollTop -= acvOpt.offsetHeight;
			}

			if (index > 0) {
				state.currentIndex --;
				state.currentKey = state.shortcuts[index - 1].key;
			}
			
			return {...state}
		},

		goNextCommand(state) {
			let index = state.currentIndex;
			let acvOpt = document.getElementById('activeFileOptionTwo');
			let container = document.getElementById('toSetScrollTwo');
			if (index >= 4 && acvOpt.offsetTop - container.scrollTop >= acvOpt.offsetHeight * 4) {
				container.scrollTop = acvOpt.offsetHeight * (index - 4);
			}

			if (index < state.shortcuts.length - 1) {
				state.currentIndex ++;
				console.log(state.currentIndex)
				state.currentKey = state.shortcuts[index + 1].key;
			}
			
			return {...state}
		},

		handleInputChange(state,{payload: value}){

			state.inputValue = value;
			// var newFiles = new Array();

			// if(value != null && value != ''){
			// 	for(var i = 0; i<state.files.length; i++) {
			// 		if(state.files[i].text.indexOf(value) != -1){
			// 			newFiles.push(state.files[i]);
			// 		}
			// 		if(newFiles.length > 100){
			// 			break;
			// 		}
			// 	}
			// }

			// state.searchFilePane.files = newFiles;
			// state.searchFilePane.visible = true;

			state.searchFilePane.currentIndex = 0;
			if (value != '') {
				state.currentKey = state.shortcuts[0].key;
			}

			return {...state};
		},


	}
}