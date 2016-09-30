'use strict';

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

function initGridData() {
  let width = 20;
  let height = width * Math.tan(Math.PI / 6);
  let numX = 18;
  let numY = 40;
  let grid = [];

  // svg attributes
  let viewBoxWidth = width * numX;
  let viewBoxHeight = height * (numY + 1);
  let viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

  for (let y = 0; y < numY; y += 1) {
    let offsetX = (y % 2 === 0) ? width : 0;

    //    1
    // 4     2
    //    3
    for (let x = 0; x < numX; x += 2) {
      let originX = offsetX + x * width,
          originY = y * height,
          x1 = originX + width,
          y1 = originY,
          x2 = originX + width * 2,
          y2 = originY + height,
          x3 = x1,
          y3 = originY + height * 2,
          x4 = originX,
          y4 = y2;

      grid.push({
        x: x / 2,
        y: y,
        centerX: (100 * x1 / viewBoxWidth).toFixed(2) + '%',
        centerY: (100 * y2 / viewBoxHeight).toFixed(2) + '%',
        points: `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`
      });
    }
  }

  return {
    width: viewBoxWidth,
    height: viewBoxHeight,
    viewBox: viewBox,
    grid: grid
  };
}

function main() {
  try {
    let templateString = fs.readFileSync(path.resolve(__dirname, 'grid.tpl.svg'), 'utf8', 'r');
    let template = Handlebars.compile(templateString);
    let data = initGridData();

    // get output svg
    let svg = template(data);

    // get output json
    let json = {};
    data.grid.forEach(node => {
      json[node.x + '_' + node.y] = { x: node.centerX, y: node.centerY };
    });

    // write files
    fs.writeFileSync(
      path.resolve(__dirname, '../public/img', 'grid.svg'),
      svg,
      'utf8'
    );

    fs.writeFileSync(
      path.resolve(__dirname, '../server/data', 'grid.json'),
      JSON.stringify(json, null, 2),
      'utf8'
    );

    console.log('Done!');
  } catch (e) {
    throw e;
  }
}

main();