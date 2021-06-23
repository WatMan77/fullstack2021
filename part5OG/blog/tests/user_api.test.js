const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog.js')
const User = require('../models/user')
const api = supertest(app)
const helpers = require('../utils/user_helper')

const dummyUsers = [
  {
    username: 'First guy',
    name: 'Just Jeff',
    password: 'MyWeakPassword'
  },
  {
    username: 'Gigachad',
    name: 'Chad',
    password: 'AhYesFrenchFries'
  },
  {
    username: 'Du',
    name: 'ThisIsFine',
    password: 'Yeah!Yeah!'
  },
  {
    username: 'Password',
    name: 'is_too_short',
    password: 'k'
  }
]

beforeEach(async() => {
  await User.deleteMany({})
  let userObject = new User(dummyUsers[0])
  await userObject.save()
})

describe('Users', () => {

  test('adding a user should be fine', async() => {
    await api
      .post('/api/users')
      .send(dummyUsers[1])
      .expect(200)
  })

  test('adding a user already in the DB should not work', async() => {

    const result = await api.post('/api/users').send(dummyUsers[0]).expect(400)
    expect(result.error.text).toContain('"User validation failed: username: Error, expected `username` to be unique.')
  })

  test('with a username too short are not allowed', async() => {
    const result = await api.post('/api/users').send(dummyUsers[2]).expect(401)
    expect(result.error.text).toContain('invalid username or password')
  })

  test('with a passwortd too showrt are not allowed', async() => {
    const result = await api.post('/api/users').send(dummyUsers[3]).expect(401)
    expect(result.error.text).toContain('invalid username or password')
  })


})

afterAll(() => {
  mongoose.connection.close()
})
