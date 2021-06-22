const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
  response.json(blogs)
})

// api/blogs or just /blogs ?

blogRouter.post('/', async(request, response) => {
  // Rules said only if both title AND url are missing
  // Maybe I am taking them too literally but changing && ---> || would then "fix" it
  if(!request.body.title && !request.body.url){
    response.status(400).end() //end() is needed it seems
    return
  }
  if(!request.body.likes){
    request.body.likes = 0
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  request.body.user = user._id
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!request.token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const toDelete = await Blog.findById(request.params.id)
  if(toDelete.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else if(toDelete && toDelete.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'not authorised to remove this blog'})   
  } else {
    return response.status(401).json({ error: 'blog not found' })
  }
})

blogRouter.put('/:id', async(request, response) => {

  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const updatetBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatetBlog)
})

module.exports = blogRouter