const router = require('express').Router()
const { Users } = require('../../db/models')

module.exports = router

router.post('/login', (req, res, next) => {
  console.log('login: ', req.body.email, req.body.password)
  Users.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        res.status(401).send('User not found')
      } else if (!user.correctPassword(req.body.password)) {
        res.status(401).send('Incorrect password')
      } else {
        req.login(user, err => (err ? next(err) : res.json(user)))
      }
    })
    .catch(next)
})

router.post('/signup', (req, res, next) => {
  Users.create(req.body)
    .then((user) => {
      console.log(user)
      req.login(user, err => (err ? next(err) : res.json(user)))
    })
    .catch((err) => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists')
      } else {
        next(err)
      }
    })
})

router.post('/logout', (req, res) => {
  console.log('passport session: ' + req.session.passport)
  req.logout()
  req.session.destroy()
  res.send(req.session)
  // res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))