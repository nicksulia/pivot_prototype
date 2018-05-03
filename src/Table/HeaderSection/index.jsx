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
        if (nextProps.data !== this.props.data) {
            this.setState({
                rows: this.renderRows(nextProps)
            })
        }
    }
    renderRows = (props) => {
        const { data, colWidth, rowHeight, minIndex, maxIndex } = props;
        const sectionHeight = rowHeight.slice(minIndex, maxIndex);
        return data.map((row, index) => {
            return (
                <HeaderRow
                    key = {index}
                    data = {row}
                    level = {index}
                    width = { colWidth[index] }
                    height = {sectionHeight}
                    minIndex = {minIndex}
                    maxIndex = {maxIndex}
                />
            );
        })
    };
    render() {
        const { rows } = this.state;
        return (
            <div className="header-section">
                { rows }
            </div>
        );
    }
}

export default HeaderSection;
