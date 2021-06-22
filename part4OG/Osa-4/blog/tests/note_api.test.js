const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog.js')
const api = supertest(app)
const helpers = require('../utils/list_helpers.js')

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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(blogs[0])
  await blogObject.save()
  blogObject = new Blog(blogs[1])
  await blogObject.save()
})

describe('GET request tests', () => {

  // eslint-disable-next-line no-undef
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

describe('Normal post requests', () => {
  
  test('adding a blog should work', async() => {

    await api.post('/api/blogs')
      .send(blogs[3])
      .expect(201)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)
    delete response.body[2].id // Again, cannot compare if the variables in the object are different
    expect(response.body[2]).toEqual(blogs[3])
  })

  test('blog withouth likes should get a default value 0', async() => {
    const toSend = blogs[blogs.length - 1]
    delete toSend.likes // Delete the likes for the test

    await api
      .post('/api/blogs')
      .send(toSend)
      .expect(201)
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(3)
    expect(response.body[2].likes).toEqual(0)
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
      .send(blogCopy[0])
      .expect(201)

    await api
      .post('/api/blogs')
      .send(blogCopy[1])
      .expect(201)

    await api
      .post('/api/blogs')
      .send(blogCopy[2])
      .expect(400)
  })
})

describe('DELETE request', () => {

  test('should work on a simple blog', async() => {
    let theBlogs = await helpers.blogsInDb()
    // console.log(theBlogs)
    expect(theBlogs).toHaveLength(2)
    await api
      .delete(`/api/blogs/${theBlogs[0].id}`)
      .expect(204)
    theBlogs = await helpers.blogsInDb()
    expect(theBlogs).toHaveLength(1)
  })
})

describe('PUT request', () => {

  test('should change likes of a blog', async() => {
    let theBlogs = await helpers.blogsInDb()
    expect(theBlogs[0].likes).toEqual(7)
    theBlogs[0].likes = 66
    await api
      .put(`/api/blogs/${theBlogs[0].id}`)
      .send(theBlogs[0])
      .expect(200)

    theBlogs = await helpers.blogsInDb()
    expect(theBlogs[0].likes).toEqual(66)
  })
})

// eslint-disable-next-line no-undef
afterAll(() => {
  mongoose.connection.close()
})