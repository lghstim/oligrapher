import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { DraggableCore } from 'react-draggable';
import ds from '../CaptionDisplaySettings';
import { merge } from 'lodash';

export default class Caption extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop', '_handleClick');
    this.state = props.caption.display;
  }

  render() {
    let { x, y, text, scale } = this.state;
    let transform = `translate(${x}, ${y})`;

    return (
      <DraggableCore
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}>
        <g className="caption" transform={transform} onClick={this._handleClick}>
          { this.props.selected ? this._selectionRect() : null }
          <text className="handle" fontSize={scale * 15}>{text}</text>
        </g>
      </DraggableCore>
    );
  }

  componentWillReceiveProps(props) {
    let newState = merge({ text: null }, props.caption.display);
    this.setState(newState);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selected !== this.props.selected || 
           JSON.stringify(nextState) !== JSON.stringify(this.state);
  }

  _handleDragStart(e, ui) {
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };
  }

  _handleDrag(e, ui) {
    if (this.props.isLocked) return;

    this._dragging = true;

    let deltaX = (ui.position.clientX - this._startDrag.clientX) / this.graph.state.actualZoom;
    let deltaY = (ui.position.clientY - this._startDrag.clientY) / this.graph.state.actualZoom;
    let x = this._startPosition.x + deltaX;
    let y = this._startPosition.y + deltaY;

    this.setState({ x, y });
  }

  _handleDragStop(e, ui) {
    // event fires every mouseup so we check for actual drag before updating store
    if (this._dragging) {
      this.props.moveCaption(this.props.graphId, this.props.caption.id, this.state.x, this.state.y);
    }
  }

  _handleClick() {
    if (this._dragging) {
      this._dragging = false;
    } else if (this.props.clickCaption) {
      this.props.clickCaption(this.props.graphId, this.props.caption.id);
    }
  }

  _selectionRect() {
    let width = this.state.text.length * 8;
    let height = ds.lineHeight;
    return (
      <rect
        fill={ds.selectFillColor}
        opacity={ds.selectOpacity}
        rx={ds.cornerRadius}
        ry={ds.cornerRadius}
        y={-height + 4}
        width={width}
        height={height} />
    );

  }
}