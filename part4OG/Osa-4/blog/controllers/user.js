const userRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')


userRouter.get('/', async(request, response) => {
  const result = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1})
  response.json(result)
})

userRouter.post('/', async(request, response) => {

  const body = request.body

  if(!body.username || !body.name || body.username.length < 3 || body.password.length < 3){
    return response.status(401).json({
      error: 'invalid username or password'
    }).end()
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = userRouter