const fs = require('fs');
const path = require('path');
const fileFormat = "utf8";
if (fs.existsSync(path.resolve(__dirname, `./public/mockData/data.json`))) {
    fs.unlinkSync(path.resolve(__dirname, `./public/mockData/data.json`));
    fs.rmdirSync(path.resolve(__dirname, './public/mockData'));
}
fs.mkdirSync(path.resolve(__dirname, './public/mockData'));

//dummy data generation
const dataArray = [];
const names = ['John', 'Robert', 'Liana', 'Edward', 'Ann', 'Richard', 'Amie', 'Michael', 'Lily', 'Ragnar', 'Ivar', 'Ubba', 'Loki', 'Thor', 'Odin'];

const randomString = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
};
const randomNum = (limit, isInt) => {
    if (isInt) {
        return parseInt(Math.random()*limit + 1);
    }
    return Math.random()*limit;
};

const colLim = 20;
for ( let i = 0; i < 500; i ++ ) {
    dataArray[i] = [];
    dataArray[i][0] = i;
    for ( let j = 1; j < 50; j ++ ) {
        dataArray[i][j] = randomNum(1000000, true);
    }
}
fs.writeFileSync(path.resolve(__dirname, `./public/mockData/data.json`), JSON.stringify(dataArray), fileFormat);
