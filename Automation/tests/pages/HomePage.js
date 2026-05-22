export class HomePage {

    constructor(page) {
        this.page = page;
        this.courseCards = page.getByTestId(/^course-card-/);
        this.addToCartButtons = page.getByTestId(/^add-to-cart-button-/);
        this.viewDetailsButtons = page.getByTestId(/^view-details-button-/);
    }
}