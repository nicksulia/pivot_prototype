import React, { PureComponent } from 'react';
import DataTable from './DataTable';

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

class Table extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            minIndex: 0,
            maxIndex: 4,
            data: [],
            dataLength: 0
        }
    }
    componentDidMount(){
        this.table.addEventListener('scroll', this.handleScroll);
        fetch(mockDataUrl, myInit)
            .then((response) => response.json())
            .then(data => {
                this.setState({data, dataLength: data.length});
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
        const scrollHeight = (this.table && this.table.scrollHeight) || this.table.scrollHeight;
        const clientHeight = this.table.clientHeight || this.table.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom) {
            this.setNextIndexes()
        }
    }
    setNextIndexes = () => {
        const { minIndex, maxIndex, dataLength } = this.state;
        if (maxIndex + 1 < dataLength) {
            this.setState({
                minIndex: minIndex + 1,
                maxIndex: maxIndex + 1,
            });
        }
    }
    render() {
        return (
            <div ref = {this.setRef} className="table">
                <DataTable {...this.state}/>
            </div>
        );
    }
}

export default Table;
