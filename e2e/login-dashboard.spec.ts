import { test, expect } from '@playwright/test';

test.describe('Lectoria Supabase authentication boundary', () => {
  test('redirects unauthenticated users from /admin to /login', async ({ page }) => {
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText('Administración de Lectoria');
  });

  test('does not trust the legacy simulated localStorage session', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'lectoria_admin_session',
        JSON.stringify({
          id: 'admin-01',
          email: 'admin@lectoria.app',
          role: 'admin',
        })
      );
    });

    await page.goto('/admin');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Datos de demostración')).not.toBeVisible();
  });

  test('exposes Magic Link instead of the removed password and simulated 2FA flow', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Correo')).toBeVisible();
    await expect(page.getByRole('button', { name: /Enviar enlace de acceso/i })).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toHaveCount(0);
    await expect(page.locator('#admin-code')).toHaveCount(0);
  });
});
