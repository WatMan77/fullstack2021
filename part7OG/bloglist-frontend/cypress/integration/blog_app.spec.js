
describe('Blog app', async function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      username: 'Test',
      name: 'Mr.Test',
      password: 'Password'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log into the application')
    cy.contains('password')
    cy.contains('username')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Test')
      cy.get('#password').type('Password')
      cy.get('#login-button').click()

      cy.contains('Successfully logged in as Test')
    })

    it('fails with wrong credentials', function(){
      cy.get('#username').type('Test')
      cy.get('#password').type('Nothingness')
      cy.get('#login-button').click()

      cy.contains('Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Test', password: 'Password' })
    })

    it('A blog can be created', function() {
      cy.contains('create blog').click()

      cy.get('#title').type('Cypress blog')
      cy.get('#author').type('The Tester')
      cy.get('#url').type('www.greattest.com')

      cy.get('#create').click()

      cy.contains('New blog created: Cypress blog by The Tester')
      cy.contains('Cypress blog')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'We testin', author: 'Lester', url: 'www.testingsite.com' })
      // Find the blog by some property and get the parent
      cy.contains('Lester').parent().find('#show-button').click()
      cy.contains('like').click()
    })

    it('A blog can be removed by the creator', function() {
      cy.createBlog({ title: 'We testin', author: 'Lester', url: 'www.testingsite.com' })
      cy.contains('Lester').parent().find('#show-button').click()
      cy.contains('remove').click()
    })
  })

  describe('blog likes', async function() {
    beforeEach(function() {
      cy.login({ username: 'Test', password: 'Password' })
    })
    it.only('blogs are sorted by their likes', async function() {
      cy.createBlog({ title: 'First in!', author: 'Me', url: 'www.test.com' })
      cy.createBlog({ title: 'I was second', author: 'Me', url: 'www.test.com' })
      cy.createBlog({ title: 'Why third?', author: 'Me', url: 'www.test.com' })
      cy.createBlog({ title: 'Give me likes!', author: 'Me', url: 'www.test.com' })

      //This is needed. Otherwise getting the buttons happens
      //on the login page
      cy.contains('I was second')

      cy.get('button').then(blogs => {
        for(let i = 4; i < 8; i++){
          cy.wrap(blogs[i]).click()
        }
      })
      cy.get('.blog').then(blogs => {
        console.log('Blogs?', blogs.length)
        // A slightly random liking process
        for(let i = 0; i < 8; i++){
          for(let j = i % 4; j < 4; j++){
            cy.wrap(blogs[j]).find('#like-button').click()
          }
        }
      })

      // The second .then() causes a warning, but I could not find any other way
      cy.get('.blog').then(blogs => {
        let likes = Number.MAX_SAFE_INTEGER
        blogs.map((i, el) => {
          cy.wrap(el).find('#likes').then(x => {
            const curLikes = Number(x.text()[0])
            console.log(`Comparing ${likes} and ${curLikes}`)
            const value = likes >= curLikes
            expect(value).to.eql(true)
            likes = curLikes
          })
        })
      })
    })
  })
})