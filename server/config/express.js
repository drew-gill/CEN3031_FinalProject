const path = require('path'),
  express = require('express'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  toolsRouter = require('../routes/toolsRouter.js'),
  multer = require('multer');

module.exports.init = () => {
  /* 
        connect to database
        - reference README for db uri
    */
  mongoose.connect(process.env.DB_URI || require('./config').db.uri, {
    useNewUrlParser: true
  });
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);

  // initialize app
  const app = express();

  //
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // enable request logging for development debugging
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', toolsRouter);

  if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
  }

  return app;
};
