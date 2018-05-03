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
        const {data, height, width, isHorizontal} = props;
        const sizer = isHorizontal ? width : height;
        let value = data[0];
        const cells = [];
        let cellDimension = 0;
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i] !== null && data[i] !== value) {
                cells.push (
                    <HeaderCell key={i} value={value} isHorizontal={isHorizontal} width={isHorizontal ? cellDimension : width } height={isHorizontal ? height : cellDimension }/>
                );
                value = data[i];
                cellDimension = sizer[i];
            } else {
                cellDimension += sizer[i];
            }
        }
        cells.push(<HeaderCell key={'last'} value={value} isHorizontal={isHorizontal} width={isHorizontal ? cellDimension : width } height={isHorizontal ? height : cellDimension }/>);
        return cells;
    };
    render() {
        const { width, isHorizontal, height } = this.props;
        const style = isHorizontal ? { height } : { width };
        const { cells } = this.state;
        return (
            <div className={`header-row${isHorizontal ? ' row-horizontal' : ''}`} style={style}>
                { cells }
            </div>
        );
    }
}

export default HeaderRow;
