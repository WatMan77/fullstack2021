import React, { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog, like, remove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [infoVisible, setInfoVisible] = useState(false)

  if(!infoVisible){
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => setInfoVisible(!infoVisible)}>show</button>
      </div>
    )
  }

  return(
    <div style={blogStyle}>
      <div>{blog.title}</div>
      <div>{blog.author}</div>
      <div>{blog.likes} <button onClick={() => like(blog)}>like</button></div>
      <div>{blog.url}</div>
      <button onClick={() => setInfoVisible(!infoVisible)}>hide</button>
      <div><button onClick={() => remove(blog)}>remove</button></div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired

}

export default Blog