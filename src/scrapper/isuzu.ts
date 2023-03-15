import puppeteer from "puppeteer";

export default async function scrapIsuzu() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      // All truck urls
      let truckUrls: string[] = [];

      // Get truck urls from all 9 pages
      for (let i = 1; i < 10; i++) {
        // Go to the page
        await page.goto(
          `https://stock.isuzu.com.au/north-east/listing?page=${i}`,
          { timeout: 0 }
        );

        try {
          // Get all urls in the page
          const truckUrlsPerPage = await page.evaluate(() => {
            // Get all url nodes
            const urlNodes = document.querySelectorAll(
              "#car-search > div > div.layout.clearfix > div > div > div > div.car-details > a"
            );

            // Return the full urls
            return Array.from(urlNodes).map(
              (urlNode) => urlNode.getAttribute("href") as string
            );
          });

          // Add urls to truckUrls
          truckUrls = [...truckUrls, ...truckUrlsPerPage];
        } catch (err) {
          throw err;
        }
      }

      // Collect truck details
      for (let i = 0; i < truckUrls.length; i++) {
        try {
          // Go to truck page
          await page.goto(truckUrls[i], { timeout: 0 });

          try {
            // Create truck details
            const truck = await page.evaluate(() => {
              // Name
              const name = document.querySelector(
                "body > section > div > div.cl-content > div:nth-child(2) > div.d-col-9 > h1"
              )?.textContent;

              // Price
              const price = document.querySelector(
                "body > section > div > div.cl-content > div:nth-child(2) > div.d-col-3 > div > div > div > span.t-large"
              )?.textContent;

              // Year
              const year = document.querySelector(
                "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > ul > li:nth-child(2) > span"
              )?.textContent;

              // Make
              const make = document
                .querySelector(
                  "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > ul > li:nth-child(7) > span"
                )
                ?.textContent?.split(",")[0];

              // Model
              const model = document
                .querySelector(
                  "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > ul > li:nth-child(7) > span"
                )
                ?.textContent?.split(",")[1];

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > div.car-gallery > div > div.gallery-layout > div > ul > li > a > img"
              );

              // GVM
              const gvm = document.querySelector(
                "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > ul > li:nth-child(9) > span"
              )?.textContent;

              // Kilometers
              const kilometers = document.querySelector(
                "body > section > div > div.cl-content > div:nth-child(3) > div.d-col-9 > ul > li:nth-child(6) > span"
              )?.textContent;

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("src")
              );

              // Return the truck object
              return {
                name,
                price,
                year,
                make,
                gvm,
                model,
                images,
                kilometers,
                location: "SA",
              };
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
