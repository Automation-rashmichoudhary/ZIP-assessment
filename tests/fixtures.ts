import { test as base } from '@playwright/test';

type StayDates = {
  checkInInput: string;
  checkOutInput: string;
  checkInIso: string;
  checkOutIso: string;
};

export const test = base.extend<{ stayDates: StayDates }>({
  stayDates: async ({ page }, use) => {
    const stayDates = await page.evaluate(() => {
      // Use browser-local dates to match the date picker's displayed calendar values.
      const checkIn = new Date();
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 2);

      const formatDate = (date: Date, separator: string): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return separator === '-'
          ? `${year}-${month}-${day}`
          : `${day}/${month}/${year}`;
      };

      return {
        checkInInput: formatDate(checkIn, '/'),
        checkOutInput: formatDate(checkOut, '/'),
        checkInIso: formatDate(checkIn, '-'),
        checkOutIso: formatDate(checkOut, '-'),
      };
    });

    await use(stayDates);
  },
});