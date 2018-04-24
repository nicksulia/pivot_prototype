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
            renderedRows: props.dataLength ?
                props.dataLength > props.displayedElementsCount ?
                    this.renderRows(props, 0, props.displayedElementsCount - 1)
                    : this.renderRows(props, 0, props.dataLength - 1)
                : []
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setNewState(nextProps);
        } else if(nextProps.left !== this.props.left) {
            this.updateByHorizontalScroll(nextProps);
        } else if (nextProps.maxIndex !== this.props.maxIndex
            && nextProps.maxIndex <= nextProps.dataLength
            && nextProps.minIndex >= 0) {
            this.updateElementsByIndex(nextProps);
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
        const oldMinIndex = this.props.minIndex;
        let renderedRows;
        if (oldMinIndex > minIndex) {
            if (oldMinIndex - minIndex < displayedElementsCount) {
                const remainingRows = this.state.renderedRows.slice(maxIndex, oldMaxIndex);
                const newRows = this.renderNewRows(
                    data.slice(minIndex, maxIndex),
                    minIndex
                );
                renderedRows = newRows.concat(remainingRows);
            } else {
                renderedRows = this.renderRows(nextProps, minIndex, maxIndex);
            }
        } else if (maxIndex - oldMaxIndex < displayedElementsCount) {
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
        })
    }

    setNewState = (nextProps) => {
        const { containerHeight, displayedElementsCount, data, top } = nextProps;
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
            data
        });
    }

    renderNewRows = (rows, currIndex) => {
        return rows.map((row, index) => (<Row colWidth={this.props.colWidth}
                                              height = {this.props.rowHeight[`${index + currIndex}`]}
                                              elements={row} key = {`row-${index + currIndex}`} />))
    }

    renderRows = (props, minIndex, maxIndex) => {
        return props.data.slice(minIndex, maxIndex).map(
            (row, index) =>
                (<Row colWidth={props.colWidth}
                      height = {this.props.rowHeight[`${index + minIndex}`]}
                      elements={row} key = {`row-${index + minIndex}`} />)
        )
    }

    render() {
        const { minIndex, maxIndex, displayedElementsCount, dataLength } = this.props;
        const { elContainerStyle, sidePanelStyle, containerStyle, sideData } = this.state;
        return (
            <div className="data-table" style = {containerStyle}>
                {/*<SideContainer dataLength={dataLength} displayedElementsCount={displayedElementsCount} style={sidePanelStyle} minIndex={minIndex} maxIndex={maxIndex} data={sideData}/>*/}
                <div className="data-table-container" style={elContainerStyle}>
                    {this.state.renderedRows}
                </div>
            </div>
        );
    }
}

export default DataTable;
