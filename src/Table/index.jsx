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
            displayedElementsCount: 70,
            step: 30,
            minIndex: 0,
            maxIndex: 70,
            data: [],
            dataLength: 0,
            containerHeight: 10000,
            top: 0,
            left: 0,
            elementHeight: 20,
            colWidth: [],
            rowHeight: []
        }
    }
    componentDidMount() {
        cellSizer.init();
        getData()
            .then(data => {
                const [ colWidth, rowHeight ] = this.getElementsSize(data, this.state.minIndex, this.state.maxIndex);
                this.setState({
                    data,
                    dataLength: data.length,
                    colWidth,
                    rowHeight
                })
            });
    }
    componentWillUnmount() {
        cellSizer.clearDOM();
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
        const { top, displayedElementsCount, elementHeight } = this.state;
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
        const { maxIndex, dataLength, top, step, displayedElementsCount, elementHeight } = this.state;
        const elementsPerStep = customStep && customStep > step ? customStep : step;
        let newMinIndex, newMaxIndex, newTop, colWidth, rowHeight;

        if (maxIndex + elementsPerStep < dataLength || maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
            if (maxIndex + elementsPerStep < dataLength) {

                newTop = top + elementsPerStep * elementHeight;
                newMinIndex = maxIndex + elementsPerStep - displayedElementsCount;
                newMaxIndex = maxIndex + elementsPerStep;
                let newSize =
                [ colWidth, rowHeight ] = this.getElementsSize(this.state.data, newMinIndex, newMaxIndex);
            } else if (maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
                newTop = top + (dataLength - maxIndex) * elementHeight;
                newMinIndex = dataLength - displayedElementsCount;
                newMaxIndex = dataLength;
                [ colWidth, rowHeight ] = this.getElementsSize(this.state.data, newMinIndex, newMaxIndex);
            }
            this.setState({
                colWidth,
                rowHeight,
                top: newTop,
                minIndex: newMinIndex,
                maxIndex: newMaxIndex,
            });
        }
    }

    setPrevIndexes = (customStep) => {
        const { minIndex, top, step, displayedElementsCount, elementHeight } = this.state;
        const elementsPerStep = customStep && customStep > step ? customStep : step;
        let newMinIndex, newMaxIndex, newTop, colWidth, rowHeight;

        if (minIndex - elementsPerStep > 0 || minIndex > 0 && minIndex - elementsPerStep <= 0) {
            if (minIndex - elementsPerStep > 0) {
                newTop = top - elementsPerStep * elementHeight;
                newMinIndex = minIndex - elementsPerStep;
                newMaxIndex = minIndex - elementsPerStep + displayedElementsCount;
            } else if (minIndex > 0 && minIndex - elementsPerStep <= 0) {
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
    renderTrackHorizontal = ({ style, ...props }) => (<div {...props} className="track-horizontal"/>);
    renderTrackVertical = ({ style, ...props }) => (<div {...props} className="track-vertical"/>);

    scrollbarsStyle = {height: 700, width: 1000};

    render() {
        return (
            <Scrollbars
                renderTrackHorizontal={this.renderTrackHorizontal}
                renderTrackVertical={this.renderTrackVertical}
                style={this.scrollbarsStyle}
                ref={this.setTable}
                onScroll={this.handleScroll}>
                <DataTable {...this.state} />
            </Scrollbars>
        );
    }
}

export default Table;
