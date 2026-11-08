import { Page, Locator } from '@playwright/test';

export class UsersPage {
    readonly page: Page;
    readonly table: Locator;
    readonly headers: Locator;
    readonly rows: Locator;
    readonly search: Locator;
    readonly info: Locator;
    readonly rowsPerPage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.getByTestId('data-table');
        this.headers = this.table.getByRole('columnheader');
        this.rows = this.table.locator('tbody').getByRole('row');
        this.search = page.getByPlaceholder('Search users...');
        this.info = page.getByTestId('table-info');
        this.rowsPerPage = page.getByTestId('rows-per-page');
    }
    async open() {
        await this.page.goto('/');
    }
    async searchFor(term: string) {
        await this.search.fill(term);
    }
    async showRowsPerPage(amount: '5' | '10' | '15') {
        await this.rowsPerPage.selectOption(amount);
    }

    async sortBy(columnName: string) {
        await this.table.getByRole('columnheader', { name: new RegExp(`^${columnName}`, 'i') }).click();
    }

    async columnCells(columnName: string) {
        const headers = await this.headers.allInnerTexts();
        const index = headers.findIndex((h) => h.trim().toLowerCase().startsWith(columnName.toLowerCase()));
        return this.rows.locator(`td:nth-child(${index + 1})`);
    }
    async totalEntries() {
        await this.info.waitFor();
        const text = await this.info.innerText();
        const match = text.match(/of (\d+) entries/);
        return Number(match?.[1] ?? 0);
    }
}