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
                height: props.height
            }
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.elements !== this.props.elements) {
            const elements = this.renderElements(nextProps);
            this.setState({
                style: {
                    height: nextProps.height,
                },
                elements
            });
        } else if (nextProps.height !== this.props.height) {
            this.setState({
                style: {
                    height: nextProps.height,
                }
            });
        }
    }

    getTotalWidth = (nextProps) => nextProps.colWidth.reduce((curr, next) => curr + next);

    renderElements = (props) => {
        return props.elements && props.elements.map((el, index) => {
            return <Cell
                width={props.colWidth[index]}
                data = {el}
                key = {`cell-${index}`}/>
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
