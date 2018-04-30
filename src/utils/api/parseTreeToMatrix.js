const getData = () => {
    return fetch('/anotherMockData/tree.json')
        .then(res => res.json())
};
export default class Matrix {
    data = null;
    complete = false;
    getData() {
        return getData().then(data => { this.data = data; this.complete = true; return this.parseToMatrix(); });
    }
    isComplete() {
        return this.complete;
    }
    parseToMatrix() {
        let resultArray = [];
        this.data.forEach((headerRow) => {
            resultArray = resultArray.concat(this.objectParser(headerRow, [], 3));
        });
        return resultArray;
    }
    objectParser(object, resultArray = [], maxLevel = 1, currentLevel = 0) {
        if (!resultArray.length){
            for (let i = 0; i < maxLevel; i++) {
                resultArray[i] = [];
            }
        }
        if (currentLevel + 1 === maxLevel - 1) {
            resultArray[currentLevel].push(object.value);
            object.children.forEach((child, index) => {
                if (index) {
                    resultArray[currentLevel].push(null);
                }
                resultArray[maxLevel - 1].push(child.value);
            });
            return object.children.length;
        }
        if (object.children && object.children.length) {
            let count = 0;
            object.children.forEach((child) => {
                count += this.objectParser(child, resultArray, maxLevel, currentLevel + 1);
            });
            resultArray[currentLevel].push(object.value);
            for (let i = 1; i < count; i++) {
                resultArray[currentLevel].push(null);
            }
            if (currentLevel === 0) {
                return resultArray;
            } else return count;
        }
    }
}