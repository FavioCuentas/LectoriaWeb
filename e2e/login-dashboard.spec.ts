import { test, expect } from '@playwright/test';

test.describe('Lectoria Admin Login & Dashboard End-to-End Flow', () => {
  test('redirects unauthenticated users from /admin to /login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText('Administración de Lectoria');
  });

  test('allows full authentication flow with credentials and 2FA code', async ({ page }) => {
    await page.goto('/login');

    // Step 1: Fill Credentials
    await page.fill('#admin-email', 'admin@lectoria.app');
    await page.fill('#admin-password', 'password123');
    await page.click('button[type="submit"]');

    // Step 2: 2FA Verification
    await expect(page.locator('h1')).toContainText('Verificación en dos pasos');
    await page.fill('#admin-code', '123456');
    await page.click('button[type="submit"]');

    // Step 3: Success Confirmation and Navigation to /admin
    await expect(page.locator('h1')).toContainText('Acceso verificado');
    await page.waitForURL(/\/admin/, { timeout: 5000 });

    // Verify Dashboard Landing Page
    await expect(page.locator('h1')).toContainText('Resumen');
    await expect(page.getByText('Datos de demostración')).toBeVisible();
    await expect(page.getByText('Usuarios registrados')).toBeVisible();
  });

  test('navigates through sidebar tabs and exports CSV report', async ({ page }) => {
    // Inject mock session into localStorage
    await page.addInitScript(() => {
      localStorage.setItem(
        'lectoria_admin_session',
        JSON.stringify({
          id: 'admin-01',
          name: 'Administrador Lectoria',
          email: 'admin@lectoria.app',
          role: 'Administrador Principal',
          avatarInitials: 'AD',
        })
      );
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Resumen');

    // Navigate to Usuarios tab
    await page.click('button:has-text("Usuarios")');
    await expect(page.locator('h1')).toContainText('Usuarios');
    await expect(page.getByText('Sofía Martínez')).toBeVisible();

    // Navigate to Configuración tab
    await page.click('button:has-text("Configuración")');
    await expect(page.locator('h1')).toContainText('Configuración');

    // Test CSV Download click
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Descargar informe")');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('lectoria-informe-configuracion');
  });
});
