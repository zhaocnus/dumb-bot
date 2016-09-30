/**
 * Routing configuration
 */
import * as levelCtrl from '../controllers/level.controller';
import * as homeCtrl from '../controllers/home.controller';

export default function(app) {
  app.get('/', homeCtrl.show);

  app.get('/level/:levelId', levelCtrl.show);

  app.post('/finishturn/:levelId', levelCtrl.finishTurn);

  app.get('*', (req, res) => {
    res.redirect('/');
  });
}
