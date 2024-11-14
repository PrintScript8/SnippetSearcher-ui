import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";


describe('Add snippet tests', () => {
  beforeEach(() => {
     cy.loginToAuth0(
         AUTH0_USERNAME,
         AUTH0_PASSWORD
     )
    cy.intercept('GET', BACKEND_URL+"/snippets/*", {
      statusCode: 201,
      //body: fakeStore.getSnippetById("1"),
    }).as("getSnippetById")
    cy.intercept('GET', BACKEND_URL+"/snippets").as("getSnippets")

    cy.visit("/")

    // cy.wait("@getSnippets")
    cy.wait(4000) // TODO comment this line and uncomment 19 to wait for the real data
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
  })

  it('Can format snippets', function() {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function() {

    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function() {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})
