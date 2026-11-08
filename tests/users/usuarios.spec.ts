import { test, expect } from '@playwright/test';
import { UsersPage } from '../../src/pages/UsersPage';
import { existingUser, nonexistentSearchTerm } from '../../src/data/users';

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

  test('USR-04 deve exibir a tabela vazia ao buscar usuário inexistente', {
    tag: '@mobile',
    annotation: {
      type: 'defeito conhecido',
      description: 'DEF-01: rodapé exibe "Showing 1-0 of 0 entries" e não há mensagem de tabela vazia',
    },
  }, async () => {
    await users.searchFor(nonexistentSearchTerm);

    await expect(users.rows).toHaveCount(0);
    await expect(users.info).toContainText('of 0 entries');
  });

  test('USR-05 deve ordenar os usuários por nome', async () => {
    const total = await users.totalEntries();
    await users.showRowsPerPage('15');
    await expect(users.rows).toHaveCount(Math.min(total, 15));

    const nameCells = await users.columnCells('name');
    const names = await nameCells.allInnerTexts();
    const ascending = [...names].sort((a, b) => a.localeCompare(b));
    const descending = [...ascending].reverse();
    expect(names, 'pré-condição: a lista inicial já vem em ordem alfabética').toEqual(ascending);

    await users.sortBy('name');
    await expect(nameCells).toHaveText(ascending);

    await users.sortBy('name');
    await expect(nameCells).toHaveText(descending);
  });
});