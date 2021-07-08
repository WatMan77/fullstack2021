const router = require('expres').Router()
const User = require('../models/user.js')
const Blog = require('../models/blog')

router.post('/reset', async(request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router