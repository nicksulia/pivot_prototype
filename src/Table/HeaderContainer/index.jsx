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
        }
    }
    renderAllSections = (props) => {
        const { panelsData, sideColWidth, rowHeight, sideHeaderSize } = props;
        const sectionArr = [];
        let indexes = 0;
        for ( let i = 0, len = panelsData.length; i < len; i += 3 ) {
            const nextIndex = indexes + panelsData[i].length;
            sectionArr[sectionArr.length] = (
                <HeaderSection
                    key = {`${indexes}-${nextIndex}`}
                    data = { [ panelsData[i], panelsData[i+1], panelsData[i+2] ] }
                    rowHeight = {rowHeight}
                    colWidth = {sideColWidth}
                    minIndex = { indexes }
                    maxIndex = { nextIndex }
                    width = { sideHeaderSize }
                />
            );
            indexes += panelsData[i].length;
        }
        return sectionArr;
    }
    render() {
        const { sections } = this.state;
        const { left } = this.props;
        return (
                <div className="side-table-container" style={{ left }}>
                    { sections }
                </div>
        );
    }
}

export default HeaderContainer;
