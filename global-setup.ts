import { rm } from 'node:fs/promises';

export default async function globalSetup(): Promise<void> {
  await Promise.all(
    ['allure-results', 'allure-report', 'allure-report.zip', 'playwright-report', 'test-results']
      .map((outputPath) => rm(outputPath, { force: true, recursive: true })),
  );
}