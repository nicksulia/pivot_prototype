import React, { PureComponent } from 'react';
import DataTable from './DataTable';
import './style.css';
import Scrollbars from 'react-custom-scrollbars';

const mockDataUrl = '/mockData/data.json';
const  headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'credentials': 'same-origin',
};
const myInit = {
    method: 'GET',
    headers
}

const reduceFindLongest = (curr, next) => (`${curr}`.length > `${next}`.length ? curr : next);

const elementHeight = 20;
class Table extends PureComponent {
    canvasElement = document.createElement('canvas').getContext('2d');
    constructor(props) {
        super(props);
        this.state = {
            fontSize: 14,
            fontFamily: 'sans-serif',
            displayedElementsCount: 50,
            step: 10,
            minIndex: 0,
            maxIndex: 50,
            data: [],
            dataLength: 0,
            containerHeight: 0,
            top: 0,
            left: 0,
            elementWidth: 10
        }
    }
    componentDidMount(){
        fetch(mockDataUrl, myInit)
            .then((response) => response.json())
            .then(data => {
                const longestContent = data.reduce((curr, next) => {
                    let longestNext =  next.reduce(reduceFindLongest);
                    return `${curr}`.length > `${longestNext}`.length ? curr : longestNext
                }, 0);
                this.canvasElement.font = `${this.state.fontSize}px ${this.state.fontFamily}`;
                const width = this.canvasElement.measureText(longestContent).width;
                this.setState({
                    data,
                    dataLength: data.length,
                    containerHeight: data.length * elementHeight,
                    elementWidth: width ? width + 10 : 0
                });
            });
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
        const { top, displayedElementsCount } = this.state;
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
        const { maxIndex, dataLength, top, step, displayedElementsCount } = this.state;
        const elementsPerStep = customStep && customStep > step ? customStep : step;
        if (maxIndex + elementsPerStep < dataLength) {
            this.setState({
                top: top + elementsPerStep * elementHeight,
                minIndex: maxIndex + elementsPerStep - displayedElementsCount,
                maxIndex: maxIndex + elementsPerStep,
            });
        } else if (maxIndex < dataLength && dataLength - maxIndex < displayedElementsCount) {
            this.setState({
                top: top + (dataLength - maxIndex) * elementHeight,
                minIndex: dataLength - displayedElementsCount,
                maxIndex: dataLength,
            });
        }
    }

    setPrevIndexes = (customStep) => {
        const { minIndex, top, step, displayedElementsCount } = this.state;
        const elementsPerStep = customStep && customStep > step ? customStep : step;
        if (minIndex - elementsPerStep > 0) {
            this.setState({
                top: top - elementsPerStep * elementHeight,
                minIndex: minIndex - elementsPerStep,
                maxIndex: minIndex - elementsPerStep + displayedElementsCount,
            });
        } else if (minIndex > 0 && minIndex - elementsPerStep <= 0) {
            this.setState({
                top: 0,
                minIndex: 0,
                maxIndex: displayedElementsCount,
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
