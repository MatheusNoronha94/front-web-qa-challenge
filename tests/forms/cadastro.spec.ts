import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { buildValidUser } from '../../src/data/registration';

test.describe('Formulário de cadastro', { tag: '@formulario' }, () => {
  let form: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    form = new RegistrationPage(page);
    await form.open();
  });

  test('FRM-01 deve cadastrar com dados válidos', async () => {
    const user = buildValidUser();
    await test.info().attach('dados-do-cadastro', {
      body: JSON.stringify(user, null, 2),
      contentType: 'application/json',
    });

    await form.fillForm(user);
    await form.acceptTerms();
    await form.submit();

    await expect(form.successMessage).toBeVisible();
  });
});