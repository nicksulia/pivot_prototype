import React  from 'react';
import './style.css';

const Cell = ({ data, width, onClick, colIndex, rowIndex }) => {
    const style = { width };
    // const html = {
    //     __html: data
    // }
    const click = (e) => {
        if (e.button = 0) {
            onClick(colIndex, rowIndex, 'left');
        } else {
            onClick(colIndex, rowIndex, 'right');
        }
    };
    // return (
    //     <div
    //         onClick={click}
    //         className="table-cell"
    //         style={style}
    //         dangerouslySetInnerHTML = {html}/>
    // );
    return (
        <div className="table-cell" onClick={click} style={{ width }}>
            { data }
        </div>
    )

};

// class Cell extends React.PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             style : {
//                 width: props.width
//             },
//             html : {
//                 __html: `<div class='cell-${props.colIndex}-${props.rowIndex}' style='height: auto; width: auto; display: inline-block;'>`
//                 + props.data
//                 + "</div>"
//             }
//         }
//     }
//
//     componentDidMount() {
//         if (this.isContainsImg) {
//             this.isContainsImg = false;
//             this.setResizeHandler();
//         }
//     }
//     componentDidUpdate() {
//         if (this.isContainsImg) {
//             this.isContainsImg = false;
//             this.setResizeHandler();
//         }
//     }
//     setResizeHandler = () => {
//         this.contentContainer = this.container.getElementsByClassName(`cell-${this.props.colIndex}-${this.props.rowIndex}`)[0];
//         this.props.resizeDetector.listenTo(this.contentContainer, (el) => {
//             this.props.resizeCellByContent( el.offsetWidth, el.offsetHeight, this.props.colIndex, this.props.rowIndex);
//         })
//         // if (!this.images) {
//         //     this.images = [];
//         // }
//         // for (let i = 0; i < images.length; i++) {
//         //     images[i].addEventListener('load', (e) => {
//         //         const [width, height] = [ e.target.offsetWidth, e.target.offsetHeight ];
//         //         if (!this.images[i]) {
//         //             this.images[i] = images[i];
//         //             this.props.resizeCell( width, height, this.props.colIndex, this.props.rowIndex);
//         //         }
//         //         if (this.images[i].src !== images[i].src) {
//         //             this.images[i] = images[i];
//         //             this.props.resizeCell( width, height, this.props.colIndex, this.props.rowIndex);
//         //         } else {
//         //             this.props.resizeCell( this.props.width, height, this.props.colIndex, this.props.rowIndex);
//         //         }
//         //     })
//         // }
//     };
//     componentWillMount() {
//         if ((""+this.props.data).indexOf("<img") > -1) {
//             this.isContainsImg = true;
//         }
//     }
//     componentWillReceiveProps(newProps) {
//         if (this.props.data !== newProps.data && (""+newProps.data).indexOf("<img") > -1) {
//             this.isContainsImg = true;
//         }
//         this.setState({
//             style : {
//                 width: newProps.width
//             },
//             html : {
//                 __html: `<div class='cell-${newProps.colIndex}-${newProps.rowIndex}' style='height: auto; width: auto; display: inline-block;'>`+ newProps.data + "</div>"
//             }
//         })
//     }
//
//     click = () => {
//         this.props.onClick(this.props.colIndex);
//     };
//     setRef = div => {
//         if (div) this.container = div;
//     };
//     render() {
//         return (
//             <div
//                 ref={this.setRef}
//                 onClick={this.click}
//                 className="table-cell"
//                 style={this.state.style}
//                 dangerouslySetInnerHTML = {this.state.html}/>
//         );
//     }
//
// };

export default Cell;
