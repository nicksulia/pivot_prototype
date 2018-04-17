import React, { PureComponent } from 'react';
import Row from '../Row';
import './style.css';
import SideContainer from './SideContainer'
import sideDataRender from './sidePanelDataRender.js';

class DataTable extends PureComponent {

    sidePanelData = new Array(500).map((el, index) => [ 'row-header-' + index ]);

    constructor(props) {
        super(props);
        this.state = {
            sideData: sideDataRender(props.data.length),
            step: props.step,
            style:{
                minHeight: props.containerHeight,
            },
            elContainerStyle:{
                top: props.top
            },
            isChanged: false,
            prevRenderedRows: [],
            data: props.data,
            renderedRows: props.data.length > 50 ? props.data.slice(0,49).map(this.renderRow) : props.data.map(this.renderRow)
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
                sideData: sideDataRender(nextProps.data.length),
                data: nextProps.data,
                step: nextProps.step
            });
        } else if (nextProps.maxIndex > this.props.maxIndex && nextProps.maxIndex < nextProps.dataLength) {
            let prevRenderedRows = this.state.renderedRows.slice(0, 10 - 1);
            prevRenderedRows = this.state.prevRenderedRows.concat(prevRenderedRows);
            const remainingRows = this.state.renderedRows.slice(10 - 1, 49);
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
        const { minIndex, maxIndex } = this.props;
        const { elContainerStyle } = this.state;
        return (
            <div className="data-table" style = {this.state.style}>
                <SideContainer elContainerStyle={elContainerStyle} minIndex={minIndex} maxIndex={maxIndex} data={this.state.sideData}/>
                <div className="data-table-container" style={this.state.elContainerStyle}>
                    {this.state.renderedRows}
                </div>
            </div>
        );
    }
}

export default DataTable;
