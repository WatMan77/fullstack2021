import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

export const BlogLink = ({ blog }) => {
  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
    </div>
  )
}

const Blog = ({ blog, like, remove }) => {


  return(
    <div style={blogStyle} className='blog'>
      <div><h1>{blog.title}</h1></div>
      <div><Link to={blog.url}>{blog.url}</Link></div>
      <div>{blog.author}</div>
      <div id='likes'>{blog.likes} <button id='like-button' onClick={() => like(blog)}>like</button></div>
      <div><button onClick={() => remove(blog)}>remove</button></div>
      <p>added by {blog.user.username}</p>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
}

export default Blog