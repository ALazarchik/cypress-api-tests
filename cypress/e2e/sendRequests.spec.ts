import { NEW_ARTICLE } from '../support/constants';

describe('Send API requests', () => {
    afterEach('delete added article', () => {
        cy.deleteAddedArticle();
    });

    it('delete a new article on global feed', () => {

        const createArticleRequestBody = {
            'article': {
                'tagList': [],
                'title': NEW_ARTICLE.TITLE,
                'description': NEW_ARTICLE.DESCRIPTION,
                'body': NEW_ARTICLE.ARTICLE_TEXT
            }
        }

        cy.loginToApplication();

        cy.get('@token').then(token => {

            cy.request({
                url: `${Cypress.env('apiBaseUrl')}/api/articles/`,
                headers: {'Authorization': `Token ${token}`},
                method: 'POST',
                body: createArticleRequestBody
            }).then(response => {
                expect(response.status).to.equal(200);
            });

            cy.request({
                url: `${Cypress.env('apiBaseUrl')}/api/articles/`,
                method: 'GET',
                headers: {'Authorization': `Token ${token}`}
            }).its('body').then(body => {
                expect(body.articles[0].title).to.equal(NEW_ARTICLE.TITLE);
            });

            cy.contains('Global Feed').click();
            cy.contains(NEW_ARTICLE.TITLE).click();
            cy.contains('Delete Article').click();

            cy.request({
                url: `${Cypress.env('apiBaseUrl')}/api/articles/`,
                method: 'GET',
                headers: {'Authorization': `Token ${token}`}
            }).its('body').then(body => {
                expect(body.articles[0].title).not.to.equal(NEW_ARTICLE.TITLE);
            });
        });
    });
});
