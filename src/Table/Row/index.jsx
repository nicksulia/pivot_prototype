import React, { PureComponent } from 'react';
import Cell from '../Cell';
import './style.css';

const findUpdatedWidth = (prewColWidth, nextColWidth) => {
    for (let i = 0, len = prewColWidth.length; i < len; i++) {
        if (prewColWidth[i] !== nextColWidth[i]) return i;
    }
    return null;
};

class Row extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            renderedCells : this.renderElements(props)
        };
        this.renderElements = this.renderElements.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.index !== this.props.index) {
            this.setState({
                renderedCells: this.renderElements(nextProps)
            });
            return;
        }

        if (this.props.columnWidth !== nextProps.columnWidth) {
            const changedIndexWidth = findUpdatedWidth(this.props.columnWidth, nextProps.columnWidth);
            if (changedIndexWidth !== null) {
                const renderedCells = this.state.renderedCells.slice(0);
                renderedCells[changedIndexWidth] =
                    (<Cell
                        resizeCellByContent={nextProps.resizeCellByContent}
                        width = {nextProps.columnWidth[changedIndexWidth]}
                        data = {nextProps.elements[changedIndexWidth]}
                        resizeDetector={nextProps.resizeDetector}
                        rowIndex={nextProps.index}
                        colIndex = {changedIndexWidth}
                        onClick={nextProps.onElementClick}
                        key = {`cell-${changedIndexWidth}`}
                    />);
                this.setState({
                    renderedCells
                })
            }
        }
    }

    renderElements(props) {
        const { elements, columnWidth, resizeCellByContent, index, resizeDetector, onElementClick } = props;
        return elements.length ? elements.map((el, i) => {
            return <Cell
                resizeCellByContent = {resizeCellByContent}
                width = {columnWidth[i]}
                data = {el}
                resizeDetector={resizeDetector}
                rowIndex={index}
                colIndex={i}
                onClick={onElementClick}
                key = {`cell-${i}`}/>
        }) : <div>Loading...</div>
    };
    render() {
        const { renderedCells } = this.state;
        const { rowHeight: height  } = this.props;
        return (
            <div className="row" style={{ height }}>
                { renderedCells }
            </div>
        );
    }
}

export default Row;
