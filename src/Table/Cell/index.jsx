import React  from 'react';
import './style.css';

const Cell = ({ data, width }) => {
    const style = { width };
    return (
        <div className="table-cell" style={style}>
            {data}
        </div>
    );
};

export default Cell;
