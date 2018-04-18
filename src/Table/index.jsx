import React, { PureComponent } from 'react';
import DataTable from './DataTable';
import './style.css';

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
const elementHeight = 20;
class Table extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            displayedElementsCount: 50,
            step: 10,
            minIndex: 0,
            maxIndex: 50,
            data: [],
            dataLength: 0,
            containerHeight: 0,
            top: 0,
            left: 0
        }
    }
    componentDidMount(){
        //this.table.addEventListener('scroll', this.handleScroll);
        fetch(mockDataUrl, myInit)
            .then((response) => response.json())
            .then(data => {
                this.setState({data, dataLength: data.length, containerHeight: data.length * elementHeight});
            });
    }
    componentWillUnmount(){
        //this.table.removeEventListener('scroll', this.handleScroll);
    }
    setRef = (el) => {
        if (el) {
            this.table = el;
        }
    }
    handleScroll = () => {
        if (this.state.left !== this.table.scrollLeft) {
            this.handleHorizontalScroll();
        } else {
            this.handleVerticalScroll();
        }

    }
    componentDidUpdate() {
        console.log();
    }

    handleHorizontalScroll = () => {
        this.setState({
            left: this.table.scrollLeft
        });
    }
    handleVerticalScroll = () => {
        const { top, displayedElementsCount } = this.state;
        const scrollTop = (this.table && this.table.scrollTop) || this.table.scrollTop;
        const clientHeight = this.table.clientHeight || this.table.innerHeight;
        const elementsPosition = top +  displayedElementsCount * elementHeight - clientHeight;
        const scrolledToBottomVirtual = Math.ceil(scrollTop) >= elementsPosition;
        console.log('scrollTop: ' + scrollTop,
            'Elements position: ' + (elementsPosition));
        if (scrolledToBottomVirtual) {
            const scrollToElementsCount = Math.ceil((scrollTop - elementsPosition)/elementHeight);
            this.setNextIndexes(scrollToElementsCount)
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
    render() {
        return (
            <div ref = {this.setRef} className="table" onScroll={this.handleScroll}>
                <DataTable {...this.state} />
            </div>
        );
    }
}

export default Table;
