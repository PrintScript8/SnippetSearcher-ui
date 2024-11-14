import { AUTH0_USERNAME, AUTH0_PASSWORD } from "../../src/utils/constants";

describe('Protected routes test', () => {
  it('should redirect to login when accessing a protected route unauthenticated', () => {
    // Visit the protected route
    cy.visit('/');

    cy.url().then((url) => cy.log(`Current URL: ${url}`));

    // Increase wait time to ensure redirection completes
    cy.wait(3000);

    // Handle commands targeting the Auth0 domain
    cy.origin('https://dev-5zdc2llcm7omxrr3.us.auth0.com', () => {
      // Log the current URL for debugging
      cy.url().then((url) => cy.log(`Current URL after wait: ${url}`));

      // Check if the URL is redirected to the login page
      cy.url({ timeout: 10000 }).should('include', '/login');
    });
  });

  it('should display login content', () => {
    // Visit the login page
    cy.visit('/');

    cy.wait(3000);
    // Handle commands targeting the Auth0 domain
    cy.origin('https://dev-5zdc2llcm7omxrr3.us.auth0.com', () => {
      // Look for text that is likely to appear on a login page
      cy.contains('Log in').should('exist');
      cy.contains('Password').should('exist'); // Adjust the text based on actual content
    });
  });

  it('should not redirect to login when the user is already authenticated', () => {
    cy.loginToAuth0(
      AUTH0_USERNAME,
      AUTH0_PASSWORD
    );

    cy.visit('/');

    cy.wait(3000);

    // Check if the URL is not redirected to the login page
    cy.url().should('not.include', '/login');
  });
});