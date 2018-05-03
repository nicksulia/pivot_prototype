const createContentWrapper = () => {

    const cell = document.createElement('div');
    cell.style.border = '1px solid black';
    cell.style.display = 'table-cell';
    cell.style.whiteSpace = 'nowrap';
    cell.style.left = '-10000px';
    cell.style.position = 'absolute';
    cell.style.top = '-10000px';
    cell.style.visibility = 'hidden';

    return cell;
};
 export class CellRenderer {
    _rendererWrapper = createContentWrapper();
    _getSize = (content = '') => {
        this._rendererWrapper.textContent = content;
        const size = {
            height: this._rendererWrapper.offsetHeight,
            width: this._rendererWrapper.offsetWidth
        };
        return size;
    };

    init = () => {
        document.body.appendChild(this._rendererWrapper);
    };

    clearDOM = () => {
        document.body.removeChild(this._rendererWrapper);
    };

    getElementsSize = (data, minIndex, maxIndex, colWidth, rowHeight) => {
         const newRowHeight = rowHeight.length ? rowHeight.slice(0) : new Array(maxIndex - minIndex);
         const newColWidth = colWidth.length ? colWidth.slice(0) : new Array( data[0] && data[0].length );
         for (let i = (minIndex >= 0 && minIndex < data.length) ? minIndex : 0,
                  length = maxIndex < data.length ? maxIndex : data.length;
              i < length; i += 1) {
             data[i].forEach((el, index) => {
                 const { width, height } = this._getSize(el);
                 if (newRowHeight[i] === undefined) {
                     newRowHeight[i] = height;
                 } else {
                     newRowHeight[i] = height > newRowHeight[i] ? height : newRowHeight[i];
                 }
                 if (newColWidth[index] === undefined) {
                     newColWidth[index] = width;
                 } else {
                     newColWidth[index] = width > newColWidth[index] ? width : newColWidth[index];
                 }
             })
         }
         return [ newColWidth, newRowHeight ];
     }
}
