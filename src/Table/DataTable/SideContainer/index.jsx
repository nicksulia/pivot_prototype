import React, { PureComponent } from 'react';
import Row from '../../Row';
import './style.css';


class SideContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            left: props.left,
            step: props.step,
            data: props.data,
            renderedRows: props.data.length > 50 ? props.data.slice(0,49).map(this.renderRow) : props.data.map(this.renderRow)
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                renderedRows: nextProps.data.length > 50 ?
                    nextProps.data.slice(nextProps.minIndex, nextProps.maxIndex).map(this.renderRow)
                    :
                    nextProps.data.map(this.renderRow),
                data: nextProps.data,
                step: nextProps.step
            });
        } else if (nextProps.maxIndex > this.props.maxIndex && nextProps.maxIndex < nextProps.data.length) {
            const remainingRows = this.state.renderedRows.slice(10 - 1, 49);
            const newRows = this.renderNewRows(this.state.data.slice(this.props.maxIndex, nextProps.maxIndex), this.props.maxIndex);
            const renderedRows = remainingRows.concat(newRows);
            this.setState({
                renderedRows,
                step: nextProps.step
            })
        }
    }
    renderRow = (row, index) => {
        return <Row elements = {row} key = {`row-${index}`}/>
    }
    renderNewRows = (rows, currIndex) => {
        return rows.map((row, index) => (<Row elements = {row} key = {`row-${index + currIndex}`} />))
    }
    render() {
        return (
                <div className="side-table-container" style={this.props.style}>
                    {this.state.renderedRows}
                </div>
        );
    }
}

export default SideContainer;
