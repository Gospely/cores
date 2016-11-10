import React , {PropTypes} from 'react';
import AceEditor from 'react-ace';
import EditorStyle from './Editor.css';
import { Button, Icon, Input, Switch, Menu, Dropdown } from 'antd';
import { Row, Col } from 'antd';

const ButtonGroup  = Button.Group;

const EditorTop = ({
	onSave,

	onOpenSearch,
	searchVisible,

	onOpenJumpLine,
	jumpLineVisible,

	onSlideUp,

	onSearch,
	onSearchPrev,
	onSearchNext,
	onReplace,
	isSearchAll,
	onSearchAll,
	searchContent,
	replaceContent,

	onJumpLine,
	jumpLine,
	onSelectSyntax,

	syntaxList
}) => {

	var styles = {
		margin: {
			marginRight: '10px',
			marginLeft: '30px'
		}
	};

	const menu = (
	  	<Menu onClick={onSelectSyntax}>
	    	<Menu.Item key="1">HTML</Menu.Item>
	    	<Menu.Item key="2">CSS</Menu.Item>
	    	<Menu.Item key="3">JavaScript</Menu.Item>
	    	<Menu.Item key="4">Shell</Menu.Item>
	    	<Menu.Item key="5">Java</Menu.Item>
	    	<Menu.Item key="6">C/C++</Menu.Item>
	  	</Menu>
	);

  	return (
		<div className={EditorStyle.topbar}>
			<ButtonGroup>
				<Button onClick={onSave} className={EditorStyle.topbarBtn}><Icon type="save" />保存</Button>
				<Button onClick={onOpenSearch} className={EditorStyle.topbarBtn}><Icon type="search" />搜索</Button>
			</ButtonGroup>
			<div className={EditorStyle.topbarRight}>
				<ButtonGroup>
					<Button onClick={onOpenJumpLine} className={EditorStyle.topbarBtn}>行: 4 列: 32</Button>
					<Dropdown overlay={menu} trigger={['click']}>
						<Button className={EditorStyle.topbarBtn}>JavaScript</Button>
					</Dropdown>
					<Button onClick={onSlideUp} className={EditorStyle.topbarBtn}><Icon type="up" /></Button>
				</ButtonGroup>
			</div>
			<div className={EditorStyle.searchBar}>
			    <Row gutter={16}>
			      	<Col className="gutter-row" span={6}>
			        	<div className="gutter-box">
						    <Input value={searchContent} className={EditorStyle.textarea} type="textarea" placeholder="搜索文本..." autosize />
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
						    <Input value={replaceContent} className={EditorStyle.textarea} type="textarea" placeholder="请输入要替换成的文本..." autosize />
			        	</div>
			      	</Col>
			      	<Col className="gutter-row" span={6}>
			        	<div className="gutter-box">
				        	<Switch checked={isSearchAll} onChange={onSearchAll} checkedChildren={'全部'} unCheckedChildren={'单个'} />
		        		    <Button onClick={onReplace} type="ghost" style={styles.margin} shape="circle-outline" icon="check" />
			        	</div>
			      	</Col>
			    </Row>
			</div>
			<div className={EditorStyle.jumpLine}>
				跳行至: <Input value={jumpLine} defaultValue="0:0" />
			</div>
		</div>
  	);

};

export default EditorTop;
