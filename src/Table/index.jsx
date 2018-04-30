import React, { PureComponent } from 'react';
import DataTable from './DataTable';
import './style.css';
import Scrollbars from 'react-custom-scrollbars';
import CellPreRender from '../utils/cell-pre-render';
import { getData } from '../utils/api/configAPI.js';
import elementResizeDetectorMaker from "element-resize-detector";
import SideDataPanelParser from '../utils/api/parseTreeToMatrix.js';
const parser = new SideDataPanelParser();
const erdUltraFast = elementResizeDetectorMaker({
    strategy: "scroll"
});

const cellSizer = new CellPreRender();

class Table extends PureComponent {

    renderTrackHorizontal = ({ style, ...props }) => (<div {...props} className="track-horizontal"/>);

    renderTrackVertical = ({ style, ...props }) => (<div {...props} className="track-vertical"/>);

    scrollbarsStyle = {height: 400, width: 1000};

    clientHeight = null;
    scrollHeight = null;
    table = null;

    constructor(props) {
        super(props);
        this.state = {
            displayedElementsCount: 50,
            step: 5,
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
        };

        this.elementClick = this.elementClick.bind(this);
        this.resizeCellByContent = this.resizeCellByContent.bind(this);
        this.getElementsSize = this.getElementsSize.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
        this.handleVerticalScroll = this.handleVerticalScroll.bind(this);
        this.setNextIndexes = this.setNextIndexes.bind(this);
        this.setPrevIndexes = this.setPrevIndexes.bind(this);
        this.sum = this.sum.bind(this);
    }

    sum(curr, next) { return curr + next; }

    componentDidMount() {

        cellSizer.init();
        Promise.all([getData(), parser.getData()]).then(values => {
            console.log(values);
        })

            // .then(data => {
            //     const [ colWidth, rowHeight ] = this.getElementsSize(data, this.state.minIndex, data.length);
            //     const height = rowHeight.reduce(this.sum);
            //     cellSizer.clearDOM();
            //     this.setState({
            //         data,
            //         dataLength: data.length,
            //         colWidth,
            //         rowHeight,
            //         tableStyle: {
            //             height: height
            //         },
            //         elementHeight: height/data.length
            //     })
            // });
    }

    componentDidUpdate() {
        if (this.table && !this.clientHeight && !this.scrollHeight) {
            this.clientHeight = this.table.getClientHeight();
            this.scrollHeight = this.table.getScrollHeight();
        }
    }
    resizeCellByContent(width, height, col, row) {
        if (width && height) {
            const colWidth = this.state.colWidth.slice(0);
            const rowHeight = this.state.rowHeight.slice(0);
            colWidth[col] = colWidth[col] > width ? colWidth[col] : width;
            rowHeight[row] = rowHeight[row] > height ? rowHeight[row] : height;
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

    getElementsSize(data, minIndex, maxIndex) {
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
    handleScroll(e) {
        if (this.state.left !== e.target.scrollLeft) {
            window.requestAnimationFrame(this.handleHorizontalScroll);
        } else {
            this.handleVerticalScroll(e);
        }
    }

    handleHorizontalScroll() {
        this.setState({
            left: this.table.getScrollLeft()
        });
    }
    handleVerticalScroll(e) {
        const { floatContainerStyle, displayedElementsCount, elementHeight } = this.state;
        const top = floatContainerStyle.top;
        const scrollTop = (e.target.scrollTop);
        const elementsPosition = top +  displayedElementsCount * elementHeight - this.clientHeight;
        const scrolledToBottomVirtual = scrollTop >= elementsPosition;
        const scrolledToTopVirtual = scrollTop <= top;
        if (scrolledToBottomVirtual) {
            this.scrollToElementsCount = Math.ceil((scrollTop - elementsPosition)/elementHeight);
            window.requestAnimationFrame(this.setNextIndexes);
        } else if (scrolledToTopVirtual) {
            this.scrollToElementsCount = Math.ceil((top - scrollTop)/elementHeight);
            window.requestAnimationFrame(this.setPrevIndexes);
        }
    }
    setNextIndexes() {
        const { maxIndex, dataLength, floatContainerStyle, step, displayedElementsCount, rowHeight } = this.state;
        const top = floatContainerStyle.top;
        const elementsPerStep = this.scrollToElementsCount && this.scrollToElementsCount > step ? this.scrollToElementsCount : step;
        let newMinIndex, newMaxIndex, newTop;

        if (maxIndex + elementsPerStep < dataLength || maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
            if (maxIndex + elementsPerStep < dataLength) {

                newMinIndex = maxIndex + elementsPerStep - displayedElementsCount;
                newMaxIndex = maxIndex + elementsPerStep;
                newTop = top + rowHeight.slice(maxIndex, newMaxIndex).reduce((curr, next) => curr + next);

            } else if (maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
                newMinIndex = dataLength - displayedElementsCount;
                newMaxIndex = dataLength;
                newTop = this.scrollHeight - rowHeight.slice(newMinIndex, newMaxIndex).reduce((curr, next) => curr + next);
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

    setPrevIndexes() {
        const { minIndex, floatContainerStyle, step, displayedElementsCount, rowHeight } = this.state;
        const top = floatContainerStyle.top;
        const elementsPerStep = this.scrollToElementsCount && this.scrollToElementsCount > step ? this.scrollToElementsCount : step;
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

    render() {
        // return (
        //     <div ref={this.setTable} style={this.scrollbarsStyle} onScroll={this.handleScroll}>
        //         <DataTable {...this.state} resizeDetector={erdUltraFast} elementClickHandle = {this.elementClick} resizeCellByContent = {this.resizeCellByContent} />
        //     </div>
        // );
        return (
            <Scrollbars
                renderTrackHorizontal={this.renderTrackHorizontal}
                renderTrackVertical={this.renderTrackVertical}
                style={this.scrollbarsStyle}
                ref={this.setTable}
                onScroll={this.handleScroll}
            >
                <DataTable {...this.state} resizeDetector={erdUltraFast} elementClickHandle = {this.elementClick} resizeCellByContent = {this.resizeCellByContent} />
            </Scrollbars>
        );
    }
}

export default Table;
