# Playwright Booking Checks

## Overview

The live application returned HTTP 500 when the room request was triggered by clicking **Book now**. The tests capture the failed response and a screenshot to support investigation and debugging.

To keep the E2E tests reliable and independent of the broken booking API, the booking workflow mocks the availability, room-detail, and booking responses. This allows the tests to verify name validation and the date-matched booking confirmation UI without relying on the failing backend or creating an actual reservation.

## Running the Tests

Run the following commands locally:


npm ci
npx playwright install chromium
npm test


For interactive execution:


npm run test:headed
npm run test:ui


Generate and open the Allure report:


npm run report:allure
npm run open:allure

**Prerequisite:** Java 17 or newer is required to open the Allure report.

## Test Helpers and Fixtures

`tests/fixtures.ts` provides the shared `stayDates` Playwright fixture. It calculates the browser's local date for check-in and two days later for check-out.

The `formatDate` helper provides both the date-picker format and the ISO format used by the booking link and confirmation assertions. Keeping the fixture and formatter together ensures consistent date handling across tests.

These remain in one file because the suite currently has only one shared fixture and one small formatter. Introducing a separate helpers folder would add unnecessary structure without improving reuse or clarity. If additional independent helpers or fixtures are introduced, they can be split into focused files as the suite grows.

## CI/CD

GitHub Actions executes the Playwright tests:

- On pushes and pull requests to `main` or `master`.
- Daily at 9:00 AM Sydney time, accounting for daylight-saving changes.
- Manually through **Actions > Playwright Tests > Run workflow**.

Test reports are uploaded as GitHub Actions artifacts for later review and investigation.