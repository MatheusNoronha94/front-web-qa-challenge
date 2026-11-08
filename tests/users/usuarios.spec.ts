import { test, expect } from '@playwright/test';
import { UsersPage } from '../../src/pages/UsersPage';
import { existingUser } from '../../src/data/users';

test.describe('Gerenciamento de usuários', { tag: '@usuarios' }, () => {
  let users: UsersPage;

  test.beforeEach(async ({ page }) => {
    users = new UsersPage(page);
    await users.open();
  });

  test('USR-01 deve carregar a tabela com cabeçalhos e a primeira página', { tag: '@mobile' }, async () => {
    await expect(users.headers).toHaveText(['', /id/i, /name/i, /email/i, /role/i, /status/i, /actions/i]);
    await expect(users.rows).toHaveCount(5);
    await expect(users.info).toHaveText('Showing 1-5 of 15 entries');
  });
  
    test('USR-03 deve encontrar um usuário existente pela busca', { tag: '@mobile' }, async () => {
    await users.searchFor(existingUser.searchTerm);

    await expect(users.rows).toHaveCount(1);
    const row = users.rows.first();
    await expect(row).toContainText(existingUser.name);
    await expect(row).toContainText(existingUser.email);
    await expect(row).toContainText(existingUser.status);
    await expect(users.info).toHaveText('Showing 1-1 of 1 entries');
  });
});