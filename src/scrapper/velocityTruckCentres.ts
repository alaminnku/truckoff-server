import puppeteer from "puppeteer";

export default async function scrapVelocityTruckCentres() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      // Truck URLs
      let truckUrls: string[] = [];

      // Get all truck urls from 5 pages
      for (let i = 1; i < 5; i++) {
        try {
          // Go to the page
          await page.goto(
            `https://www.velocitytruckcentres.com.au/inventory/used-trucks?current_page=${i}`,
            { timeout: 0 }
          );

          try {
            // Get all urls in the page
            const truckUrlsPerPage = await page.evaluate(() => {
              // Get all url nodes
              const urlNodes = document.getElementsByClassName(
                "list-bottom listing-view"
              );

              // Return the full urls
              return Array.from(urlNodes).map(
                (urlNode) =>
                  `https://www.velocitytruckcentres.com.au/inventory/used-trucks/${urlNode.getAttribute(
                    "data-slug"
                  )}`
              );
            });

            // Add urls to truckUrls
            truckUrls = [...truckUrls, ...truckUrlsPerPage];
          } catch (err) {
            throw err;
          }
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
              // Get feature text
              const getFeatureText = (identifier: string) =>
                Array.from(document.querySelectorAll("#descText > li"))
                  .find(
                    (feature) =>
                      feature.firstElementChild?.textContent?.trim() ===
                      identifier
                  )
                  ?.lastElementChild?.textContent?.trim();

              // Name
              const name = document
                .querySelector("#detail-inv-title")
                ?.textContent?.trim();

              // Year
              const year = getFeatureText("Year");

              // Make
              const make = getFeatureText("Make");

              // Model
              const model = getFeatureText("Model");

              // Get image nodes
              const imageNodes = document.querySelectorAll(
                "#carousel > div.owl-wrapper-outer > div > div > div > img"
              );

              // Get all images
              const images = Array.from(imageNodes).map((imageNode) =>
                imageNode.getAttribute("data-src")
              );

              // Return the truck object
              return {
                name,
                year,
                make,
                model,
                images,
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
