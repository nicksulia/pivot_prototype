import React, { PureComponent } from 'react';
import HeaderSection from '../HeaderSection';
import './style.css';


class HeaderContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sections: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.panelsData !== this.props.panelsData) {
            this.setState({
                sections: this.renderAllSections(nextProps)
            })
        } else if (!nextProps.isHorizontal && nextProps.rowHeight !== this.props.rowHeight) {
            const index = this.findChangedIndex(this.props.rowHeight, nextProps.rowHeight);
            const { sectionIndex, min, max } = this.seekAndUpdate(index);
            const updatedSection = this.updateSection(nextProps, sectionIndex, min, max );
            const sections = this.state.sections.slice(0);
            sections[sectionIndex] = updatedSection;
            this.setState({
                sections
            });
        }
    }
    findChangedIndex = (oldArr, newArr) => {
        for (let i = 0, len = newArr.length; i < len; i++ ) {
            if (oldArr[i] !== newArr[i]) return i;
        }
    };
    seekAndUpdate = (index) => {
        const { sections } = this.state;
        for (let i = 0, len = sections.length; i < len; i++ ) {
            let key = sections[i].key.split('-');
            if (index >= key[0] && index < key[1]) {
                return { sectionIndex: i, min: key[0], max: key[1] };
            }
        }
    };
    updateSection = (props, index, min, max) => {
        const { panelsData, sideColWidth, rowHeight, headerRowHeight, sideHeaderSize, isHorizontal, colWidth } = props;
        const targetIndex = index * 3;
        return (
            <HeaderSection
                key = {`${min}-${max}`}
                data = {[ panelsData[targetIndex], panelsData[targetIndex+1], panelsData[targetIndex+2] ]}
                rowHeight = {isHorizontal ? headerRowHeight : rowHeight}
                colWidth = {isHorizontal ? colWidth : sideColWidth}
                minIndex = { min }
                maxIndex = { max }
                width = { sideHeaderSize }
                isHorizontal = {isHorizontal}
            />
        );
    };

    renderAllSections = (props) => {
        const { panelsData, sideColWidth, rowHeight, headerRowHeight, sideHeaderSize, isHorizontal, colWidth } = props;
        const sectionArr = [];
        let indexes = 0;
        for ( let i = 0, len = panelsData.length; i < len; i += 3 ) {
            const nextIndex = indexes + panelsData[i].length;
            sectionArr[sectionArr.length] = (
                <HeaderSection
                    key = {`${indexes}-${nextIndex}`}
                    data = { [ panelsData[i], panelsData[i+1], panelsData[i+2] ] }
                    rowHeight = {isHorizontal ? headerRowHeight : rowHeight}
                    colWidth = {isHorizontal ? colWidth : sideColWidth}
                    minIndex = { indexes }
                    maxIndex = { nextIndex }
                    width = { sideHeaderSize }
                    isHorizontal = {isHorizontal}
                />
            );
            indexes += panelsData[i].length;
        }
        return sectionArr;
    }
    render() {
        const { sections } = this.state;
        const { left, isHorizontal, top, scrollTop, headerRowSize, sideHeaderSize } = this.props;
        const style = isHorizontal ? { left: sideHeaderSize, top: scrollTop ? scrollTop : 0 } : { left, top: headerRowSize };
        return (
                <div className={`side-table-container${isHorizontal ? ' horizontal' : ''}`} style={style}>
                    { sections }
                </div>
        );
    }
}

export default HeaderContainer;
