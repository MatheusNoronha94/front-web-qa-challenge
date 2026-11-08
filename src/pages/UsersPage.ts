import { Page, Locator } from '@playwright/test';

export class UsersPage {
  readonly page: Page;
  readonly table: Locator;
  readonly headers: Locator;
  readonly rows: Locator;
  readonly search: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.getByTestId('data-table');
    this.headers = this.table.getByRole('columnheader');
    this.rows = this.table.locator('tbody').getByRole('row');
    this.search = page.getByPlaceholder('Search users...');
    this.info = page.getByTestId('table-info');
  }

  async open() {
    await this.page.goto('/');
  }
    async searchFor(term: string) {
    await this.search.fill(term);
  }
}