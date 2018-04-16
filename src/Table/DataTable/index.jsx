import React, { PureComponent } from 'react';
import Row from '../Row';
import './style.css';


class DataTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            style:{
                minHeight: props.containerHeight,
            },
            elContainerStyle:{
                top: props.top
            },
            isChanged: false,
            prevRenderedRows: [],
            data: props.data,
            renderedRows: props.data.length > 50 ? props.data.slice(0,50).map(this.renderRow) : props.data.map(this.renderRow)
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                style:{
                    minHeight: nextProps.containerHeight,
                },
                elContainerStyle:{
                    top: nextProps.top
                },
                renderedRows: nextProps.data.length > 50 ?
                    nextProps.data.slice(nextProps.minIndex, nextProps.maxIndex).map(this.renderRow)
                    :
                    nextProps.data.map(this.renderRow),
                data: nextProps.data
            });
        } else if (nextProps.maxIndex > this.props.maxIndex && nextProps.maxIndex < nextProps.dataLength) {
            let prevRenderedRows = this.state.renderedRows.slice(0, 10);
            prevRenderedRows = this.state.prevRenderedRows.concat(prevRenderedRows);
            const remainingRows = this.state.renderedRows.slice(10, 50);
            const newRow = this.renderNewRows(this.state.data.slice(this.props.maxIndex, nextProps.maxIndex), this.props.maxIndex);
            const renderedRows = remainingRows.concat(newRow);
            this.setState({
                style: {
                    minHeight: nextProps.containerHeight,
                },
                elContainerStyle:{
                    top: nextProps.top
                },
                prevRenderedRows,
                renderedRows
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
            <div className="data-table" style = {this.state.style}>
                <div className="data-table-container" style={this.state.elContainerStyle}>
                    {this.state.renderedRows}
                </div>
            </div>
        );
    }
}

export default DataTable;
