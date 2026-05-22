import { test, expect } from '../../fixtures/baseTest';

const clearCart = async (cartPage, header) => {
    if (await header.cartBadge.isVisible()) {
        await header.openCart();

        await cartPage.removeAllCourses();

    }
};

test('user can add course to cart',
    async ({ page, homePage, header, cartPage }) => {

        await page.goto(
            '/OnlineCourse'
        );
        await clearCart(cartPage, header);
        await homePage.addToCartButtons.nth(0).click();
        await expect(
            header.cartBadge
        ).toHaveText(/\d+/);

        await clearCart(cartPage, header);
    });

test('user can not add course to cart duplicately',
    async ({ page, homePage, header, cartPage }) => {
        await page.goto(
            '/OnlineCourse'
        );
        await clearCart(cartPage, header);
        await homePage.addToCartButtons.nth(0).click();
        await expect(
            header.cartBadge
        ).toHaveText('1');
        await homePage.addToCartButtons.nth(0).click();
        await expect(
            header.cartBadge
        ).toHaveText('1');

        await clearCart(cartPage, header);
    });

test('user can remove course from cart',
    async ({ page, homePage, header, cartPage }) => {
        await page.goto('/OnlineCourse/cart');
        await clearCart(cartPage, header);
        await page.goto('/OnlineCourse');
        await homePage.addToCartButtons.nth(0).click();
        await header.openCart();
        await cartPage.removeFirstCourse();
        await expect(
            header.cartBadge
        ).not.toBeVisible();
    });