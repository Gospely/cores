import React , {PropTypes} from 'react';
import { connect } from 'dva';

import { Button, Menu, Dropdown, Icon } from 'antd';

const Welcome = (props) => {

  	return (
		<div>

			您没有打开任何面板

		</div>
  	);

};

function mapSateToProps({ designer }) {
	return { designer };
}

export default connect(mapSateToProps)(Welcome);
