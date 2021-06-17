const theme = require("../../styles/theme");
describe('Item page', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.get('header').get('button:first-child').click()
        cy.get('nav a:first-child').click()
    })

    it('should have the primary palette color for the header', () => {
        cy.get('header').should('have.css', 'background-color', theme.palette.primary.main)
    })
})
