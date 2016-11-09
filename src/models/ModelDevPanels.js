import dva from 'dva';

export default {
	namespace: 'devpanels',
	state: {

		panes = [

			{ title: 'Tab 1', content:   
								<AceEditor
								    mode="javascript"
								    theme="github"
								    width="100%"
								    height="96vh"
								    onChange={onChange}
								    className={PanelStyle.aceEditor}
								    name="UNIQUE_ID_OF_DIV"
								    editorProps={{$blockScrolling: true}} />, 
	  	
	  		key: '1' },

	      	{ title: 'Tab 2', content: 'Content of Tab 2', key: '2' }
	    ],

	    activeKey: panes[0].key
	},

	reducers: {

		'delete'(state, {payload: id}) {

			console.log(state, id);

			return state.filter(item => item.id !== id);
		}

	}

}