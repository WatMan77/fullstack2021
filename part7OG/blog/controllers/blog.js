const blogRouter = require('express').Router()
const Blog = require('../models/blog')
/* const User = require('../models/user')
const jwt = require('jsonwebtoken') */

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

  if(!request.token || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if(!request.body.likes){
    request.body.likes = 0
  }

  request.body.user = request.user._id // The blog schema needs the user in the body!!
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog)
  await request.user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {

  if(!request.token || !request.user.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const toDelete = await Blog.findById(request.params.id)

  if(toDelete.user.toString() === request.user.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else if(toDelete && toDelete.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'not authorised to remove this blog'})   
  } else {
    return response.status(401).json({ error: 'blog not found' })
  }
})

blogRouter.put('/:id', async(request, response) => {

  // if(!request.token || !request.user.id){
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }

  const body = request.body

  // const toChange = await Blog.findById(request.params.id)

  // if(!toChange.user || toChange.user.toString() !== request.user.id.toString()){
  //   return response.status(401).json({ error: 'not authorised to modify this blog' })
  // }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    // user: toChange.user
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogRouter