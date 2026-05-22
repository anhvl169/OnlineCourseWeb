export class HeaderComponent {

    constructor(page) {

        this.page = page;

        this.userMenuButton =
            page.getByTestId(
                'user-menu-button'
            );

        this.logoutButton =
            page.getByTestId(
                'logout-button'
            );
        this.cartBadge =
            page.getByTestId(
                'cart-badge'
            );
        this.cartIcon =
            page.getByTestId(
                'cart-link'
            );
    }

    async logout() {

        await this.userMenuButton.click();

        await this.logoutButton.click();

    }
    async openCart() {

        await this.cartIcon.click();

    }

}