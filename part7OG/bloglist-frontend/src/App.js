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
import { Table, Form, Button, ListGroup, Navbar, Nav } from 'react-bootstrap'

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

  const blogMatcher = useRouteMatch('/blogs/:id')
  const blogMatch = blogMatcher
    ? blogs.find(x => blogMatcher.params.id === x.id)
    : {} // This causes a "failed prop" error at first

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

  const commentBlog = async(event) => {
    try {
      event.preventDefault()
      await blogService.comment({ id: blogMatcher.params.id, comment: event.target.comment.value })
      event.target.comment.value = ''
      // Possible dispatch initBlogs needed
      dispatch(initBlogs(await blogService.getAll()))
    } catch(error) {
      console.log(error)
      dispatch(setErrorMessage('Problem adding a comment', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(setUser(null))
  }

  const loginForm = () => (
    <Form onSubmit={handleLogin}>
      <Form.Label>username</Form.Label>
      <Form.Group>
        <Form.Control
          id='username'
          type='text'
          name='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <Form.Label>password</Form.Label>
        <Form.Control
          id='password'
          type='password'
          value={password}
          name='password'
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button variant='primary' type='submit'>
          login
        </Button>

      </Form.Group>
    </Form>
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
      <ErrorNotif message={notifications.error}/>
      <Notification message={notifications.notification}/>
      <Navbar collapseOnSelect expand='lg' bg='light' variant='dark'>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className='mr-auto'>
            <Nav.Link href='#' as='span'>
              <Link style={{ padding: 3 }} to={'/'}>blogs</Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Link style={{ padding: 3 }} to={'/users'}>users</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <em>{user.username} logged in</em>
        <Button onClick={handleLogout}>logout</Button>
      </Navbar>

      <Switch>
        <Route path='/blogs/:id'>
          <Blog blog={blogMatch} like={likeBlog} remove={removeBlog} comment={commentBlog} />
        </Route>
        <Route path='/users/:id'>
          <h2>added blogs</h2>
          <ListGroup>
            {userMatch.map(x =>
              <ListGroup.Item key={x.id}>{x.title}</ListGroup.Item>
            )}
          </ListGroup>
        </Route>
        <Route path='/users'>
          <h1>Users</h1>
          <h2>blogs created</h2>
          <Table striped>
            <tbody>
              {blogUsers.map(x =>
                <tr key={x.id}>
                  <td>
                    <User username={x.username} amount={x.blogs.length} id={x.id} />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Route>
        <Route path='/'>
          <div>
            <h2>Blogs front page</h2>
            Create new Blog
            {blogForm()}
            <Table striped>
              <tbody>
                {blogs.map(blog =>
                  <tr key={blog.id}>
                    <BlogLink key={blog.id} blog={blog} />
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Route>
      </Switch>
    </div>
  )
}

export default App