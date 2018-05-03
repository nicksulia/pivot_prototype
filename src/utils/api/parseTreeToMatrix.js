const getData = () => {
    return fetch('/anotherMockData/tree.json')
        .then(res => res.json())
};
export default class Matrix {
    formatInHeader(structuredData, deepLevel = 1, isHorizontal) {
        const finalArr = [];
        for (let i = 0; i < deepLevel; i++){
            finalArr[i] = [];
            for (let j = i; j < structuredData.length; j += deepLevel ) {
                finalArr[i] = finalArr[i].concat(structuredData[j]);
            }
        }
        if (isHorizontal) {
            return finalArr;
        } else {
            const verticalArr = [];
            for (let i = 0, len = finalArr[0].length; i < len; i++) {
                verticalArr[i] = [];
                for (let j = 0; j < deepLevel; j++) {
                    verticalArr[i][j] = finalArr[j][i];
                }
            }
            return verticalArr;
        }

    }

    getData() {
        return getData().then(data => this.parseToMatrix(data));
    }

    parseToMatrix(data) {
        let resultArray = [];
        data.forEach((headerRow) => {
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