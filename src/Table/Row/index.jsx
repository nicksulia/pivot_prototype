import React, { Component } from 'react';
import Cell from '../Cell';
import './style.css';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                width: props.elements ? props.elements.length * props.elementWidth : 0
            },
            elements:  props.elements
            && props.elements.length
            && this.renderElements(props.elements)
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.elements !== this.props.elements || nextProps.width !== this.props.width) {
            const elements = this.renderElements(nextProps.elements);
            this.setState({
                elements,
                style: {
                    width: nextProps.width
                }
            })
        } else if (nextProps.width !== this.props.width) {
            this.setState({
                style: {
                    width: nextProps.width
                }
            })
        }
    }

    renderCell = (el, index) => {
        return <Cell width={this.props.elementWidth} data = {el} key = {`cell-${index}`}/>
    };
    renderElements = (elements = []) => {
        return elements.map(this.renderCell)
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
