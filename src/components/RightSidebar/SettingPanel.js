import React , {PropTypes} from 'react';
import { Tree, Collapse } from 'antd';
import { Button, Icon } from 'antd';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const ButtonGroup = Button.Group;
const TreeNode = Tree.TreeNode;
const Panel = Collapse.Panel;

const SettingPanel = (props) => {

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
	const ThemeProps = {
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

	const GitSetting = (
      	<Menu onClick={ThemeProps.onClick}
        	style={{ width: '100%' }}
        	defaultOpenKeys={['origin']}
        	mode="inline"
      	>
	        <Menu.Item key="origin">
				<span>查看/修改源</span>
	        </Menu.Item>
      	</Menu>
	);
	const Themes = (
				<Menu onClick={ThemeProps.onClick}
					style={{ width: '100%' }}
					defaultOpenKeys={['origin']}
					mode="inline"
				>
					<Menu.Item key="origin">
				<span>修改主题</span>
					</Menu.Item>
				</Menu>
	);

  	return (

		<Collapse className="settingCollapse" bordered={false} defaultActiveKey={['1']}>
		    <Panel header="GIT 设置" key="1">
		      	{GitSetting}
		    </Panel>
		    <Panel header="主题 设置" key="2">
		      	{Themes}
		    </Panel>
		</Collapse>

  	);

};

export default connect()(SettingPanel);
