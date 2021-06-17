const theme = require("../../styles/theme");
describe('Home page', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('should have the primary palette color for the header', () => {
    cy.get('header').should('have.css', 'background-color', theme.palette.primary.main)
  })
})
