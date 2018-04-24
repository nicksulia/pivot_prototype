import React, { Component } from 'react';
import Cell from '../Cell';
import './style.css';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements:  props.elements
            && props.elements.length
            && this.renderElements(props),
            style: {

            }
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.elements !== this.props.elements
            || nextProps.colWidth !== this.props.colWidth
            || nextProps.height !== this.props.height) {
            const elements = this.renderElements(nextProps);
            this.setState({
                elements,
                style: {
                    height: nextProps.height,
                    width: this.getTotalWidth(nextProps)
                }
            })
        }
    }

    getTotalWidth = (nextProps) => nextProps.colWidth.reduce((curr, next) => curr + next);

    // renderCell = (el, index) => {
    //     return <Cell width={this.props.colWidth[index]} data = {el} key = {`cell-${index}`}/>
    // };
    renderElements = (props) => {
        return props.elements && props.elements.map((el, index) => {
            return <Cell width={props.colWidth[index]} data = {el} key = {`cell-${index}`}/>
        })
    };
    render() {
        return (
            <div className="row" style={this.state.style}>
                {this.state.elements}
            </div>
        );
    }
}

export default Row;
