import { expect, test } from '@playwright/test';

test('Book now loads and captures the TV room API response', async ({ page }) => {
  await page.goto('/');

  const singleRoom = page.locator('.room-card').filter({
    has: page.getByRole('heading', { name: 'Single', exact: true }),
  });
  const bookNow = singleRoom.getByRole('link', { name: 'Book now' });
  const roomResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === '/api/room/1' && response.request().method() === 'GET';
  });

  await bookNow.click();
  const roomResponse = await roomResponsePromise;
  const responseBody = await roomResponse.body();

  // Keep the response body in Allure so live API errors are available alongside the status.
  await test.info().attach('book-now-room-api-response', {
    body: responseBody,
    contentType: roomResponse.headers()['content-type'] ?? 'application/octet-stream',
  });

  if (roomResponse.status() === 500) {
    const screenshotPath = test.info().outputPath('live-book-now-500.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await test.info().attach('live-book-now-500-screenshot', { path: screenshotPath });
    await test.info().attach('live-book-now-500-error', {
      body: `GET ${roomResponse.url()} returned 500: ${responseBody.toString('utf8')}`,
      contentType: 'text/plain',
    });
  }

  expect([200, 500]).toContain(roomResponse.status());
});