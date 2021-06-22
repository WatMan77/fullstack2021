const Blog = require('../models/blog.js')

const dummy = (blogs) => {
  // tests?
  return 1
}

const totalLikes = (blogs) => {
  // Helper function!
  const summing = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(summing, 0)
}

// Return the blog with most likes. Return title, author and likes
const favoriteBlog = (blogs) => {
  const getMax = (current, blog) => {
    return current.likes > blog.likes ? current : blog
  }
  const dummyBlog = {
    _id: '0xFFFFFFF',
    title: 'Life is empty',
    author: 'Nobody',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: -1, //Could be slightly risky if there happened to be a bug with likes
    __v: 0
  }
  return blogs.reduce(getMax, dummyBlog)
}

const blogsInDb = async() => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogsInDb
}