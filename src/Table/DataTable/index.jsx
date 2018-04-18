import React, { PureComponent } from 'react';
import Row from '../Row';
import './style.css';
import SideContainer from './SideContainer'
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
            renderedRows: props.data.length > props.displayedElementsCount ? this.renderRows(props, 0, props.displayedElementsCount - 1) : this.renderRows(props, 0, props.data.length - 1)
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setNewState(nextProps);
        } else if (nextProps.maxIndex > this.props.maxIndex && nextProps.maxIndex <= nextProps.dataLength) {
            this.updateElementsByIndex(nextProps);
        } else if(nextProps.left !== this.props.left) {
            this.updateByHorizontalScroll(nextProps);
        }
    }

    updateByHorizontalScroll = ({ top, left }) => {
        this.setState({
            sidePanelStyle: {
                top,
                marginLeft: left
            }
        })
    }

    updateElementsByIndex = (nextProps) => {
        const { maxIndex, displayedElementsCount, data, minIndex } = nextProps;
        const oldMaxIndex = this.props.maxIndex;
        let renderedRows;
        if (maxIndex - oldMaxIndex < displayedElementsCount) {
            const remainingRows = this.state.renderedRows.slice(maxIndex - oldMaxIndex, displayedElementsCount);
            const newRows = this.renderNewRows(
                data.slice(oldMaxIndex, maxIndex),
                oldMaxIndex
            );
            renderedRows = remainingRows.concat(newRows);
        } else {
            renderedRows = this.renderRows(nextProps, minIndex, maxIndex);
        }
        this.setState({
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

    setNewState = (nextProps) => {
        const { containerHeight, displayedElementsCount, data, top, step } = nextProps;
        this.setState({
            containerStyle:{
                minHeight: containerHeight,
            },
            elContainerStyle:{
                top: top
            },
            renderedRows: data.length > displayedElementsCount ?
                this.renderRows(nextProps, 0, displayedElementsCount)
                :
                this.renderRows(nextProps, 0, data.length),
            sideData: sideDataRender(data.length),
            data,
            step
        });
    }

    renderNewRows = (rows, currIndex) => {
        return rows.map((row, index) => (<Row elements = {row} key = {`row-${index + currIndex}`} />))
    }

    renderRows = (props, minIndex, maxIndex) => {
        return props.data.slice(minIndex, maxIndex).map((row, index) => (<Row elements = {row} key = {`row-${index + minIndex}`} />))
    }

    render() {
        const { minIndex, maxIndex, left, displayedElementsCount } = this.props;
        const { elContainerStyle, sidePanelStyle, containerStyle, sideData } = this.state;
        return (
            <div className="data-table" style = {containerStyle}>
                <SideContainer displayedElementsCount={displayedElementsCount} style={sidePanelStyle} minIndex={minIndex} maxIndex={maxIndex} data={sideData}/>
                <div className="data-table-container" style={elContainerStyle}>
                    {this.state.renderedRows}
                </div>
            </div>
        );
    }
}

export default DataTable;
