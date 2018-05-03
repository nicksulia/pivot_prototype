import React  from 'react';
import './style.css';

const HeaderCell = ({ height, value }) => {
    return (
        <div className='header-cell' style={{ height }}>
            { value }
        </div>
    )
}

export default HeaderCell;
