import React, { PureComponent } from 'react';
import DataTable from './DataTable';
import './style.css';
import Scrollbars from 'react-custom-scrollbars';
import { CellRenderer } from '../utils/cell-pre-render';
import { getData } from '../utils/api/configAPI.js';
import elementResizeDetectorMaker from "element-resize-detector";
import SideDataPanelParser from '../utils/api/parseTreeToMatrix.js';
import HeaderContainer from './HeaderContainer';
const cellSizer = new CellRenderer();
const parser = new SideDataPanelParser();
const erdUltraFast = elementResizeDetectorMaker({
    strategy: "scroll"
});

class Table extends PureComponent {

    renderTrackHorizontal = ({ style, ...props }) => (<div {...props} className="track-horizontal"/>);

    renderTrackVertical = ({ style, ...props }) => (<div {...props} className="track-vertical"/>);

    scrollbarsStyle = {height: 600, width: 1200};

    clientHeight = null;
    scrollHeight = null;
    table = null;
    scrollTop = null;

    constructor(props) {
        super(props);
        this.state = {
            displayedElementsCount: 50,
            step: 5,
            minIndex: 0,
            maxIndex: 50,
            data: [],
            panelsData: [],
            headersData: [],
            dataLength: 0,
            height: 0,
            top: 0,
            left: 0,
            sideHeaderSize: 0,
            topHeaderSize: 0,
            elementHeight: 20,
            colWidth: [],
            sideColWidth: [],
            headerRowHeight: [],
            rowHeight: []
        };

        this.elementClick = this.elementClick.bind(this);
        this.resizeCellByContent = this.resizeCellByContent.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleHorizontalScroll = this.handleHorizontalScroll.bind(this);
        this.handleVerticalScroll = this.handleVerticalScroll.bind(this);
        this.setNextIndexes = this.setNextIndexes.bind(this);
        this.setPrevIndexes = this.setPrevIndexes.bind(this);
        this.sum = this.sum.bind(this);
        this.setTable = this.setTable.bind(this);
        this.setScrollPosition = this.setScrollPosition.bind(this);
    }

    sum(curr, next) { return curr + next; }

    setTable(scrollbar) { this.table = scrollbar };

