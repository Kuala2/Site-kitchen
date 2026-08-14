import { test, expect } from '@playwright/test';

const routes = [
  '/', '/projects', '/projects/linen-light', '/projects/walnut-line',
  '/projects/chalk-frame', '/projects/olive-island', '/projects/ash-corner',
  '/projects/graphite-block', '/projects/quiet-wardrobe',
  '/projects/living-contour', '/projects/work-niche', '/calculator',
  '/materials', '/about', '/contacts', '/missing-page',
];

for (const route of routes) {
  test(`прямой маршрут ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.reload();
    await expect(page.locator('main')).toBeVisible();
  });
}

test('главная показывает актуальный hero и диапазон решений', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.raHomeHero')).toBeVisible();
  await expect(page.locator('.raHomeRangeItem')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: /Точность/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Смотреть проекты' })).toHaveAttribute('href', '/projects/');
});

test('фильтр проектов сохраняется в URL и меняет выдачу', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Гардеробные' }).click();
  await expect(page).toHaveURL(/room=wardrobe/);
  await expect(page.locator('.raProjectRecord')).toHaveCount(1);
  await page.getByRole('button', { name: 'Все' }).click();
  await expect(page).not.toHaveURL(/room=/);
  await expect(page.locator('.raProjectRecord')).toHaveCount(9);
});

test('лаборатория материалов переключает группы и передаёт выбор в расчёт', async ({ page }) => {
  await page.goto('/materials');
  await page.getByRole('button', { name: 'Столешницы' }).click();
  await page.getByRole('button', { name: 'Искусственный камень' }).click();
  await expect(page.locator('.materialPreviewHeading strong')).toHaveText('Искусственный камень');
  await page.getByRole('link', { name: /Использовать в расчёте/ }).click();
  await expect(page).toHaveURL(/\/calculator\//);
  await expect(page).toHaveURL(/worktop=/);
});

test('калькулятор проходит пять шагов и сохраняет параметры в URL', async ({ page }) => {
  await page.goto('/calculator');
  await page.getByRole('button', { name: /Гардеробная/ }).click();
  await page.getByRole('button', { name: /Продолжить/ }).click();
  await page.getByRole('button', { name: 'Г-образная' }).click();
  await page.getByLabel('Ширина / общая длина').fill('4100');
  await page.getByRole('button', { name: /Продолжить/ }).click();
  await page.getByRole('button', { name: /Натуральный шпон/ }).click();
  await page.getByRole('button', { name: /Продолжить/ }).click();
  await page.getByRole('button', { name: /Продолжить/ }).click();
  await expect(page.getByRole('heading', { name: 'Ориентир готов' })).toBeVisible();
  await expect(page.locator('.estimateSummary')).toContainText('Гардеробная · Г-образная');
  await expect(page).toHaveURL(/type=wardrobe/);
  await expect(page).toHaveURL(/width=4100/);
});

test('контактная форма валидируется локально и ничего не отправляет', async ({ page }) => {
  const mutations: string[] = [];
  page.on('request', (request) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) mutations.push(request.url());
  });
  await page.goto('/contacts');
  await page.getByRole('button', { name: /Подготовить запрос/ }).click();
  await expect(page.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Имя').fill('Тест');
  await page.locator('input[name="contact"]').fill('+7 900 000-00-00');
  await page.getByRole('button', { name: /Подготовить запрос/ }).click();
  await expect(page.getByRole('status')).toContainText('Основные данные заполнены');
  expect(mutations).toEqual([]);
});

test('мобильное меню закрывается Escape и возвращает фокус', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  const menu = page.locator('.menuButton');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});
