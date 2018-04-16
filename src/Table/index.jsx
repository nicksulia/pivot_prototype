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
            minIndex: 0,
            maxIndex: 50,
            data: [],
            dataLength: 0,
            containerHeight: 0,
            top: 0
        }
    }
    componentDidMount(){
        this.table.addEventListener('scroll', this.handleScroll);
        fetch(mockDataUrl, myInit)
            .then((response) => response.json())
            .then(data => {
                this.setState({data, dataLength: data.length, containerHeight: data.length * elementHeight});
            });
    }
    componentWillUnmount(){
        this.table.removeEventListener('scroll', this.handleScroll);
    }
    setRef = (el) => {
        if (el) {
            this.table = el;
        }
    }
    handleScroll = () => {
        const scrollTop = (this.table && this.table.scrollTop) || this.table.scrollTop;
        //const scrollHeight = (this.table && this.table.scrollHeight) || this.table.scrollHeight;
        const clientHeight = this.table.clientHeight || this.table.innerHeight;
        const scrolledToBottomVirtual = Math.ceil(scrollTop) >= this.state.top +  50 * elementHeight - clientHeight;
        console.log('scrollTop: ' + scrollTop,
            'Elements position: ' + (this.state.top +  50 * elementHeight));
        if (scrolledToBottomVirtual) {
            this.setNextIndexes()
        }
    }
    setNextIndexes = () => {
        const { minIndex, maxIndex, dataLength, top } = this.state;
        if (maxIndex + 1 < dataLength) {
            this.setState({
                top: top + 10 * elementHeight,
                minIndex: minIndex + 10,
                maxIndex: maxIndex + 10,
            });
        }
    }
    render() {
        return (
            <div ref = {this.setRef} className="table">
                <DataTable {...this.state} />
            </div>
        );
    }
}

export default Table;
