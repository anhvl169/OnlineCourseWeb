import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can login admin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        'admin@gmail.com',
        '123456'
    );
    await expect(page).toHaveURL(/OnlineCourse/);
});

test('user can login teacher', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        'teacher1@gmail.com',
        '123456'
    );
    await expect(page).toHaveURL(/OnlineCourse/);
});

test('user can login student', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        'student1@gmail.com',
        '123456'
    );
    await expect(page).toHaveURL(/OnlineCourse/);
});

test('user cannot login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        'invalid@gmail.com',
        'invalidpassword'
    );
    await expect(page).toHaveURL('/OnlineCourse/login');
});

test('user cannot login with null credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        '',
        ''
    );
    await expect(page).toHaveURL('/OnlineCourse/login');
});
