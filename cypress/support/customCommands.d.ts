declare namespace Cypress {
    interface Chainable<Subject> {
        loginToApplication(): Chainable<any>;
        addNewArticle(): Chainable<any>;
        deleteAddedArticle(): Chainable<any>;
    }
}
