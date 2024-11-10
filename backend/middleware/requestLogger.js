const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip
  });
  next();
};

module.exports = requestLogger; 