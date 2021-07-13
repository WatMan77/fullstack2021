import React, { useState,  } from 'react'


const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  return (
    <div className='blogForm'>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
            title
          <input
            id='title'
            value={title}
            type='text'
            onChange={handleTitleChange}
          />
        </div>
        <div>
            author
          <input
            id='author'
            type='text'
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
            url
          <input
            id='url'
            type='text'
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button id='create' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm