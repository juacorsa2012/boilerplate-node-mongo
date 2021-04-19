const logger = require('../utils/logger')

const appLogger = (req, res, next) => {
    const url = req.method + ' ' + req.protocol + '://' + req.get('host') + req.originalUrl
    logger.info(url)
    next()  
}

module.exports = appLogger