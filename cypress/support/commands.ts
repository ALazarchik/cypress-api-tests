/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import { NEW_ARTICLE } from './constants';
import { addArticlePage } from './pageObjects/addArticlePage';
import * as dotenv from 'dotenv';
dotenv.config();

Cypress.Commands.add('loginToApplication', () => {
    const loginRequestBody = {
        'user': {
            'email': `${process.env.EMAIL}`,
            'password': `${process.env.PASSWORD}`
        }
    };

    cy.request('POST', 'https://api.realworld.io/api/users/login', loginRequestBody).its('body').then(body => {
        const token = body.user.token;
        cy.wrap(token).as('token');
        cy.visit('/', {
            onBeforeLoad(win: Cypress.AUTWindow) {
                win.localStorage.setItem('jwtToken', token);
            }
        });
    });


    // cy.visit('/login');
    // cy.get('[placeholder="Email"]').clear().type(`${process.env.EMAIL}`);
    // cy.get('[placeholder="Password"]').clear().type(`${process.env.PASSWORD}`);
    // cy.get('form').submit();
});

Cypress.Commands.add('addNewArticle', () => {
    cy.contains('New Article').click();
    addArticlePage.addArticleTitle(NEW_ARTICLE.TITLE);
    addArticlePage.addArticleDescription(NEW_ARTICLE.DESCRIPTION);
    addArticlePage.addArticleText(NEW_ARTICLE.ARTICLE_TEXT);
    addArticlePage.submitNewArticle();
});

Cypress.Commands.add('deleteAddedArticle', () => {
    cy.get('@token').then(token => {
        cy.request({
            url: 'https://api.realworld.io/api/articles/',
            method: 'GET',
            headers: {'Authorization': `Token ${token}`}
        }).its('body').then(body => {
            if(body.articles[0].title === NEW_ARTICLE.TITLE) {
                cy.request({
                    url: `https://api.realworld.io/api/articles/${body.articles[0].slug}`,
                    method: 'DELETE',
                    headers: {'Authorization': `Token ${token}`}
                }).then(response => {
                    expect(response.status).to.equal(204);
                });
            }
        });
    });
});
