require('custom-env').env()

const logger = require('./utils/logger')

const app = require('./app')

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {   
    logger.info(`Environment: ${process.env.NODE_ENV}`)
    logger.info(`Server is running at http://localhost:${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`)
    server.close(() => process.exit(1))
});

module.exports = server