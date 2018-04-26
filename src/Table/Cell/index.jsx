import React  from 'react';
import './style.css';

// const Cell = ({ data, width, onClick, index }) => {
//     const style = { width };
//     const html = {
//         __html: data
//     }
//     const click = () => {
//         onClick(index);
//     };
//     return (
//         <div
//             onClick={click}
//             className="table-cell"
//             style={style}
//             dangerouslySetInnerHTML = {html}/>
//     );
//
// };

class Cell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            style : {
                width: props.width
            },
            html : {
                __html: props.data
            }
        }
    }
    componentDidMount() {
        if (this.isContainsImg) {
            this.isContainsImg = false;
            this.handleImgLoad();
        }
    }
    componentDidUpdate() {
        if (this.isContainsImg) {
            this.isContainsImg = false;
            this.handleImgLoad();
        }
    }
    handleImgLoad = () => {
        const images = this.container.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
            images[i].addEventListener('load',() => {
                const [ width, height ] = [ this.container.offsetWidth, this.container.offsetHeight ];
                this.props.resizeCell( width, height, this.props.colIndex, this.props.rowIndex);
            });
        }
    };

    componentWillReceiveProps(newProps) {
        if (this.props.data !== newProps.data && (""+newProps.data).indexOf("<img") > -1) {
            this.isContainsImg = true;
            this.setState({
                style : {
                    width: 'auto'
                },
                html : {
                    __html: newProps.data
                }
            })
            return;
        } else {
            this.setState({
                style : {
                    width: newProps.width
                },
                html : {
                    __html: newProps.data
                }
            })
        }


    }

    click = () => {
        this.props.onClick(this.props.colIndex);
    };
    setRef = div => {
        if (div) this.container = div;
    };
    render() {
        return (
            <div
                ref={this.setRef}
                onClick={this.click}
                className="table-cell"
                style={this.state.style}
                dangerouslySetInnerHTML = {this.state.html}/>
        );
    }

};

export default Cell;
