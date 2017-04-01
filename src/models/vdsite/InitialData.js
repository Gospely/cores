import vdpm from './initialDataFolder/vdpm.js';
import vdanimations from './initialDataFolder/vdanimations.js';
import vdctrl from './initialDataFolder/vdctrl.js';
import vdstyles from './initialDataFolder/vdstyles.js';
import vdCtrlTree from './initialDataFolder/vdCtrlTree.js';

/*

	1.所有的初始化数据都在这里读区，加载代码写在每个model的subscriptions里
	2.新建应用的初始化数据，从这里读取
	3.读取旧应用时从服务器拉取
	4.以后改数据结构改这个文件下的文件即可
	5.以前的加载流程可能要做更改

*/

export default {

	vdpm: vdpm,

	vdCtrlTree: vdCtrlTree,

	vdstyles: vdstyles,

	vdctrl: vdctrl,

	vdanimations: vdanimations

}