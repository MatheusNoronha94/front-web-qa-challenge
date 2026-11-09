import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

test.describe('Acessibilidade', { tag: '@acessibilidade' }, () => {
    test('A11Y-06 formulário de cadastro não deve ter violações de acessibilidade', {
        annotation: {
            type: 'defeito conhecido',
            description: 'DEF-08: contraste insuficiente no contador da Bio (2,56:1) e no botão Register (4,46:1); mínimo WCAG AA é 4,5:1',
        },
    }, async ({ page }) => {
        const form = new RegistrationPage(page);
        await form.open();
        await expect(form.form).toBeVisible();

        const results = await new AxeBuilder({ page })
            .include('[data-testid="registration-form"]')
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        await test.info().attach('relatorio-axe', {
            body: JSON.stringify(results.violations, null, 2),
            contentType: 'application/json',
        });
        const knownIssues = ['color-contrast'];
        const newViolations = results.violations.filter((v) => !knownIssues.includes(v.id));

        expect(newViolations, 'violações de acessibilidade não mapeadas').toEqual([]);
    });

});