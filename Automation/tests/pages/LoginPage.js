export class LoginPage {

    constructor(page) {

        this.page = page;

        this.emailInput =
            page.getByTestId(
                'email-input'
            );

        this.passwordInput =
            page.getByTestId(
                'password-input'
            );

        this.loginButton =
            page.getByTestId(
                'login-button'
            );

    }

    async goto() {

        await this.page.goto(
            '/OnlineCourse/login'
        );

    }

    async login(email, password) {

        await this.emailInput
            .fill(email);

        await this.passwordInput
            .fill(password);

        await this.loginButton
            .click();

    }

}