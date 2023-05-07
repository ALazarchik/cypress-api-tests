class AddArticlePage {
    private articleTitleInput: string;
    private articleDescriptionInput: string;
    private articleTextInput: string;
    private articleTagsInput: string;
    private publishArticleButton: string;

    constructor() {
        this.articleTitleInput = '[placeholder="Article Title"]';
        this.articleDescriptionInput = '[placeholder="What\'s this article about?"]';
        this.articleTextInput = '[placeholder="Write your article (in markdown)"]';
        this.articleTagsInput = '[placeholder="Enter tags"]';
        this.publishArticleButton = 'button';
    }

    addArticleTitle(title: string) {
        cy.get(this.articleTitleInput).should('be.visible').type(title);
    }

    addArticleDescription(description: string) {
        cy.get(this.articleDescriptionInput).should('be.visible').type(description);
    }

    addArticleText(text: string) {
        cy.get(this.articleTextInput).should('be.visible').type(text);
    }

    submitNewArticle() {
        cy.get(this.publishArticleButton).click();
    }
}

export const addArticlePage = new AddArticlePage();
