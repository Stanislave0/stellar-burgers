import { expect, test } from '@playwright/test';

const ingredientCard = (page: Parameters<typeof test>[0]['page'], name: string) =>
  page.locator('li').filter({
    has: page.getByRole('link', { name: new RegExp(name, 'i') }),
  });

const addIngredient = async (
  page: Parameters<typeof test>[0]['page'],
  name: string
): Promise<void> => {
  await ingredientCard(page, name).getByRole('button', { name: 'Добавить' }).click();
};

test.describe('burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      document.cookie = 'accessToken=Bearer mock-access-token; path=/';
    });

    await page.routeFromHAR('tests/ingredients.har', {
      url: '**/api/**',
      notFound: 'abort',
    });

    await page.goto('/');
  });

  test('добавляет ингредиенты в конструктор', async ({ page }) => {
    await addIngredient(page, 'Краторная булка N-200i');
    await addIngredient(page, 'Биокотлета из марсианской Магнолии');
    await addIngredient(page, 'Соус Spicy-X');

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    const constructorIngredients = page.getByTestId('constructor-ingredients');
    await expect(
      constructorIngredients.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
    await expect(constructorIngredients.getByText('Соус Spicy-X')).toBeVisible();
  });

  test('открывает и закрывает модальное окно ингредиента', async ({ page }) => {
    await page.getByRole('link', { name: /Краторная булка N-200i/i }).click();

    await expect(page).toHaveURL(/\/ingredients\/.+/);
    const modal = page.getByTestId('modal-window');
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  });

  test('закрывает модальное окно по клику на оверлей', async ({ page }) => {
    await page.getByRole('link', { name: /Краторная булка N-200i/i }).click();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  });

  test('создает заказ и очищает конструктор после закрытия модального окна', async ({
    page,
  }) => {
    await addIngredient(page, 'Краторная булка N-200i');
    await addIngredient(page, 'Биокотлета из марсианской Магнолии');
    await addIngredient(page, 'Соус Spicy-X');

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toHaveText('12345');
    await expect(page.locator('[data-testid="constructor-ingredients"]')).toContainText(
      'Выберите начинку'
    );
    await expect(page.getByText('Выберите булки')).toHaveCount(2);

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('order-number')).toHaveCount(0);
    await expect(page.getByTestId('modal-overlay')).toHaveCount(0);
  });
});
