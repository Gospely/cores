import React , {PropTypes} from 'react';
import { Tree, Collapse } from 'antd';
import { Button, Icon } from 'antd';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { Menu, Switch, Input } from 'antd';
import { packUIStage } from '../../utils/packUIState.js';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const ButtonGroup = Button.Group;
const TreeNode = Tree.TreeNode;
const Panel = Collapse.Panel;

const SettingPanel = (props) => {

	// var UIState = packUIStage(state);

		// app._store.dispatch({
		// 	type: 'UIState/writeConfig',
		// 	payload: {
		// 		id: '',
		// 		application: '',
		// 		creator: '',
		// 		configs: UIState
		// 	}
		// })
		// console.log('onStateChange', UIState, app);
	

	const GitSettingProps = {
		onClick: function(item) {

			console.log(item);

			var action = {

				origin: function() {
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				}
			}

			action[item.key]();

		}
	}
	const SyncProps = {
		onClick: function(item) {

			console.log(item);

			var action = {

				origin: function() {
					props.dispatch({
						type: 'sidebar/showModalModifyGitOrgin'
					})
				},
				autoSave: function () {

				},
				autoSaveInterval: function () {

				}
			}

			action[item.key]();

		},
		switchAutoSave(checked) {
			props.dispatch({
				type: 'UIState/setDySave',
				payload: {checked}
			})
		},
		setAutoSaveInterval(e) {
			props.dispatch({
				type: 'UIState/setDySaveGap',
				payload: {val: e.target.value}
			})
		}

	}

	const GitSetting = (
      	<Menu onClick={GitSettingProps.onClick}
        	style={{ width: '100%' }}
        	defaultOpenKeys={['origin']}
        	mode="inline"
      	>
	        <Menu.Item key="origin">
				<span>查看/修改源</span>
	        </Menu.Item>
      	</Menu>
	);
	//修改主题的Menu
	// <Menu.Item key="origin">
	// 	<span>修改主题</span>
	// </Menu.Item>
	const Sync = (
				<Menu onClick={SyncProps.onClick}
					style={{ width: '100%' }}
					defaultOpenKeys={['origin']}
					mode="inline"
				>
					<Menu.Item key="autoSave">
						<span>自动保存：</span>
						<Switch defaultChecked={props.UIState.dySave} onChange={SyncProps.switchAutoSave} />
					</Menu.Item>
					<Menu.Item key="autoSaveInterval">
						<span>时间间隔：</span>
						<Input disabled={!props.UIState.dySave} style={{width: '50%'}}
						onChange={SyncProps.setAutoSaveInterval}
						value={props.UIState.gap}
						placeholder="200000" />
						<span> /ms </span>
					</Menu.Item>
				</Menu>
	);

  	return (

		<Collapse className="settingCollapse" bordered={false} defaultActiveKey={['1']}>
		    <Panel header="GIT 设置" key="1">
		      	{GitSetting}
		    </Panel>
		    <Panel header="同步 设置" key="2">
		      	{Sync}
		    </Panel>
		</Collapse>

  	);

};

function mapStateToProps({ UIState }) {
  return { UIState };
}

export default connect(mapStateToProps)(SettingPanel);
