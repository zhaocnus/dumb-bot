/**
 * Main application file
 */
import express from 'express';
import routesConfig from './config/routes';
import expressConfig from './config/express';

const app = express();

// config express
expressConfig(app);

// config routes
routesConfig(app);

// start server
app.listen(3333, () => {
  console.log('App listening on port 3333!');
});

// Expose app
exports = module.exports = app;
