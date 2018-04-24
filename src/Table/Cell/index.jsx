import React  from 'react';
import './style.css';

const Cell = ({ data, width }) => {
    const style = { width };
    const html = {
        __html: data
    }
    return (
        <div className="table-cell" style={style} dangerouslySetInnerHTML = {html}/>
    );
};

export default Cell;
