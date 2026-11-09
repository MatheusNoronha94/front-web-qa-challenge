import { test, expect } from '@playwright/test';
import { DelayedDropdown } from '../../src/pages/DelayedDropdown';

test.describe('Dropdown assíncrono', { tag: '@dinamico' }, () => {
    let dropdown: DelayedDropdown;

    test.beforeEach(async ({ page }) => {
        dropdown = new DelayedDropdown(page);
        await dropdown.open();
    });

    test('DYN-01 deve carregar e selecionar opção do dropdown assíncrono', async () => {
        await expect(dropdown.select).toBeDisabled();

        await dropdown.loadOptions();
        await expect(dropdown.loader).toBeVisible();
        await expect(dropdown.select).toBeDisabled();

        await expect(dropdown.loader).toBeHidden();
        await expect(dropdown.select).toBeEnabled();
        await expect(dropdown.availableOptions).not.toHaveCount(0);

        const option = await dropdown.selectFirstAvailableOption();
        await expect(dropdown.select).toHaveValue(option.value);
        await expect(dropdown.result).toContainText(option.label);
    });
});