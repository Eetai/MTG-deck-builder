const apiRouter = require('express').Router()
const cardRouter = require('./routes/Card')
const algRouter = require('./routes/Alg')

apiRouter.use('/alg', algRouter)
apiRouter.use('/cards', cardRouter)

module.exports = apiRouter;
