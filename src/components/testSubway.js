/* eslint-disable quote-props,comma-dangle,quotes */
const data = {
    "data": [
        {
            "地铁线路": "11号线(在建),广佛线",
            "地铁站点": "燕岗",
            "distIn": {
                "广纸小区": "32.0",
                "富力顺意花园": "47.4",
                "保利花园": "49.2",
                "保利红棉花园": "44.8",
                "保利海棠花园": "59.8",
                "保利百合花园": "53.4",
                "工业大道中小区": "41.7"
            },
            "distOut": {
            }
        },
        {
            "地铁线路": "8号线,广佛线",
            "地铁站点": "沙园",
            "distIn": {
                "光大花园": "63.2",
                "中海橡园国际": "74.5"
            },
            "distOut": {
                "金碧湾": "69.5"
            }
        }
        ]
};
const fs = require('fs'),
path = require('path');

const file = path.resolve(__dirname, '../subwayData-edit.json');
const obj = {};
const subData = data.data.map((v, index) => {
    const station = v[`地铁站点`];
    const distIn = v[`distIn`];
    const distOut = v[`distOut`];
    obj[`${station}`] = { distIn, distOut };
    return JSON.stringify(obj);
});
console.log(obj);

const parseObj = JSON.stringify(obj);
fs.writeFile(file, parseObj, (err, fd) => {
    if (err) {
        console.error(err);
    }
});
