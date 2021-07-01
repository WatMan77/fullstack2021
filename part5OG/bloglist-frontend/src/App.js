import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import ErrorNotif from './components/ErrorNotif'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notifMessage, setNotifMessage] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      // noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async(event) => {
    event.preventDefault()
    console.log('Logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')

      setNotifMessage(`Successfully logged in as ${user.username}`)
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)

      blogService.setToken(user.token)
    } catch(exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log(exception)
    }
  }

  const handleBlog = async(event) => {
    try {
      event.preventDefault()
      await blogService.create({
        title,
        author,
        url
      })
      setBlogs(await blogService.getAll())
      setNotifMessage(`New blog created: ${title} by ${author}`)
      setTitle('')
      setAuthor('')
      setUrl('')

      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)

    } catch(exception) {
      setErrorMessage('Title or url missing')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input 
        type="password"
        value={password}
        name="password"
        onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={handleBlog}>
      <div>
        title:
        <input
          name="title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        </div>
        <div>
          author
          <input
            name='author'
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
        />
        </div>
        <div>
        url
        <input
          name='url'
          type='text'
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )

    if(user === null){
      return(
        <div>
          <h1>Log into the application</h1>
          <ErrorNotif message={errorMessage}/>
          <Notification message={notifMessage}/>
          {loginForm()}
        </div>
      )
    }

  return (
    <div>
      <ErrorNotif message={errorMessage}/>
      <Notification message={notifMessage}/>
      <h2>Blogs</h2>
      <p>{user.username} logged in
      <button onClick={handleLogout}>logout</button>
      </p>

      Create new Blog
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App