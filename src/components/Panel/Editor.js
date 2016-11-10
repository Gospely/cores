import React , {PropTypes} from 'react';
import AceEditor from 'react-ace';
import EditorStyle from './Editor.css';

import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';

import EditorTop from './EditorTop';

const Editor = () => {

  return (
	<p className={EditorStyle.aceEditor}>
		<EditorTop></EditorTop>
		<AceEditor
	        mode="javascript"
	        theme="github"
	        width="100%"
	        height="92vh"
	        name="UNIQUE_ID_OF_DIV"
	        editorProps={{$blockScrolling: true}} />
  	</p>
  );

};

export default Editor;
