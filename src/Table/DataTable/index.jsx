import React, { PureComponent } from 'react';
import Row from '../Row';
import './style.css';
import SideContainer from './SideContainer'
import sideDataRender from './sidePanelDataRender.js';

class DataTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderedRows: props.dataLength ? this.renderRows() : []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                renderedRows: this.renderRows(nextProps)
            })
        } else {
            const { maxIndex, minIndex, displayedElementsCount, data } = nextProps;
            const [ oldMaxIndex, oldMinIndex ] = [this.props.maxIndex, this.props.minIndex];
            const { renderedRows } = this.state;
            let newRenderedRows = [];
            if (oldMinIndex > minIndex) {
                if (oldMinIndex - minIndex < displayedElementsCount) {
                    const remainingRows = renderedRows.slice(0, displayedElementsCount - (oldMinIndex - minIndex));
                    const nextKeys = new Array(oldMinIndex - minIndex);
                    renderedRows
                        .slice(displayedElementsCount - (oldMinIndex - minIndex), displayedElementsCount)
                        .forEach((element, index) => {
                            nextKeys[index] = element.key;
                        });
                    const newRows = this.renderRowsWithCustomIndex(
                        nextProps,
                        data.slice(minIndex, oldMinIndex),
                        nextKeys,
                        minIndex
                    );
                    newRenderedRows = newRows.concat(remainingRows);
                } else {
                    newRenderedRows = this.renderRows(nextProps, minIndex, maxIndex);
                }
                this.setState({
                    renderedRows: newRenderedRows
                })
            } else {
                if (maxIndex - oldMaxIndex < displayedElementsCount) {
                    const remainingRows = renderedRows.slice(maxIndex - oldMaxIndex, displayedElementsCount);
                    const nextKeys = new Array(maxIndex - oldMaxIndex);
                    renderedRows
                        .slice(0, maxIndex - oldMaxIndex)
                        .forEach((element, index) => {
                            nextKeys[index] = element.key;
                        });
                    const newRows = this.renderRowsWithCustomIndex(
                        nextProps,
                        data.slice(oldMaxIndex, maxIndex),
                        nextKeys,
                        oldMaxIndex
                    );
                    newRenderedRows = remainingRows.concat(newRows);
                } else {
                    newRenderedRows = this.renderRows(nextProps, minIndex, maxIndex);
                }
                this.setState({
                    renderedRows: newRenderedRows
                })
            }
            if (nextProps.colWidth.length
                && this.props.colWidth.length
                && nextProps.colWidth !== this.props.colWidth) {
                const nextKeys = new Array(nextProps.displayedElementsCount);
                this.state.renderedRows
                    .forEach((element, index) => {
                        nextKeys[index] = element.key;
                    });
                const renderedRows = this.renderRowsWithCustomIndex(nextProps,
                    data.slice(nextProps.minIndex, nextProps.maxIndex),
                    nextKeys,
                    nextProps.minIndex);
                this.setState({
                    renderedRows
                });
            }

        }
    }

    // updateByHorizontalScroll = ({ top, left }) => {
    //     this.setState({
    //         sidePanelStyle: {
    //             top,
    //             marginLeft: left
    //         }
    //     })
    // }
    //
    // updateElementsByIndex = (nextProps) => {
    //     const { maxIndex, displayedElementsCount, data, minIndex } = nextProps;
    //     const oldMaxIndex = this.props.maxIndex;
    //     const oldMinIndex = this.props.minIndex;
    //     let renderedRows;
    //     if (oldMinIndex > minIndex) {
    //         if (oldMinIndex - minIndex < displayedElementsCount) {
    //             const remainingRows = this.state.renderedRows.slice(maxIndex, oldMaxIndex);
    //             const newRows = this.renderNewRows(
    //                 data.slice(minIndex, maxIndex),
    //                 minIndex
    //             );
    //             renderedRows = newRows.concat(remainingRows);
    //         } else {
    //             renderedRows = this.renderRows(nextProps, minIndex, maxIndex);
    //         }
    //     } else if (maxIndex - oldMaxIndex < displayedElementsCount) {
    //         const remainingRows = this.state.renderedRows.slice(maxIndex - oldMaxIndex, displayedElementsCount);
    //         const newRows = this.renderNewRows(
    //             data.slice(oldMaxIndex, maxIndex),
    //             oldMaxIndex
    //         );
    //         renderedRows = remainingRows.concat(newRows);
    //     } else {
    //         renderedRows = this.renderRows(nextProps, minIndex, maxIndex);
    //     }
    //     this.setState({
    //         elContainerStyle:{
    //             top: nextProps.top
    //         },
    //         sidePanelStyle: {
    //             top: nextProps.top,
    //             marginLeft: nextProps.left
    //         },
    //         renderedRows,
    //     })
    // }

    // setNewState = (nextProps) => {
    //     const { containerHeight, displayedElementsCount, data, top } = nextProps;
    //     this.setState({
    //         containerStyle:{
    //             minHeight: containerHeight,
    //         },
    //         elContainerStyle:{
    //             top: top
    //         },
    //         renderedRows: data.length > displayedElementsCount ?
    //             this.renderRows(nextProps, 0, displayedElementsCount)
    //             :
    //             this.renderRows(nextProps, 0, data.length),
    //         sideData: sideDataRender(data.length),
    //         data
    //     });
    // }
    renderRowsWithCustomIndex = (nextProps, data, nextKeys, minIndex) => {
        const { rowHeight, colWidth, elementClickHandle, resizeByLazyLoading, cellSizer } = nextProps;
        return data.length ? data.map(
            (row, index) =>
                (<Row
                    elements={row} cellSizer={cellSizer} resizeCell={resizeByLazyLoading} onElementClick={elementClickHandle} index={minIndex + index} rowHeight={rowHeight[minIndex + index]} columnWidth={colWidth} key = {nextKeys[index]} />)
        ) : [];
    }
    renderRows = (props) => {
        const { data, minIndex, maxIndex, rowHeight, colWidth, elementClickHandle, resizeByLazyLoading, cellSizer } = props;
        return data.length ? data.slice(minIndex, maxIndex).map(
            (row, index) =>
                (<Row
                      elements={row} cellSizer={cellSizer} resizeCell={resizeByLazyLoading} onElementClick={elementClickHandle} index={minIndex + index} columnWidth={colWidth} rowHeight={rowHeight[minIndex + index]} key = {index} />)
        ) : [];
    }

    render() {
        const { renderedRows } = this.state;
        const { tableStyle, floatContainerStyle } = this.props;
        return (
            <div className="data-table" style={tableStyle}>
                <div className="data-table-container" style={floatContainerStyle}>
                    { renderedRows }
                </div>
            </div>
        );
    }
}

export default DataTable;
