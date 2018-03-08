const apiRouter = require('express').Router()
const cardRouter = require('./routes/Card')
const algRouter = require('./routes/Alg')
const authRouter = require('./auth/index')
const userRouter = require('./routes/user')

apiRouter.use('/alg', algRouter)
apiRouter.use('/cards', cardRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/user', userRouter)

module.exports = apiRouter;
