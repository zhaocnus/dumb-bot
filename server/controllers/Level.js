import { forOwn, cloneDeep } from 'lodash';
import grid from '../data/grid.json';
import { avatarStylesTemplate } from './level-styles';

function Level(options) {
  options = cloneDeep(options);

  this.levelData = {
    tiles: this.initTiles(options.tiles, options.startTile),
    styles: this.initStyles(options.actions),
    startTileCoord: grid[options.startTile],

    startTile: options.startTile,
    startDirection: options.startDirection,
    destTile: options.destTile,
    actions: options.actions,
    id: options.id,
    name: options.name,
    image: options.image,
    background: options.background,
    nextLevel: options.nextLevel
  };
}

Level.prototype.getPlayData = function() {
  return cloneDeep(this.levelData);
};

Level.prototype.initTiles = function(tiles, startTile) {
  let result = {};

  tiles.forEach(xy => {
    let tile = cloneDeep(grid[xy]);

    result[xy] = {
      x: tile.x,
      y: tile.y,
      notStartTile: xy !== startTile
    };
  });

  return result;
};

Level.prototype.initStyles = function(actions) {
  let tileStyles = [];
  let cancelBtnStyles = [];

  forOwn(actions, (className, id) => {
    tileStyles.push(`#${id}:checked ~ form .tile.${id}`);
    cancelBtnStyles.push(`#${id}:checked ~ form .btn-cancel.${id}`);
  });

  return tileStyles.join(',') + '{z-index:10;} ' +
    cancelBtnStyles.join(',') + '{visibility:visible;}';
};

Level.prototype.getResult = function(data) {
  // reverse data's key and value
  // from: { btn_d0_1: '3_19', btn_d0_2: '3_21', btn_d3_1: '' }
  // to: { 3_19: 'd0', 3_21: 'd1' }
  let actionCoords = [];
  this.actions = {};
  forOwn(data, (value, key) => {
    if (value === '') return;

    let actionName = key.split('_')[1]; // btn_d0_2 to d0

    // save actions on tiles
    this.actions[value] = actionName;

    // get tiles coodinates for displau
    let xy = grid[value];
    actionCoords.push({
      x: xy.x,
      y: xy.y,
      className: actionName
    });
  });

  this.result = [];
  let didWin = this.run(this.levelData.startTile, this.levelData.startDirection);
  let len = this.result.length - 1;

  let keyframes = this.result.map((tile, index) => {
    let xy = grid[tile.xy];
    let percent = Math.round(100 * index / len) + '%'
    let style = avatarStylesTemplate[tile.style];
    return `${percent} {left:${xy.x};top:${xy.y};${style};}`;
  });
  keyframes = keyframes.join(' ');

  let animation = 'ANIM 4s step-start 1s 1 normal forwards';

  let styles = `
    @-o-keyframes ANIM {${keyframes}}
    @-moz-keyframes ANIM {${keyframes}}
    @-webkit-keyframes ANIM {${keyframes}}
    @keyframes ANIM {${keyframes}}
    .avatar {
      left: ${this.levelData.startTileCoord.x};
      top: ${this.levelData.startTileCoord.y};
      -o-animation: ${animation};
      -moz-animation: ${animation};
      -webkit-animation: ${animation};
      animation: ${animation};
    }`;

  return {
    score: 1000 - this.result.length * 10,
    actions: actionCoords,
    didWin: didWin,
    styles: styles,
    levelData: this.levelData
  };
};

Level.prototype.run = function(tile, currentDirection) {
  // Dead!
  if (!this.levelData.tiles.hasOwnProperty(tile)) {
    this.result.push({
      xy: tile,
      style: 'lost'
    });
    return false;
  }

  this.result.push({
    xy: tile,
    style: currentDirection
  });

  // Win!
  if (tile === this.levelData.destTile) {
    return true;
  }

  // go to next tile
  let nextTile;
  let coord = tile.split('_');
  let x = parseInt(coord[0], 10);
  let y = parseInt(coord[1], 10);

  // if there is a user action, use the action,
  // otherwise keep current direction
  let direction = currentDirection;
  if(this.actions.hasOwnProperty(tile)) {
    direction = this.actions[tile];
    delete this.actions[tile]; // action can only be used once
  }

  let dir = direction.split('_')[0];
  switch (dir) {
    case 'd0':
      nextTile = this.neighbor_d0(x, y);
      break;
    case 'd1':
      nextTile = this.neighbor_d1(x, y);
      break;
    case 'd2':
      nextTile = this.neighbor_d2(x, y);
      break;
    case 'd3':
      nextTile = this.neighbor_d3(x, y);
      break;
  }

  let xy = nextTile.x + '_' + nextTile.y;
  return this.run(xy, direction);
};


// 0
Level.prototype.neighbor_d0 = function(x, y) {
  return y % 2 ?
    { x: x - 1, y: y - 1 } :
    { x: x, y: y - 1 };
}

// 1
Level.prototype.neighbor_d1 = function(x, y) {
  return y % 2 ?
    { x: x, y: y - 1 } :
    { x: x + 1, y: y - 1 };
}

// 2
Level.prototype.neighbor_d2 = function(x, y) {
  return y % 2 ?
    { x: x, y: y + 1 } :
    { x: x + 1, y: y + 1 };
}

// 3
Level.prototype.neighbor_d3 = function(x, y) {
  return y % 2 ?
    { x: x - 1, y: y + 1 } :
    { x: x, y: y + 1 };
}

export default Level