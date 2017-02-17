import React , {PropTypes} from 'react';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';


class Color extends React.Component {

	state = {
		styles: {
			colorPicker: {
				display: 'none'
			},

			displayBlock: {
				width: 100,
				height: 100,
				cursor: 'pointer',
				backgroundColor: '#123456'
			}
		},

		color: 'red'
	}

	componentDidMount() {
		this.setState({
			styles: {
				colorPicker: {
					display: 'none'
				},

				displayBlock: {
					width: 100,
					height: 100,
					cursor: 'pointer',
					backgroundColor: 'red'
				}
			}
		})
	}

	handleClick = (e) => {
		this.setState({
			styles: {
				colorPicker: {
					display: 'block'
				},

				displayBlock: {
					width: 100,
					height: 100,
					cursor: 'pointer',
					backgroundColor: '#123456'
				}
			},
		})
	}

	handleChangeComplete = (color) => {
		this.setState({ 
			color: color.hex,
			styles: {
			colorPicker: {
				display: 'none'
			},

			displayBlock: {
				width: 100,
				height: 100,
				cursor: 'pointer',
				backgroundColor: color.hex
			}
		},
		});
	}

	render() {
		const styles = this.state.styles;
		return (
				<div>
					<div onClick={this.handleClick} style={styles.displayBlock}></div>
					<div style={styles.colorPicker}>
						<SketchPicker color={ this.state.color } onChangeComplete={ this.handleChangeComplete } />
					</div>
				</div>
			)
	}
	
}

const ColorPicker = (props) => {
	return <Color/>
}

function mapStateToProps({}) {
  return {};
}

export default connect(mapStateToProps)(ColorPicker);
