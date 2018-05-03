import React, { PureComponent } from 'react';
import HeaderRow from '../HeaderRow';
import './style.css';

class HeaderSection extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.renderRows(props)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            rows: this.renderRows(nextProps)
        })
    }
    renderRows = (props) => {
        const { data, colWidth, rowHeight, minIndex, maxIndex, isHorizontal } = props;
        console.log(colWidth)
        return data.map((row, index) => {
            return (
                <HeaderRow
                    key = {index}
                    data = {row}
                    level = {index}
                    width = { isHorizontal ? colWidth : colWidth[index] }
                    height = {isHorizontal ? rowHeight[index] : rowHeight }
                    minIndex = {minIndex}
                    maxIndex = {maxIndex}
                    isHorizontal = {isHorizontal}
                />
            );
        })
    };
    render() {
        const { rows } = this.state;
        const { isHorizontal } = this.props;
        return (
            <div className={`header-section${isHorizontal ? ' section-horizontal' : ''}`}>
                { rows }
            </div>
        );
    }
}

export default HeaderSection;
