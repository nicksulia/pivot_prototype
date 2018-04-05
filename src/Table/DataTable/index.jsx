import React, { PureComponent } from 'react';
import Row from '../Row';

class DataTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChanged: false
        }
        this.rows
    }
    renderRows = (rows) => {

    }
    render() {
        return (
            <div className="data-table">
            </div>
        );
    }
}

export default DataTable;
