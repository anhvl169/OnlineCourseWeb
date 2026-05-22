import { test, expect } from '@playwright/test';

import { HeaderComponent }
    from '../pages/HeaderComponent';

test('user can logout',
    async ({ page }) => {

        const header =
            new HeaderComponent(page);

        await page.goto(
            '/OnlineCourse'
        );

        await header.logout();

        await expect(page)
            .toHaveURL(/login/);

    });