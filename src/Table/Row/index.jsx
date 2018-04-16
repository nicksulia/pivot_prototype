import React, { Component } from 'react';
import Cell from '../Cell';
import './style.css';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                width: props.elements ? props.elements.length * 100 : 0
            },
            isChanged: false
        };
        if (props.elements && props.elements.length) {
            this.elements = this.renderElements(props.elements);
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.elements !== this.props.elements) {
            this.elements = this.renderElements(nextProps.elements);
            this.setState({
                isChanged: true
            })
        } else {
            this.elements = [];
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isChanged;
    }
    componentDidUpdate() {
        const { isChanged } = this.state;
        if (isChanged) {
            this.setState({
                isChanged: !isChanged
            });
        }
    }
    renderCell = (el, index) => {
        return <Cell data = {el} key = {`cell-${index}`}/>
    };
    renderElements = (elements = []) => {
        return elements.map(this.renderCell)
    };
    render() {
        return (
            <div className="row" style={this.state.style}>
                {this.elements}
            </div>
        );
    }
}

export default Row;
