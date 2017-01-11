import React , {PropTypes} from 'react';
import AceEditor from 'react-ace';
import EditorStyle from './Editor.css';
import { Button, Icon, Input, Switch, Menu, Dropdown } from 'antd';
import { Row, Col } from 'antd';

const ButtonGroup  = Button.Group;

const EditorTop = ({
	onSave,
	isSaving,

	onOpenSearch,
	searchVisible,

	onOpenJumpLine,
	jumpLineVisible,

	onSlideUp,
	isSlideUp,

	onSearch,
	onSearchPrev,
	onSearchNext,
	onReplace,
	isReplaceAll,
	searchContent,
	replaceContent,

	onJumpLine,
	jumpLine,

	onSelectSyntax,
	onSelectTheme,
	
	currentLanguage,
	currentTheme,

	syntaxList,
	themeList,

	handleReplaceInputChange,
	handleSearchInputChange,
	handleSearchAllSwitchChange,
	handleJumpLineChange
}) => {

	var styles = {
		margin: {
			marginRight: '10px',
		}
	};

	// const menuItem = syntaxList.map(syntax => (
	// 	<Menu.Item key={syntax.key}>{syntax.language}</Menu.Item>
	// ));

	// const menu = (
	//   	<Menu onSelect={onSelectSyntax}>
	//     	{menuItem}
	//   	</Menu>
	// );

	const generateMenu = function (menuList, selectOption, title) {
		const menuItem = menuList.map(menu => (
			<Menu.Item key={menu.key}>{menu[title]}</Menu.Item>
		));
		return (
			<Menu onSelect={selectOption}>
				{menuItem}
			</Menu>
		)
	}

	const syntaxMenu = generateMenu(syntaxList, onSelectSyntax, 'language');

	const themeMenu = generateMenu(themeList, onSelectTheme, 'name');

	const refreshPage = () => { location.reload(); };

	// <Dropdown overlay={themeMenu} trigger={['click']}>
	// 	<Button className={EditorStyle.topbarBtn}>{currentTheme}</Button>
	// </Dropdown>

  	return (
		<div className={EditorStyle.topbar}>
			<ButtonGroup>
				<Button onClick={onSave} className={EditorStyle.topbarBtn}>{!isSaving ? <Icon type="save" /> : <Icon type="loading" />}保存</Button>
			</ButtonGroup>
			<div className={EditorStyle.topbarRight}>
				<ButtonGroup>
					<Button onClick={refreshPage} className={EditorStyle.topbarBtn}>编辑器无法使用？点我</Button>
					<Button style={{display:'none'}} onClick={onOpenJumpLine} className={EditorStyle.topbarBtn}>行: 4 列: 32</Button>
					<Dropdown overlay={syntaxMenu} trigger={['click']}>
						<Button className={EditorStyle.topbarBtn}>{currentLanguage}</Button>
					</Dropdown>
					<Button onClick={onSlideUp} className={EditorStyle.topbarBtn}>{isSlideUp ? <Icon type="down" /> : <Icon type="up" />}</Button>
				</ButtonGroup>
			</div>
			{searchVisible &&
				<div className={EditorStyle.searchBar}>
				    <Row gutter={16}>
				      	<Col className="gutter-row" span={6}>
				        	<div className="gutter-box">
							    <Input value={searchContent} onChange={handleSearchInputChange} className={EditorStyle.textarea} type="textarea" placeholder="搜索文本..." autosize />
				        	</div>
				      	</Col>
				      	<Col className="gutter-row" span={3}>
				        	<div className="gutter-box">
			        		    <Button onClick={onSearchPrev} type="ghost" style={styles.margin} shape="circle-outline" icon="left" />
			        		    <Button onClick={onSearchNext} type="ghost" shape="circle-outline" icon="right" />
				        	</div>
				      	</Col>
				      	<Col className="gutter-row" span={6}>
				        	<div className="gutter-box">
							    <Input value={replaceContent} onChange={handleReplaceInputChange} className={EditorStyle.textarea} type="textarea" placeholder="请输入要替换成的文本..." autosize />
				        	</div>
				      	</Col>
				      	<Col className="gutter-row" span={6}>
				        	<div className="gutter-box">
					        	<Switch onChange={handleSearchAllSwitchChange} checkedChildren={'全部'} unCheckedChildren={'单个'} />
			        		    <Button onClick={onReplace} type="ghost" style={styles.margin} shape="circle-outline" icon="check" />
				        	</div>
				      	</Col>
				    </Row>
				</div>
			}
			{jumpLineVisible &&
				<div className={EditorStyle.jumpLine}>
					跳行至: <Input value={jumpLine} onChange={handleJumpLineChange} defaultValue="0:0" />
				</div>
			}
		</div>
  	);

};

export default EditorTop;
