import { Page, Locator } from '@playwright/test';

export class DelayedDropdown {
    readonly page: Page;
    readonly card: Locator;
    readonly loadButton: Locator;
    readonly select: Locator;
    readonly loader: Locator;
    readonly result: Locator;
    readonly availableOptions: Locator;

    constructor(page: Page) {
        this.page = page;
        this.card = page.getByTestId('delayed-dropdown-card');
        this.loadButton = this.card.getByRole('button', { name: 'Load Options' });
        this.select = this.card.getByLabel('Select Category');
        this.loader = this.card.getByText('Loading options...');
        this.result = this.card.getByTestId('delayed-dropdown-result');
        this.availableOptions = this.select.locator('option:not([value=""])');
    }

    async open() {
        await this.page.goto('/');
    }

    async loadOptions() {
        await this.loadButton.click();
    }

    async selectFirstAvailableOption() {
        const option = this.availableOptions.first();
        const value = (await option.getAttribute('value')) ?? '';
        const label = (await option.innerText()).trim();
        await this.select.selectOption(value);
        return { value, label };
    }
}