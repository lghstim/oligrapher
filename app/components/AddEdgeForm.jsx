import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy';
import { HotKeys } from 'react-hotkeys';

export default class AddEdgeForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleSubmit');
  }

  render() {
    let node1Id, node2Id;

    const scales = [
      [null, "Scale"],
      [1, "1x"],
      [1.5, "1.5x"],
      [2, "2x"],
      [3, "3x"]
    ];

    if (Array.isArray(this.props.data) && this.props.data.length == 2) {
      node1Id = this.props.data[0].id;
      node2Id = this.props.data[1].id;
    } else {
      node1Id = this.props.data ? this.props.data.id : null;
      node2Id = null;
    }

    const keyMap = { 
      'altN': ['alt+n', 'ctrl+n'],
      'esc': 'esc'
    };

    const keyHandlers = {
      'altN': () => this.props.closeAddForm(),
      'esc': () => this._clear()
    };

    let nodes = sortBy(values(this.props.nodes), (node) => node.display.name);

    return (
      <div id="addEdgeForm" className="editForm accordianMenuForm">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <form onSubmit={this._handleSubmit}>
            <span>
              <label>From:</label>
              <select defaultValue={node1Id} className="form-control input-sm" ref="node1Id">
                <option value="">Node 1</option>
                { nodes.map((node, i) =>
                  <option key={node.id} value={node.id}>{node.display.name}</option>
                ) }
              </select>
            </span>
            <span>
            <label>To:</label>
            <select defaultValue={node2Id} className="form-control input-sm" ref="node2Id">
              <option value="">Node 2</option>
              { nodes.map((node, i) =>
                <option key={node.id} value={node.id}>{node.display.name}</option>
              ) }
            </select>
            </span>
            <span className = "addToolsCheckboxes">
              <label>Arrow:</label>
              <input 
                type="checkbox" 
                ref="arrow"  />
              <label>Dash:</label>
              <input 
                type="checkbox" 
                ref="dash" />
            </span>
            <span>
              <label>Weight:</label>
              <select
                defaultValue={1} 
                className="form-control input-sm" 
                ref="scale" >
                { scales.map((scale, i) =>
                  <option key={scale[1]} value={scale[0]}>{scale[1]}</option>
                ) }
              </select>
            </span>
            <span>
              <label>Link:</label>
              <input type="text" placeholder="link URL" className="form-control input-sm" ref="url" />
            </span>
            <span>
              <label>Label:</label>
              <input type="text" placeholder="label" className="form-control input-sm" ref="label" />
            </span>
          </form>
        </HotKeys>
      </div>
    );
  }

  _handleSubmit(e) {
    let node1Id = this.refs.node1Id.value;
    let node2Id = this.refs.node2Id.value;
    let label = this.refs.label.value.trim();
    let arrow = this.refs.arrow.checked;
    let dash = this.refs.dash.checked;
    let scale = parseFloat(this.refs.scale.value);
    let url = this.refs.url.value.trim();

    if (node1Id && node2Id) {
      this.props.addEdge({ node1_id: node1Id, node2_id: node2Id, display: { label, arrow, dash, scale, url } });
      this._clear();
      this.props.closeAddForm();      
    }

    if (e != undefined){
      e.preventDefault();
    }
  }

  _clear() {
    this.refs.node1Id.value = '';
    this.refs.node2Id.value = '';
    this.refs.label.value = '';
  }
}