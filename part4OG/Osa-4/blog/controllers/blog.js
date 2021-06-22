const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  /* Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    }) */
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
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
  /* blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }) */
})

blogRouter.delete('/:id', async(request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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