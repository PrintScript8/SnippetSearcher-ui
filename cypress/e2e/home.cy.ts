import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";
import {CreateSnippet} from "../../src/utils/snippet";

describe('Home', () => {
  beforeEach(() => {
      cy.loginToAuth0(
          AUTH0_USERNAME,
          AUTH0_PASSWORD
      )
  })
  before(() => {
    process.env.FRONTEND_URL = Cypress.env("FRONTEND_URL");
    process.env.BACKEND_URL = Cypress.env("BACKEND_URL");
  })
  it('Renders home', () => {
    cy.visit(FRONTEND_URL)
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
    /* ==== End Cypress Studio ==== */
  })

  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit(FRONTEND_URL)
    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    cy.wait(500)
    first10Snippets.should('have.length.greaterThan', 0)

    first10Snippets.should('have.length.lessThan', 10)
  })

  it('Can creat snippet find snippets by name', () => {
    cy.visit(FRONTEND_URL)
    const snippetData: CreateSnippet = {
      name: "Test name",
      content: "println(5);",
      language: "printscript",
      extension: "prs"
    }

    cy.intercept('GET', BACKEND_URL+"/snippets*", (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');

    cy.request({
      method: 'POST',
      url: 'snippets/snippets', // Adjust if you have a different base URL configured in Cypress
      body: snippetData,
      headers: {
        'Authorization' : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ" +
            "odHRwczovL2Rldi01emRjMmxsY203b214cnIzLnVz" +
            "LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NzBiZTE" +
            "3MzRhNTNiNDQzN2NkZTg4NmIiLCJhdWQiOlsiaHR0cHM6L" +
            "y9TbmlwcGV0U2VyY2hlci1BUEkyLyJdLCJpYXQiOjE3MzE2MDQ" +
            "4NTMsImV4cCI6MTczMTY5MTI1Mywic2NvcGUiOiJvcGVuaWQgcH" +
            "JvZmlsZSBlbWFpbCIsImF6cCI6IjFuRERlbjZWN1NqamdLRE1EVn" +
            "RmdmQ5OFNydUhMd3NtIn0.HtIKaXLNlr_6Wgfmoa6yMrJf-NHS-6NagXqWkj-vyvA",
      },
      failOnStatusCode: false // Optional: set to true if you want the test to fail on non-2xx status codes
    }).then((response) => {
      expect(response.status).to.eq(201);

      //expect(response.body.name).to.eq(snippetData.name)
      //expect(response.body.content).to.eq(snippetData.content)
      //expect(response.body.language).to.eq(snippetData.language)
      //expect(response.body).to.haveOwnProperty("id")

      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear();
      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name + "{enter}");

      // cy.wait("@getSnippets")
      cy.contains(snippetData.name).should('exist');
    })
  })
})