    componentDidMount() {

        cellSizer.init();
        Promise.all([getData(), parser.getData()])
            .then(values => {
                const [ dataColWidth, dataRowHeight ] =
                    cellSizer.getElementsSize(
                        values[0],
                        this.state.minIndex,
                        values[0].length,
                        [],
                        []
                    );
                const sidePanelFormattedArr = parser.formatInHeader(values[1], 3);

                const [sidePanelWidth, rowHeight ] = cellSizer.getElementsSize(
                    sidePanelFormattedArr,
                    this.state.minIndex,
                    sidePanelFormattedArr.length,
                    [],
                    dataRowHeight
                );

                const headerFormattedArr = parser.formatInHeader(values[1].slice(0, 3), 3, true);
                const [colWidth, headerRowHeight ] = cellSizer.getElementsSize(
                    [ headerFormattedArr[2], headerFormattedArr[2], headerFormattedArr[2] ],
                    this.state.minIndex,
                    3,
                    dataColWidth,
                    []
                );
                const height = rowHeight.reduce(this.sum);
                cellSizer.clearDOM();
                this.setState({
                    sideHeaderSize: sidePanelWidth.reduce(this.sum),
                    sideColWidth: sidePanelWidth,
                    headerRowHeight,
                    headerRowSize: headerRowHeight.reduce(this.sum),
                    panelsData: values[1],
                    headersData: values[1].slice(0, 3),
                    data: values[0],
                    dataLength: values[0].length,
                    colWidth,
                    rowHeight,
                    height,
                    elementHeight: height/values[0].length
                })
            });
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
            const newContainerHeight = this.state.height - this.state.rowHeight[row] + rowHeight[row];
            this.setState({
                colWidth,
                rowHeight,
                height: newContainerHeight
            })
        }
    }

    elementClick(colIndex, rowIndex, clicked) {
        const rowHeight = this.state.rowHeight.slice(0);
        rowHeight[rowIndex] += 10;
        this.setState({
            rowHeight
        })

    }

    handleScroll(e) {
        const left = e.target.scrollLeft;
        if (this.state.left !== left) {
            this.handleHorizontalScroll(left);
        } else {
            this.handleVerticalScroll(e);
        }
    }

    handleHorizontalScroll(left) {
        window.requestAnimationFrame(() => {
            this.setState({
                left
            });
        })

    }
    handleVerticalScroll(e) {
        const { top, displayedElementsCount, elementHeight } = this.state;
        this.scrollTop = (e.target.scrollTop);
        const elementsPosition = top +  displayedElementsCount * elementHeight - this.clientHeight;
        const scrolledToBottomVirtual = this.scrollTop >= elementsPosition;
        const scrolledToTopVirtual = this.scrollTop <= top;
        if (scrolledToBottomVirtual) {
            this.scrollToElementsCount = Math.ceil((this.scrollTop - elementsPosition)/elementHeight);
            window.requestAnimationFrame(this.setNextIndexes);
        } else if (scrolledToTopVirtual) {
            this.scrollToElementsCount = Math.ceil((top - this.scrollTop)/elementHeight);
            window.requestAnimationFrame(this.setPrevIndexes);
        } else {
            window.requestAnimationFrame(this.setScrollPosition);
        }
    }

    setScrollPosition() {
        this.forceUpdate();
    }

    setNextIndexes() {
        const { maxIndex, dataLength, top, step, displayedElementsCount, rowHeight } = this.state;
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
                top: newTop,
                minIndex: newMinIndex,
                maxIndex: newMaxIndex,
            });
        }
    }

    setPrevIndexes() {
        const { minIndex, top, step, displayedElementsCount, rowHeight } = this.state;
        const elementsPerStep = this.scrollToElementsCount && this.scrollToElementsCount > step ? this.scrollToElementsCount : step;
        let newMinIndex, newMaxIndex, newTop;

        if (minIndex - elementsPerStep > 0 || minIndex > 0 && minIndex - elementsPerStep <= 0) {
            if (minIndex - elementsPerStep > 0) {
                newMinIndex = minIndex - elementsPerStep;
                newMaxIndex = minIndex - elementsPerStep + displayedElementsCount;
                newTop = top - rowHeight.slice(newMinIndex, minIndex).reduce((curr, next) => curr + next);
                newTop = newTop < 0 ? 0 : newTop;
            } else if (minIndex > 0 && minIndex - elementsPerStep <= 0) {
                this.scrollTop = 0;
                newTop = 0;
                newMinIndex = 0;
                newMaxIndex = displayedElementsCount;
            }
            this.setState({
                top: newTop,
                minIndex: newMinIndex,
                maxIndex: newMaxIndex,
            });
        }
    }

    render() {
        const { panelsData, sideColWidth, rowHeight, sideHeaderSize, left, top, headerRowHeight, colWidth, headerRowSize } = this.state;
        return (
            <Scrollbars
                renderTrackHorizontal={this.renderTrackHorizontal}
                renderTrackVertical={this.renderTrackVertical}
                style={this.scrollbarsStyle}
                ref={this.setTable}
                onScroll={this.handleScroll}
            >
                <div className="table-scroll-block">
                    <HeaderContainer
                         panelsData = {panelsData.slice(0,3)}
                         sideColWidth = {sideColWidth}
                         colWidth = {colWidth}
                         headerRowHeight = {headerRowHeight}
                         rowHeight = {rowHeight}
                         sideHeaderSize = {sideHeaderSize}
                         headerRowSize = {headerRowSize}
                         left={left}
                         isHorizontal={true}
                         top={top}
                         scrollTop = {this.scrollTop}
                    />
                    <HeaderContainer
                        panelsData = {panelsData}
                        sideColWidth = {sideColWidth}
                        colWidth = {colWidth}
                        headerRowHeight = {headerRowHeight}
                        rowHeight = {rowHeight}
                        sideHeaderSize = {sideHeaderSize}
                        headerRowSize = {headerRowSize}
                        left={left}
                        isHorizontal={false}
                        top={top}
                        scrollTop={this.scrollTop}
                    />
                    <DataTable
                        {...this.state}
                        resizeDetector={erdUltraFast}
                        elementClickHandle = {this.elementClick}
                        resizeCellByContent = {this.resizeCellByContent}
                    />
                </div>
            </Scrollbars>
        );
    }
}

export default Table;
