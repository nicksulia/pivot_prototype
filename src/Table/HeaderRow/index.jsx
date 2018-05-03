import React, { PureComponent } from 'react';
import HeaderCell from '../HeaderCell';
import './style.css';

class HeaderRow extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cells: this.renderCells(props)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            cells: this.renderCells(nextProps)
        })
    }
    renderCells = (props) => {
        const {data, height, width} = props;
        let value = data[0];
        const cells = [];
        let cellHeight = 0;
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i] !== null && data[i] !== value) {
                cells.push (
                    <HeaderCell key={i} value={value} height={cellHeight}/>
                );
                value = data[i];
                cellHeight = height[i];
            } else {
                cellHeight += height[i];
            }
        }
        cells.push(<HeaderCell key={'last'} value={value} height={cellHeight}/>);
        return cells;
    };
    render() {
        const { width } = this.props;
        const { cells } = this.state;
        return (
            <div className="header-row" style={{ width }}>
                { cells }
            </div>
        );
    }
}

export default HeaderRow;
