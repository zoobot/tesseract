const analysis = require('./analysis/analysis')


module.exports = (app, express) => {
  let router = express.Router();

  router.route('/sentiment')
    .post(analysis.sentiment);

  router.route('/stats')
    .post(analysis.stats);

  return router;
}
