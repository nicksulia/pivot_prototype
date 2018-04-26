const createContentWrapper = () => {

    const cell = document.createElement('div');
    cell.style.border = '1px solid black';
    cell.style.display = 'table-cell';
    cell.style.whiteSpace = 'nowrap';
    cell.style.left = '-10000px';
    cell.style.position = 'absolute';
    cell.style.top = '-10000px';
    cell.style.visibility = 'visible';

    return cell;
};
export default class CellRenderer {
    _rendererWrapper = createContentWrapper();
    getSize = (content = '') => {
        this._rendererWrapper.innerHTML = content;
        const size = {
            height: this._rendererWrapper.offsetHeight,
            width: this._rendererWrapper.offsetWidth
        };
        return size;
    };

    checkDOMContent = (childNodes) => {
        console.log(childNodes);
        for (let i = 0, len = childNodes.length; i < len; i++) {
            this._rendererWrapper.appendChild(childNodes[i].cloneNode(true));
        }
        const size = {
            height: this._rendererWrapper.offsetHeight,
            width: this._rendererWrapper.offsetWidth
        };
        setTimeout(() => {
            const size = {
                height: this._rendererWrapper.offsetHeight,
                width: this._rendererWrapper.offsetWidth
            };
            console.log(size)}, 1000);
        //return size;
    };

    init = () => {
        document.body.appendChild(this._rendererWrapper);
    };

    clearDOM = () => {
        document.body.removeChild(this._rendererWrapper);
    };
}