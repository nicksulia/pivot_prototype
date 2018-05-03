import React  from 'react';
import './style.css';

const HeaderCell = ({ height, width, isHorizontal, value }) => {
    const style = isHorizontal ? { width } : { height };
    return (
        <div className='header-cell' style={style}>
            { value }
        </div>
    )
}

export default HeaderCell;
