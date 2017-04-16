import React , {PropTypes} from 'react';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import { Popover } from 'antd';

/*
使用方法
let colorTest = {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    };

const handleChangeComplete = function (color) {
	colorTest = color.rgb;
	console.log(colorTest)
}
<ColorPicker onChangeComplete={handleChangeComplete} color={colorTest} placement='left' style={{height: '20px'}} onVisibleChange={onVisibleChange}/>
前两个参数为必选
*/

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
		let rgba = color.rgb;
		this.setState({
			color: rgba
		})
		color.target = {};
		color.target.value = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
		this.props.onChangeComplete(color)
	}

	render() {
		const styles = this.state.styles;
		const color = this.state.color;
		let displayColor;
		if (color.r !== undefined) {
			displayColor = 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
		}else {
			displayColor = color;
		}

		return (<Popover
			        content={<SketchPicker color={ color } onChangeComplete={ this.onChangeComplete } />}
			        title="颜色面板"
			        trigger="click"
			        placement={this.props.placement || 'left'}
			        onVisibleChange={this.props.onVisibleChange}
			      >
			        <div style={{width: '100%', padding: 5, height: 22, border: '1px solid #e9e9e9', marginTop: '5px', borderRadius: '5px',...this.props.style}}>
						<div style={{...styles.displayBlock, backgroundColor: displayColor}}></div>
					</div>
			    </Popover>)
	}
	
}

export default ColorPicker
