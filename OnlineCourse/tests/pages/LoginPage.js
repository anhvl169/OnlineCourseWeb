export class LoginPage {

    constructor(page) {

        this.page = page;

        this.emailInput =
            page.locator('input[type="email"]');

        this.passwordInput =
            page.locator('input[type="password"]');

        this.loginButton =
            page.getByRole('button', {
                name: 'Đăng nhập'
            });

    }

    async goto() {

        await this.page.goto('/OnlineCourse/login');

    }

    async login(email, password) {

        await this.emailInput.fill(email);

        await this.passwordInput.fill(password);

        await Promise.all([

            this.page.waitForURL(
                /OnlineCourse/
            ),

            this.loginButton.click(),

        ]);

    }

}