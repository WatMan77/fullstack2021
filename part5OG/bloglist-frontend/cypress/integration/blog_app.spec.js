describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://3003/api/test/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log into the application')
    cy.contains('password')
    cy.contains('username')
  })
})