import { LEVELS } from './level.controller';

const HOME_DATA = {};

HOME_DATA.levels = LEVELS.map(level => {
  return {
    id: level.id,
    image: `url(${level.image})`,
    backgroundColor: level.backgroundColor,
    name: level.name
  };
});

export function show(req, res) {
  res.render('index', {
    title: 'Home',
    home: HOME_DATA
  });
}

