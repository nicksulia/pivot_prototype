import React, { PureComponent } from 'react';
import Row from '../../Row';
import './style.css';


class SideContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            renderedRows: props.data.length > props.displayedElementsCount ? this.renderRows(props, 0, props.displayedElementsCount - 1) : this.renderRows(props, 0, props.data.length - 1)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setNewState(nextProps);
        } else if (nextProps.maxIndex !== this.props.maxIndex
            && nextProps.maxIndex <= nextProps.dataLength
            && nextProps.minIndex >= 0) {
            this.updateElementsByIndex(nextProps);
        }
    }

    updateElementsByIndex = (nextProps) => {
        const { maxIndex, displayedElementsCount, data, minIndex } = nextProps;
        const oldMaxIndex = this.props.maxIndex;
        const oldMinIndex = this.props.minIndex;
        let renderedRows;
        if (oldMinIndex > minIndex) {
            if (oldMinIndex - minIndex < displayedElementsCount) {
                const remainingRows = this.state.renderedRows.slice(maxIndex, oldMaxIndex);
                const newRows = this.renderNewRows(
                    data.slice(minIndex, maxIndex),
                    minIndex
                );
                renderedRows = newRows.concat(remainingRows);
            } else {
                renderedRows = this.renderRows(nextProps, minIndex, maxIndex);
            }
        } else if (maxIndex - oldMaxIndex < displayedElementsCount) {
            const remainingRows = this.state.renderedRows.slice(maxIndex - oldMaxIndex, displayedElementsCount);
            const newRows = this.renderNewRows(
                data.slice(oldMaxIndex, maxIndex),
                oldMaxIndex
            );
            renderedRows = remainingRows.concat(newRows);
        } else {
            renderedRows = this.renderRows(nextProps, minIndex, maxIndex);
        }
        this.setState({
            renderedRows
        })
    }

    setNewState = (nextProps) => {
        this.setState({
            renderedRows: nextProps.data.length > nextProps.displayedElementsCount ?
                this.renderRows(nextProps, 0, nextProps.displayedElementsCount)
                :
                this.renderRows(nextProps, 0, nextProps.dataLength),
            data: nextProps.data
        });
    }

    renderNewRows = (rows, currIndex) => {
        return rows.map((row, index) => (<Row elements = {row} key = {`row-${index + currIndex}`} />))
    }

    renderRows = (props, minIndex, maxIndex) => {
        return props.data.slice(minIndex, maxIndex).map((row, index) => (<Row elements = {row} key = {`row-${index + minIndex}`} />))
    }

    render() {
        return (
                <div className="side-table-container" style={this.props.style}>
                    {this.state.renderedRows}
                </div>
        );
    }
}

export default SideContainer;
