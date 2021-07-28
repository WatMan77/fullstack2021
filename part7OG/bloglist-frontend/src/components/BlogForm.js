import React, { useState,  } from 'react'
import { Form } from 'react-bootstrap'

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
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            id='title'
            value={title}
            type='text'
            onChange={handleTitleChange}
          />
          <Form.Label>author</Form.Label>
          <Form.Control
            id='author'
            type='text'
            value={author}
            onChange={handleAuthorChange}
          />
          <Form.Label>url</Form.Label>
          <Form.Control
            id='url'
            type='text'
            value={url}
            onChange={handleUrlChange}
          />
          <button id='create' type='submit'>create</button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm