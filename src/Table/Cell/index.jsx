import React, { PureComponent } from 'react';
import './style.css';

class Cell extends PureComponent {

    render() {
        const { data } = this.props;
        return (
            <div className="table-cell">
                {data}
            </div>
        );
    }
}

export default Cell;
