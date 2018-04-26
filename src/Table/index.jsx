import React, { PureComponent } from 'react';
import DataTable from './DataTable';
import './style.css';
import Scrollbars from 'react-custom-scrollbars';
import CellPreRender from '../utils/cell-pre-render';
import { getData } from '../utils/api/configAPI.js';

const cellSizer = new CellPreRender();

class Table extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            displayedElementsCount: 50,
            step: 15,
            minIndex: 0,
            maxIndex: 50,
            data: [],
            dataLength: 0,
            tableStyle: {
                height: 0
            },
            floatContainerStyle: {
                top: 0
            },
            left: 0,
            elementHeight: 20,
            colWidth: [],
            rowHeight: []
        }
        this.elementClick = this.elementClick.bind(this);
        this.resizeByLazyLoading = this.resizeByLazyLoading.bind(this);
    }
    sum = (curr, next) => curr + next;

    componentDidMount() {
        cellSizer.init();
        getData()
            .then(data => {
                const [ colWidth, rowHeight ] = this.getElementsSize(data, this.state.minIndex, data.length);
                const height = rowHeight.reduce(this.sum);
                cellSizer.clearDOM();
                this.setState({
                    data,
                    dataLength: data.length,
                    colWidth,
                    rowHeight,
                    tableStyle: {
                        height: height
                    },
                    elementHeight: height/data.length
                })
            });
    }
    componentWillUnmount() {
        cellSizer.clearDOM();
    }

    resizeByLazyLoading(width, height, col, row) {
        if (width && height) {
            const colWidth = this.state.colWidth.slice(0);
            const rowHeight = this.state.rowHeight.slice(0);
            colWidth[col] = width;
            rowHeight[row] = height;
            const newContainerHeight = this.state.tableStyle.height - this.state.rowHeight[row] + rowHeight[row];
            this.setState({
                colWidth,
                rowHeight,
                tableStyle: {
                    height : newContainerHeight
                }
            })
        }
    }

    elementClick(colIndex) {
        const colWidth = this.state.colWidth.slice(0);
        colWidth[colIndex] += 10;
        this.setState({
            colWidth
        })
    }

    getElementsSize = (data, minIndex, maxIndex) => {
        const tempData = data && data.length ? data : this.state.data;
        const { colWidth, rowHeight } = this.state;
        const newRowHeight = rowHeight.length ? rowHeight.slice(0) : new Array( maxIndex - minIndex);
        const newColWidth = colWidth.length ? colWidth.slice(0) : new Array( tempData[0].length );
        for (let i = (minIndex >= 0 && minIndex < tempData.length) ? minIndex : 0,
                 length = maxIndex < tempData.length ? maxIndex : tempData.length;
             i < length; i += 1) {
            tempData[i].forEach((el, index) => {
                const { width, height } = cellSizer.getSize(el);
                if (newRowHeight[i] === undefined) {
                    newRowHeight[i] = height;
                } else {
                    newRowHeight[i] = height > newRowHeight[i] ? height : newRowHeight[i];
                }
                if (newColWidth[index] === undefined) {
                    newColWidth[index] = width;
                } else {
                    newColWidth[index] = width > newColWidth[index] ? width : newColWidth[index];
                }
            })
        }
        return [ newColWidth, newRowHeight ];
    }

    setTable = scrollbar => { this.table = scrollbar };
    handleScroll = () => {
        if (this.state.left !== this.table.getScrollLeft()) {
            this.handleHorizontalScroll();
        } else {
            this.handleVerticalScroll();
        }
    }

    handleHorizontalScroll = () => {
        this.setState({
            left: this.table.getScrollLeft()
        });
    }
    handleVerticalScroll = () => {
        const { floatContainerStyle, displayedElementsCount, elementHeight } = this.state;
        const top = floatContainerStyle.top;
        const scrollTop = (this.table && this.table.getScrollTop());
        const clientHeight = this.table.getClientHeight(); // move to state and reset it every time we meet context that's needs to bo re-sized
        const elementsPosition = top +  displayedElementsCount * elementHeight - clientHeight;
        const scrolledToBottomVirtual = Math.ceil(scrollTop) >= elementsPosition;
        const scrolledToTopVirtual = scrollTop <= top;
        console.log('scrollTop: ' + scrollTop,
            'Elements position: ' + (elementsPosition));
        if (scrolledToBottomVirtual) {
            const scrollToElementsCount = Math.ceil((scrollTop - elementsPosition)/elementHeight);
            this.setNextIndexes(scrollToElementsCount)
        } else if (scrolledToTopVirtual) {
            const scrollToElementsCount = Math.ceil((top - scrollTop)/elementHeight);
            this.setPrevIndexes(scrollToElementsCount);
        }
    }
    setNextIndexes = (customStep) => {
        const { maxIndex, dataLength, floatContainerStyle, step, displayedElementsCount, rowHeight } = this.state;
        const top = floatContainerStyle.top;
        const elementsPerStep = customStep && customStep > step ? customStep : step;
        let newMinIndex, newMaxIndex, newTop;

        if (maxIndex + elementsPerStep < dataLength || maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
            if (maxIndex + elementsPerStep < dataLength) {

                newMinIndex = maxIndex + elementsPerStep - displayedElementsCount;
                newMaxIndex = maxIndex + elementsPerStep;
                newTop = top + rowHeight.slice(maxIndex, newMaxIndex).reduce((curr, next) => curr + next);

            } else if (maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
                newMinIndex = dataLength - displayedElementsCount;
                newMaxIndex = dataLength;
                newTop = this.table.getScrollHeight() - rowHeight.slice(newMinIndex, newMaxIndex).reduce((curr, next) => curr + next);
            }
            this.setState({
                floatContainerStyle: {
                    top: newTop,
                },
                minIndex: newMinIndex,
                maxIndex: newMaxIndex,
            });
        }
    }

    setPrevIndexes = (customStep) => {
        const { minIndex, floatContainerStyle, step, displayedElementsCount, rowHeight } = this.state;
        const top = floatContainerStyle.top;
        const elementsPerStep = customStep && customStep > step ? customStep : step;
        let newMinIndex, newMaxIndex, newTop;

        if (minIndex - elementsPerStep > 0 || minIndex > 0 && minIndex - elementsPerStep <= 0) {
            if (minIndex - elementsPerStep > 0) {
                newMinIndex = minIndex - elementsPerStep;
                newMaxIndex = minIndex - elementsPerStep + displayedElementsCount;
                newTop = top - rowHeight.slice(newMinIndex, minIndex).reduce((curr, next) => curr + next);
                newTop = newTop < 0 ? 0 : newTop;
            } else if (minIndex > 0 && minIndex - elementsPerStep <= 0) {
                newTop = 0;
                newMinIndex = 0;
                newMaxIndex = displayedElementsCount;
            }
            this.setState({
                floatContainerStyle: {
                    top: newTop,
                },
                minIndex: newMinIndex,
                maxIndex: newMaxIndex,
            });
        }
    }
    renderTrackHorizontal = ({ style, ...props }) => (<div {...props} className="track-horizontal"/>);
    renderTrackVertical = ({ style, ...props }) => (<div {...props} className="track-vertical"/>);

    scrollbarsStyle = {height: 400, width: 1000};

    render() {
        return (
            <Scrollbars
                renderTrackHorizontal={this.renderTrackHorizontal}
                renderTrackVertical={this.renderTrackVertical}
                style={this.scrollbarsStyle}
                ref={this.setTable}
                onScroll={this.handleScroll}>
                <DataTable {...this.state} elementClickHandle = {this.elementClick} resizeByLazyLoading = {this.resizeByLazyLoading} />
            </Scrollbars>
        );
    }
}

export default Table;
