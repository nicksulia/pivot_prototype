import React, { PureComponent } from 'react';
import Row from '../Row';
import './style.css';
//import SideContainer from './SideContainer'
import sideDataRender from './sidePanelDataRender.js';

class DataTable extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            sideData: sideDataRender(props.data.length),
            step: props.step,
            containerStyle: {
                minHeight: props.containerHeight,
            },
            elContainerStyle:{
                top: props.top
            },
            sidePanelStyle: {
                top: props.top,
                marginLeft: props.left
            },
            data: props.data,
            renderedRows: props.data.length > props.displayedElementsCount ? this.renderRows(props, 0, props.displayedElementsCount) : this.renderRows(props, 0, props.data.length - 1)
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                containerStyle:{
                    minHeight: nextProps.containerHeight,
                },
                elContainerStyle:{
                    top: nextProps.top
                },
                renderedRows: nextProps.data.length > nextProps.displayedElementsCount ?
                    nextProps.data.slice(nextProps.minIndex, nextProps.maxIndex).map(this.renderRow)
                    :
                    nextProps.data.map(this.renderRow),
                sideData: sideDataRender(nextProps.data.length),
                data: nextProps.data,
                step: nextProps.step
            });
        } else if (nextProps.maxIndex > this.props.maxIndex && nextProps.maxIndex <= nextProps.dataLength - 1) {
            let renderedRows;
            if(nextProps.maxIndex - this.props.maxIndex < nextProps.displayedElementsCount) {
                const remainingRows = this.state.renderedRows.slice(nextProps.maxIndex - this.props.maxIndex, nextProps.displayedElementsCount - 1);
                const newRows = this.renderNewRows(
                    nextProps.data.slice(this.props.maxIndex, nextProps.maxIndex),
                    this.props.maxIndex
                );
                renderedRows = remainingRows.concat(newRows);
            } else {
                renderedRows = this.renderRows(nextProps, nextProps.minIndex, nextProps.maxIndex);
            }

            this.setState({
                containerStyle: {
                    minHeight: nextProps.containerHeight,
                },
                elContainerStyle:{
                    top: nextProps.top
                },
                sidePanelStyle: {
                    top: nextProps.top,
                    marginLeft: nextProps.left
                },
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

    renderRows = (props, minIndex, maxIndex) => {
        return props.data.slice(minIndex, maxIndex).map((row, index) => (<Row elements = {row} key = {`row-${index + minIndex}`} />))
    }

    render() {
        const { minIndex, maxIndex, left } = this.props;
        const { elContainerStyle, sidePanelStyle, containerStyle, sideData } = this.state;
        return (
            <div className="data-table" style = {containerStyle}>
                {/*<SideContainer style={sidePanelStyle} minIndex={minIndex} maxIndex={maxIndex} data={sideData}/>*/}
                <div className="data-table-container" style={elContainerStyle}>
                    {this.state.renderedRows}
                </div>
            </div>
        );
    }
}

export default DataTable;
