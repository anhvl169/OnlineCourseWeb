import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { HeaderComponent } from '../pages/HeaderComponent';
import { CartPage } from '../pages/CartPage';

export const test = base.extend({

    homePage: async ({ page }, use) => {
        await use(
            new HomePage(page)
        );
    },

    header: async ({ page }, use) => {
        await use(
            new HeaderComponent(page)
        );
    },

    cartPage: async ({ page }, use) => {
        await use(
            new CartPage(page)
        );
    },

});

export { expect } from '@playwright/test';