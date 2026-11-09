import { test, expect } from '@playwright/test';
import { FetchUsersCard } from '../../src/pages/FetchUsersCard';

const USERS_API = '**/jsonplaceholder.typicode.com/users*';

test.describe('Integração com API externa', { tag: '@rede' }, () => {
    let card: FetchUsersCard;

    test.beforeEach(async ({ page }) => {
        card = new FetchUsersCard(page);
        await card.open();
    });

    test('NET-01 deve exibir os usuários retornados pela API', async ({ page }) => {
        const mockUsers = [
            { id: 1, name: 'Usuario Simulado QA', email: 'simulado.qa@exemplo.com' },
            { id: 2, name: 'Segundo Simulado QA', email: 'segundo.qa@exemplo.com' },
        ];
        await page.route(USERS_API, (route) => route.fulfill({ json: mockUsers }));

        const response = page.waitForResponse(USERS_API);
        await card.fetchUsers();
        expect((await response).status()).toBe(200);

        await expect(card.status).toContainText(/200 OK.*2 users?/);
        await expect(card.result).toContainText(mockUsers[0].name);
        await expect(card.result).toContainText(mockUsers[1].email);
    });

    test('NET-02 deve informar o erro quando a API falha', async ({ page }) => {
        await page.route(USERS_API, (route) =>
            route.fulfill({ status: 500, body: 'Erro interno simulado' })
        );

        await card.fetchUsers();

        await expect(card.status).toContainText(/500|error|erro|fail/i);
        await expect(card.result).not.toContainText('Usuario Simulado QA');
        await expect(card.fetchButton).toBeEnabled();
    });
});