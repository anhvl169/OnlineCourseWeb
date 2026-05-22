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

    }

    async logout() {

        await this.userMenuButton.click();

        await this.logoutButton.click();

    }

}