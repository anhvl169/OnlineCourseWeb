export class CartPage {

    constructor(page) {
        this.page = page;
        //data-testid={`cart-item-${item.cart_item_id}`}
        this.cartItems = page.getByTestId(/^cart-item-/);
        this.checkoutButton = page.getByTestId('checkout-button');
        //data-testid={`remove-course-${item.course_id}`}
        this.removeButtons = page.getByTestId(/^remove-course-/);
    }

    async removeCourse(courseId) {
        await this.page.getByTestId(`remove-course-${courseId}`).click();
    }

    async removeFirstCourse() {
        await this.removeButtons.first().click();
    }
    
    async removeAllCourses() {

        while (await this.removeButtons.count() > 0) {

            const countBefore =
                await this.removeButtons.count();

            await this.removeButtons
                .first()
                .click();

            await this.page.waitForFunction(
                (prev) => {

                    return document.querySelectorAll(
                        '[data-testid^="remove-course-"]'
                    ).length < prev;

                },
                countBefore
            );

        }

    }
}