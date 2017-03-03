import React , {PropTypes} from 'react';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import { Popover } from 'antd';

//使用方法
// let colorTest = {
//       r: '241',
//       g: '112',
//       b: '19',
//       a: '1',
//     };

// const handleChangeComplete = function (color) {
// 	colorTest = color.rgb;
// 	console.log(colorTest)
// }
//<ColorPicker onChangeComplete={handleChangeComplete} color={colorTest} placement='left' />

class ColorPicker extends React.Component {

	state = {
		styles: {
			displayBlock: {
				height: '100%',
				cursor: 'pointer',
				backgroundColor: '#123456'
			}
		},

		color: this.props.color,
	}

	onChangeComplete = (color) => {
		this.setState({
			color: color.rgb
		})
		this.props.onChangeComplete(color)
	}

	render() {
		const styles = this.state.styles;
		const color = this.state.color;
		return (<Popover
			        content={<SketchPicker color={ color } onChangeComplete={ this.onChangeComplete } />}
			        title="颜色面板"
			        trigger="click"
			        placement={this.props.placement || 'left'}
			      >
			        <div style={{width: '100%', padding: 5, height: 22, border: '1px solid #e9e9e9', marginTop: '6px'}}>
						<div style={{...styles.displayBlock, backgroundColor: 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')'}}></div>
					</div>
			    </Popover>)
	}
	
}

export default ColorPicker
