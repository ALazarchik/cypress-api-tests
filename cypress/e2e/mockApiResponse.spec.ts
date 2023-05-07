import { NEW_ARTICLE } from '../support/constants';

describe('Mock API responses', () => {
    beforeEach('login to the application', () => {
        cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' });
        cy.loginToApplication();
    });

    afterEach('delete added article', () => {
        cy.deleteAddedArticle();
    });

    it('verify correct request and response', () => {
        cy.intercept('POST', 'https://api.realworld.io/api/articles/', (req) => {
            req.body.article.description = `${NEW_ARTICLE.DESCRIPTION} 2`;
        }).as('postNewArticle');

        cy.addNewArticle();

        cy.wait('@postNewArticle').then(xhr => {
            expect(xhr.response.statusCode).to.equal(200);
            expect(xhr.request.body.article.body).to.equal(NEW_ARTICLE.ARTICLE_TEXT);
            expect(xhr.response.body.article.description).to.equal(`${NEW_ARTICLE.DESCRIPTION} 2`);
        });
    });

    it('should mock GET request', () => {
        cy.get('.tag-list').should('contain', 'liverpool').and('contain', 'inter')
            .and('contain', 'arsenal').and('contain', 'barcelona')
            .and('contain', 'real_madrid').and('contain', 'milan');
    });

    it('verify global feed likes count', () => {
        cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', { "articles":[],"articlesCount":0 });
        cy.intercept('GET', 'https://api.realworld.io/api/articles*', { fixture: 'articles.json' });

        cy.contains('Global Feed').click();
        cy.wait(5000);
        cy.get('app-article-list button').then(heartList => {
            expect(heartList[0]).to.contain('1');
            expect(heartList[1]).to.contain('5');
        });

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug;
            file.articles[1].favoritesCount = 6;
            cy.intercept('POST', `https://api.realworld.io/api/articles/${articleLink}/favorite`, file);
        });

        cy.get('app-article-list button').eq(1).click().should('contain', '6');
    });
});
