import React  from 'react';
import './style.css';

const Cell = ({ data }) => {
    return (
        <div className="table-cell">
            {data}
        </div>
    );
};

export default Cell;
