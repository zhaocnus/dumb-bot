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

let port = process.env.port || 3333;

// start server
app.listen(port, () => {
  console.log('App listening on port ' + port);
});

// Expose app
exports = module.exports = app;
