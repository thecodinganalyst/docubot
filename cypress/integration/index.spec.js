const theme = require("../../styles/theme");
describe('Home page', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('Should display the app bar', () => {
    cy.get('.title').contains('Next Sample')
  })

  it('should have the primary palette color for the header', () => {
    cy.get('header').should('have.css', 'background-color', theme.palette.primary.main)
  })
})
