import Level from './Level';

export const LEVELS = [
  {
    tiles: [
      '1_18', '2_19', '2_20', '3_21',
      '3_22', '4_23', '4_22', '4_21',
      '5_21', '4_20', '5_20', '5_19',
      '6_19', '5_18', '5_17', '4_16',
      '4_15', '3_14', '3_13', '2_12',
      '3_11', '3_10', '4_9', '4_8'
    ],
    startTile: '1_18',
    startDirection: 'd2',
    destTile: '4_8',
    actions: {
      btn_d1_1: 'd1',
      btn_d1_2: 'd1',
      btn_d0_1: 'd0'
    },
    id: 1,
    name: 'Snake',
    image: '/img/L1.svg',
    background: 't1',
    backgroundColor: '#ffaaa5',
    nextLevel: 2
  },
  {
    tiles: [
      '3_26', '3_25', '2_24', '2_23', '1_22',
      '4_25', '3_24', '3_23', '2_22', '2_21',
      '4_24', '4_23', '3_22', '3_21', '2_20',
      '5_23', '4_22', '4_21', '3_20', '3_19',
      '3_18', '4_17',
      '4_16', '4_15', '3_14',
      '5_15', '4_14', '4_13',
      '5_14', '5_13', '4_12',
      '6_13', '5_12', '5_11',
      '6_12', '6_11', '5_10'
    ],
    startTile: '3_26',
    startDirection: 'd1',
    destTile: '5_10',
    actions: {
      btn_d0_1: 'd0',
      btn_d0_2: 'd0',
      btn_d1_1: 'd1'
    },
    id: 2,
    name: 'ZigZag',
    image: '/img/L2.svg',
    background: 't2',
    backgroundColor: '#dcedc1',
    nextLevel: 3
  },
  {
    tiles: [
      '3_28', '3_27', '2_26',
      '4_27', '3_26', '3_25',
      '4_26', '4_25', '3_24', '3_23', '2_22', '2_21', '1_20', '1_19',
      '4_23', '3_22', '3_21', '2_20', '2_19', '1_18',
      '4_22', '4_21', '2_17',
      '5_21', '4_20', '2_16',
      '5_20', '5_19', '3_16', '3_15',
      '6_19', '5_18', '3_14',
      '6_18', '6_17', '4_13',
      '7_17', '6_16', '6_15', '5_14', '5_13', '4_12'
    ],
    startTile: '3_28',
    startDirection: 'd0',
    destTile: '3_16',
    actions: {
      btn_d0_1: 'd0',
      btn_d1_1: 'd1',
      btn_d2_2: 'd2',
      btn_d3_1: 'd3'
    },
    id: 3,
    name: 'Hole',
    image: '/img/L3.svg',
    backgroundColor: '#ffd3b6',
    background: 't3'
  },
];

function getLevel(req, res) {
  let levelId = parseInt(req.params.levelId, 10);

  if (isNaN(levelId) || levelId < 1 || levelId > LEVELS.length) {
    res.redirect('/');
    return false;
  }

  let level = new Level(LEVELS[levelId - 1]);
  return level;
}

export function show(req, res) {
  let level = getLevel(req, res);

  if (!level) return;

  res.render('index', {
    title: 'Level 1',
    level: level.getPlayData()
  });
}

export function finishTurn(req, res) {
  let level = getLevel(req, res);

  if (!level) return;

  res.render('index', {
    title: 'Level 1 result',
    levelResult: level.getResult(req.body)
  });
}

export function showHome(req, res) {
  res.render('index', {
    title: 'Home'
  });
}

