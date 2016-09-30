/**
 * Express configuration
 */
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressHandlebars from 'express-handlebars';

export default function(app) {
  let env = app.get('env');

  app.use(compression());

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  // set view engine
  let viewsPath = path.resolve(__dirname, '../views');
  app.engine('handlebars', expressHandlebars({
    layoutsDir: viewsPath,
    partialsDir: path.join(viewsPath, 'partials')
  }));
  app.set('view engine', 'handlebars');
  app.set('views', viewsPath);

  // production settings
  if (env === 'production') {
    app.enable('view cache');

    let staticPath = path.resolve(__dirname, '../../public');
    app.use(express.static(staticPath));
  }

  // dev settings
  if (env === 'development') {
    let staticPath = path.resolve(__dirname, '../../public');
    app.use(express.static(staticPath));
  }

  app.use(morgan('dev'));
}