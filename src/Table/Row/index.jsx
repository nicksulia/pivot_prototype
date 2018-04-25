import React, { PureComponent } from 'react';
import Cell from '../Cell';
import './style.css';

class Row extends PureComponent {
    constructor(props) {
        super(props);
        this.renderElements = this.renderElements.bind(this);
    }
    componentWillReceiveProps(nextProps) {

    }
    renderElements() {
        const { elements, columnWidth } = this.props;
        return elements.length ? elements.map((el, index) => {
            return <Cell
                width = {columnWidth[index]}
                data = {el}
                key = {`cell-${index}`}/>
        }) : <div>Loading...</div>
    };
    render() {
        const { rowHeight } = this.props;
        return (
            <div className="row" style={{ height: rowHeight }}>
                { this.renderElements() }
            </div>
        );
    }
}

export default Row;
