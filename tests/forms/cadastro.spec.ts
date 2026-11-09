import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { buildValidUser } from '../../src/data/registration';

test.describe('Formulário de cadastro', { tag: '@formulario' }, () => {
  let form: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    form = new RegistrationPage(page);
    await form.open();
  });

  test('FRM-01 deve cadastrar com dados válidos', { tag: '@mobile' }, async () => {

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
  test('FRM-02/03 deve exibir mensagens de erro para dados inválidos', async () => {
    await test.step('envio com campos obrigatórios vazios', async () => {
      await form.submit();

      await expect(form.nameError).toHaveText('Name is required');
      await expect(form.emailError).toHaveText('Valid email is required');
      await expect(form.passwordError).toHaveText('Password must be at least 8 characters');
      await expect(form.termsError).toHaveText('You must accept the terms');
      await expect(form.successMessage).toBeHidden();
    });

    await test.step('envio com e-mail inválido', async () => {
      const user = { ...buildValidUser(), email: 'teste@' };
      await form.fillForm(user);
      await form.acceptTerms();
      await form.submit();

      await expect(form.emailError).toHaveText('Valid email is required');
      await expect(form.nameError).toBeEmpty();
      await expect(form.successMessage).toBeHidden();
    });
  });
});