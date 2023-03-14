import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapSuttonTrucks() {
  try {
    // Create browser
    const browser = await puppeteer.launch();

    try {
      // Create page
      const page = await browser.newPage();

      // Truck urls
      let truckUrls: string[] = [];

      // Get all truck links from 3 pages
      for (let i = 1; i < 4; i++) {
        try {
          // Go to each page
          await page.goto(
            `https://www.suttonstrucks.com.au/inventory/trucks?page=${i}`,
            { timeout: 0 }
          );

          try {
            // Scroll to the bottom
            //@ts-ignore
            await scrollPageToBottom(page);

            try {
              // Get all urls in the page
              const truckUrlsPerPage = await page.evaluate(() => {
                // Get all url nodes
                const urlNodes = document.getElementsByClassName(
                  "button button--secondary button--full"
                );

                // Return the full urls
                return Array.from(urlNodes).map(
                  (urlNode) =>
                    `https://www.suttonstrucks.com.au${urlNode.getAttribute(
                      "href"
                    )}`
                );
              });

              //   Add urls to truckUrls
              truckUrls = [...truckUrls, ...truckUrlsPerPage];
            } catch (err) {
              throw err;
            }
          } catch (err) {
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }

      // Get truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to each page
          await page.goto(truckUrls[i], { timeout: 0 });

          try {
            // Get truck details
            const truck = await page.evaluate(() => {
              // Get selector text
              const getSelectorText = (selector: string) =>
                document.querySelector(selector)?.textContent?.trim();

              // Name
              const name = getSelectorText(
                "body > div.content > header > div > div > div > div > h1"
              );

              // Price
              const price = getSelectorText(
                "#vehicleEnquiry > div > div.form__header > div > h2"
              );

              // Year
              const year = name?.split(" ")[0];

              // Make
              const make = name?.split(" ")[1];

              // GVM
              const gvm = getSelectorText(
                "#featuresScrollTo > div > div > div > div > div:nth-child(3) > div > div:nth-child(2) > div:nth-child(2)"
              )?.replace("kg", "KG");

              // Return the truck object
              return { name, price, location: "NSW", year, make, gvm };
            });

            console.log(truck);
          } catch (err) {
            throw err;
          }
        } catch (err) {
          throw err;
        }
      }
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
}
