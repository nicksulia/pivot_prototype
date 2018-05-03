import React, { PureComponent } from 'react';
import Row from '../Row';
import './style.css';

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

    renderRowsWithCustomIndex = (nextProps, data, nextKeys, minIndex) => {
        const { rowHeight, colWidth, elementClickHandle, resizeCellByContent, resizeDetector } = nextProps;
        return data.length ? data.map(
            (row, index) =>
                (<Row
                    elements={row}
                    resizeDetector={resizeDetector}
                    resizeCellByContent={resizeCellByContent}
                    onElementClick={elementClickHandle}
                    index={minIndex + index}
                    rowHeight={rowHeight[minIndex + index]}
                    columnWidth={colWidth}
                    key = {nextKeys[index]} />)
        ) : [];
    }
    renderRows = (props) => {
        const { data, minIndex, maxIndex, rowHeight, colWidth, elementClickHandle, resizeCellByContent, resizeDetector } = props;
        return data.length ? data.slice(minIndex, maxIndex).map(
            (row, index) =>
                (<Row
                      elements={row}
                      resizeDetector={resizeDetector}
                      resizeCellByContent={resizeCellByContent}
                      onElementClick={elementClickHandle}
                      index={minIndex + index}
                      columnWidth={colWidth}
                      rowHeight={rowHeight[minIndex + index]}
                      key = {index} />)
        ) : [];
    }

    render() {
        const { renderedRows } = this.state;
        const { top, sideHeaderSize } = this.props;
        return (
                <div className="data-table-container" style={{ top, left: sideHeaderSize }}>
                    { renderedRows }
                </div>
        );
    }
}

export default DataTable;
