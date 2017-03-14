import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Modal } from 'antd';
import { Tabs, Icon } from 'antd';
import { Tooltip } from 'antd';
import { Collapse } from 'antd';
import { Row, Col } from 'antd';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

// window.VDDnddata = '';

const Component = (props) => {

	const VDControllersProps = {
		onSelect(ctrl) {
			window.VDDnddata = ctrl;
		}
	}
	console.log(props.vdctrl.controllers);
	const panels = props.vdctrl.controllers.map((item, i) => {

		console.log(item);
		console.log(i);
		if(item.content) {
			const
				contentLength = item.content.length,
				rowCount = contentLength / 3,
				rowGenerator = (rowCount) => {
					let rows = [];
					for (var j = 0; j < rowCount; j++) {

						let
							ctrlTplGenerator = (index) => {
								let panelCtrl = item.content.map((ctrl, j) => {
									if(j < index + 3 && j >= index) {
										return (
									    	<Col key={ctrl.key} span={8}>
									    		<div className="anticons-list-item" onMouseDown={VDControllersProps.onSelect.bind(this, ctrl)}>
									    			<span dangerouslySetInnerHTML={{__html: ctrl.icon}}>{console.log(typeof ctrl.icon, ctrl.icon)}</span>
									    			<div className="anticon-class">{ctrl.name}</div>
									    		</div>
									    	</Col>
										);
									}
								});

								panelCtrl = (
									<Row key={index}>
										{panelCtrl}
									</Row>
								);

								return panelCtrl;
							}

						rows.push(ctrlTplGenerator(j * 3));
					};
					return rows;
				},

				rows = rowGenerator(rowCount);

			return (
				<Panel header={item.name} key={item.key}>
			      	{rows}
			    </Panel>
			);
		}
	})

	console.log(panels);

  	return (
  		<div className="vdctrl-pane-wrapper">
			<Collapse bordered={false} defaultActiveKey={['layout', 'basic', 'typo', 'media', 'forms', 'components']}>
			    {panels}
			</Collapse>
  		</div>
  	);

};

function mapSateToProps({ vdctrl }) {
  return { vdctrl };
}

export default connect(mapSateToProps)(Component);
