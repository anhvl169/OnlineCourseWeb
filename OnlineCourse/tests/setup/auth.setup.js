import { test as setup, expect }
    from '@playwright/test';

import { LoginPage }
    from '../pages/LoginPage';

setup('authenticate',
    async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(
            'admin@gmail.com',
            '123456'
        );

        await expect(page)
            .toHaveURL(/OnlineCourse/);

        await expect.poll(async () => {

            return await page.evaluate(() =>
                localStorage.getItem('token')
            );

        }).not.toBeNull();
        
        await page.context().storageState({

            path:
                'playwright/.auth/user.json',

        });

    });