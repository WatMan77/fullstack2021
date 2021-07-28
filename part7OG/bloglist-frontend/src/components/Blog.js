import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import { useDispatch } from 'react-redux'

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

const Blog = ({ blog, like, remove, comment }) => {

  // Preventing an "undefined" error here as older blogs might not have comments
  if(!blog){
    return null
  }
  let comments = []
  if(blog.comments) {
    comments = blog.comments
  }

  return(
    <div style={blogStyle} className='blog'>
      <div><h1>{blog.title}</h1></div>
      <div><Link to={blog.url}>{blog.url}</Link></div>
      <div>{blog.author}</div>
      <div id='likes'>{blog.likes} <button id='like-button' onClick={() => like(blog)}>like</button></div>
      <div><button onClick={() => remove(blog)}>remove</button></div>
      <p>added by {blog.user.username}</p>
      <form onSubmit={comment}>
        <input name='comment'/>
        <button type='submit'>add comment</button>
      </form>
      <h2>comments</h2>
      <ul>
        {comments.map((x, i) =>
          <li key={i}>{x}</li>
        )}
      </ul>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
}

export default Blog