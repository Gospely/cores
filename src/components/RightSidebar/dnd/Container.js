import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Target from './Target';
import Source from './Source';

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  render() {
    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Target />
        </div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <Source name='Glass' />
          <Source name='Banana' />
          <Source name='Paper' />
        </div>
      </div>
    );
  }
}