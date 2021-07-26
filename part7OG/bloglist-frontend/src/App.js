import React, { useState, useEffect, useRef } from 'react'
import Blog, { BlogLink } from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/userService'
import ErrorNotif from './components/ErrorNotif'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification, setErrorMessage } from './reducers/notificationReducer'
import { initBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import {
  Route, Switch, Link,
  useRouteMatch
} from 'react-router-dom'
import User from './components/User'

const App = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.notification)
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogUsers, setBlogUsers] = useState([]) //Not in a redux store, but is it necessary?
  const blogFormRef = useRef()

  const match = useRouteMatch('/users/:id')
  const userMatch = match
    ? blogs.filter(x => match.params.id === x.user.id)
    : []
  // Generally, neither of these should get an "undefined"
  // as all id's are taken from the links and not typed by the user
  const blogMatcher = useRouteMatch('/blogs/:id')
  const blogMatch = blogMatcher
    ? blogs.find(x => blogMatcher.params.id === x.id)
    : []

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(initBlogs( blogs ))
    )
    userService.getUsers().then(x => setBlogUsers(x))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')

      dispatch(setNotification(`Successfully logged in as ${user.username}`, 5))

      blogService.setToken(user.token)
    } catch(exception) {
      dispatch(setErrorMessage('Wrong username or password', 5))
      console.log(exception)
    }
  }

  const handleBlog = async(blogObject) => {
    try {
      await blogService.create(blogObject)
      dispatch(initBlogs(await blogService.getAll()))
      blogFormRef.current.toggleVisibility()
      dispatch(setNotification(`New blog created: ${blogObject.title} by ${blogObject.author}`, 5))

    } catch(exception) {
      dispatch(setErrorMessage('Something went wrong', 5))
    }
  }

  const likeBlog = async(blogObject) => {
    try {
      await blogService.like(blogObject)
      dispatch(initBlogs(await blogService.getAll()))
    } catch(execption) {
      dispatch(setErrorMessage('Something went wrong', 5))
    }
  }

  const removeBlog = async(blogObject) => {
    try {
      await blogService.remove(blogObject)

      dispatch(setNotification(`Successfully removed blog ${blogObject.title}`, 5))

      dispatch(initBlogs(await blogService.getAll()))

    } catch(exception) {
      dispatch(setErrorMessage('Removal failed', 5))
    }

  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>login</button>
    </form>
  )

  const blogForm = () => {
    return (
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
        <BlogForm createBlog={handleBlog}/>
      </Togglable>
    )
  }

  if(user === null){
    return(
      <div>
        <h1>Log into the application</h1>
        <ErrorNotif message={notifications.error}/>
        <Notification message={notifications.notification}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <div style={{ padding: 5, backgroundColor: 'lightgray' }}>
        <Link style={{ padding: 3 }} to={'/'}>blogs</Link>
        <Link style={{ padding: 3 }} to={'/users'}>users</Link>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Switch>
        <Route path='/blogs/:id'>
          <Blog key={blogMatch.id} blog={blogMatch} like={likeBlog} remove={removeBlog} />

        </Route>
        <Route path='/users/:id'>
          <h2>added blogs</h2>
          <ul>
            {userMatch.map(x =>
              <li style={{ paddingRight: 5 }} key={x.id}>{x.title}</li>
            )}
          </ul>
        </Route>
        <Route path='/users'>
          <h1>Users</h1>
          <h2>blogs created</h2>
          {blogUsers.map(x =>
            <User key={x.id} username={x.username} amount={x.blogs.length} id={x.id} />
          )}
        </Route>
        <Route path='/'>
          <div>
            <ErrorNotif message={notifications.error}/>
            <Notification message={notifications.notification}/>
            <h2>Blogs front page</h2>
            Create new Blog
            {blogForm()}
            {blogs.map(blog =>
              <BlogLink key={blog.id} blog={blog} />
            )}
          </div>
        </Route>
      </Switch>
    </div>
  )
}

export default App