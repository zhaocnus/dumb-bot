/*eslint-disable */
'use strict';
/*eslint-enable */

// Set default node environment to development
let env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (env === 'development') {
  // Register the Babel require hook
  require('babel-register');
}

// Export the application
exports = module.exports = require('./app');
