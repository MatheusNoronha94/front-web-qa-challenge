import { Page, Locator } from '@playwright/test';

export class FetchUsersCard {
    readonly page: Page;
    readonly fetchButton: Locator;
    readonly status: Locator;
    readonly result: Locator;

    constructor(page: Page) {
        this.page = page;
        this.fetchButton = page.getByRole('button', { name: 'Fetch Users' });
        this.status = page.getByTestId('fetch-users-status');
        this.result = page.getByTestId('fetch-users-result');
    }

    async open() {
        await this.page.goto('/');
    }

    async fetchUsers() {
        await this.fetchButton.click();
    }
}