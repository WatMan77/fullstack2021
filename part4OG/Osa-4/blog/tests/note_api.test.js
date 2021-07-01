const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog.js')
const api = supertest(app)
const helpers = require('../utils/list_helpers.js')
const User = require('../models/user.js')

const dummyUser = {
  username: 'Arska',
  name: 'Arto Hellas',
  password: 'JustSomePassword123'
}

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }  
]
// NOTE! Make sure the user_api tests work. Otherwise we cannot get the token
beforeEach(async () => {
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send(dummyUser)

  const users = await User.find({})
  dummyUser.id = users[0]._id.toString()

  await Blog.deleteMany({})
  let blogObject = new Blog(blogs[0])
  await blogObject.save()
  blogObject = new Blog(blogs[1])
  await blogObject.save()

  const response = await api
    .post('/api/login')
    .send({ username: dummyUser.username, password: dummyUser.password })
  
  dummyUser.token = 'bearer '.concat(response.body.token)
})

describe('GET request tests', () => {

  test('should work in itself', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the body should include 2 blogs', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
  })

  test('first element should be from the ready made blog list', async() => {
    const response = await api.get('/api/blogs')
    delete response.body[0].id //Otherwise we can't compare
    expect(response.body[0]).toEqual(blogs[0])
  })

  test('"id" should be defined', async() => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())

  })
})

describe('Normal POST requests', () => {
  
  test('adding a blog should work', async() => {

    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(blogs[3])
      .expect(201)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(3)
    expect(response.body[2].user.id.toString()).toEqual(dummyUser.id) // Check the owner

    delete response.body[2].id
    delete response.body[2].user // Check the right blog was added
    expect(response.body[2]).toEqual(blogs[3])
  })

  test('blog without likes should get a default value 0', async() => {
    const toSend = blogs.slice(blogs.length - 1, blogs.length) //blogs[blogs.length - 1]
    delete toSend[0].likes // Delete the likes for the test

    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(toSend[0])
      .expect(201)
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(3)
    expect(response.body[2].likes).toEqual(0)
    expect(response.body[2].user.id.toString()).toEqual(dummyUser.id)
  })

  test('post request of blogs without "title" OR "url" should respond with 400 and not add the blogs', async() => {
    const blogCopy = blogs.slice(3) // By using slice, the delete won't affect the blogs

    delete blogCopy[0].title
    delete blogCopy[1].url
    delete blogCopy[2].url
    delete blogCopy[2].title
    // See controllers/blog.js
    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(blogCopy[0])
      .expect(201)

    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(blogCopy[1])
      .expect(201)

    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(blogCopy[2])
      .expect(400)
  })
})

describe('DELETE request', () => {

  test('should work on a simple blog', async() => {
    // Send a blog
    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(blogs[3])

    let theBlogs = await helpers.blogsInDb()

    expect(theBlogs).toHaveLength(3)
    await api
      .delete(`/api/blogs/${theBlogs[2].id}`)
      .set('Authorization', dummyUser.token)
      .expect(204)
    theBlogs = await helpers.blogsInDb()
    expect(theBlogs).toHaveLength(2)
  })

  test('should not work on blogs not created by the user', async() => {
    let theBlogs = await helpers.blogsInDb()

    await api
      .delete(`/api/blogs/${theBlogs[0].id}`)
      .expect(401)
  })
})

describe('PUT request', () => {

  test('should change likes of a blog', async() => {

    await api
      .post('/api/blogs')
      .set('Authorization', dummyUser.token)
      .send(blogs[3])

    let theBlogs = await helpers.blogsInDb()
    expect(theBlogs[2].likes).toEqual(10)
    theBlogs[2].likes = 66

    await api
      .put(`/api/blogs/${theBlogs[2].id}`)
      .set('Authorization', dummyUser.token)
      .send(theBlogs[2])
      .expect(200)

    theBlogs = await helpers.blogsInDb()
    expect(theBlogs[2].likes).toEqual(66)
    expect(theBlogs[2].user.toString()).toEqual(dummyUser.id)
  })

  // Testing whether the owner is someone else rather than having no owner
  // was starting to get annoyingly hard to test
  test('should not change likes if not blog has no owner', async() => {
    
    let theBlogs = await helpers.blogsInDb()
    theBlogs[0].likes = 99

    await api
      .put(`/api/blogs/${theBlogs[0].id}`)
      .set('Authorization', dummyUser.token)
      .send(theBlogs[0])
      .expect(401)
  })
})


// eslint-disable-next-line no-undef
afterAll(() => {
  mongoose.connection.close()
})