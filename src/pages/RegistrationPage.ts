import { Page, Locator } from '@playwright/test';
import { RegistrationData } from '../data/registration';

export class RegistrationPage {
    readonly page: Page;
    readonly form: Locator;
    readonly fullName: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly terms: Locator;
    readonly registerButton: Locator;
    readonly successMessage: Locator;
    readonly nameError: Locator;
    readonly emailError: Locator;
    readonly passwordError: Locator;
    readonly termsError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.getByTestId('registration-form');
        this.fullName = this.form.getByLabel('Full Name *', { exact: true });
        this.email = this.form.getByLabel('Email Address *', { exact: true });
        this.password = this.form.getByLabel('Password *', { exact: true });
        this.terms = this.form.getByRole('checkbox', { name: /I agree to the/ });
        this.registerButton = this.form.getByRole('button', { name: 'Register' });
        this.successMessage = page.getByText('Registration successful! Welcome aboard.');
        this.nameError = this.form.getByTestId('error-fullname');
        this.emailError = this.form.getByTestId('error-email');
        this.passwordError = this.form.getByTestId('error-password');
        this.termsError = this.form.getByTestId('error-terms');
    }

    async open() {
        await this.page.goto('/');
    }

    async fillForm(data: RegistrationData) {
        await this.fullName.fill(data.fullName);
        await this.email.fill(data.email);
        await this.password.fill(data.password);
    }

    async acceptTerms() {
        await this.terms.check();
    }

    async submit() {
        await this.registerButton.click();
    }
}