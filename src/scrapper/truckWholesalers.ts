import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapTruckWholesalers() {
  try {
    // Create browser
    const browser = await puppeteer.launch({ headless: false });

    try {
      // Create page
      const page = await browser.newPage();

      try {
        // Go to the page
        await page.goto(
          "https://www.truckwholesalersaustralia.com.au/stock/search/",
          { timeout: 0 }
        );

        // Load all trucks
        async function loadAllTrucks() {
          try {
            // Scroll to page bottom
            //@ts-ignore
            await scrollPageToBottom(page);

            try {
              // Get the load more button
              const button = await page.$("#js-async-load-more-button");

              if (button) {
                try {
                  // Click on the button
                  await button.click();

                  // Call the function recursively
                  loadAllTrucks();
                } catch (err) {
                  throw err;
                }
              } else {
                try {
                  // Get all the urls
                  const truckUrls = await page.evaluate(() => {
                    // Get all the nodes
                    const urlNodes = document.querySelectorAll(
                      "#js-sl-items-wrapper > div > div.sl-heading-link > a.sl-heading-details-link"
                    );

                    // Return the array of urls
                    return Array.from(urlNodes).map(
                      (urlNode) =>
                        `https://www.truckwholesalersaustralia.com.au${urlNode.getAttribute(
                          "href"
                        )}`
                    );
                  });

                  // Loop through the urls and extract the data
                  for (let i = 0; i < truckUrls.length; i++) {
                    try {
                      // Go to the truck page
                      await page.goto(truckUrls[i], { timeout: 0 });

                      try {
                        // Get truck details
                        const truck = await page.evaluate(() => {
                          const name = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sl-heading-link > div.sl-heading-model-wrapper > h3"
                          )?.textContent;

                          // Price
                          const price = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sl-heading-link > a > h4"
                          )?.textContent;

                          // Year
                          const year = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(2) > p.sd-specs-text.sd-specs-value"
                          )?.textContent;

                          // Make
                          const make = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sd-features-wrapper > ul > li:nth-child(1)"
                          )?.textContent;

                          // Kilometers
                          const kilometers = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(4) > p.sd-specs-text.sd-specs-value"
                          )?.textContent;

                          // GVM
                          const gvm = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(10) > p.sd-specs-text.sd-specs-value"
                          )?.textContent;

                          // Body
                          const bodyType = document.querySelector(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(12) > p.sd-specs-text.sd-specs-value"
                          )?.textContent;

                          // Get image nodes
                          const imageNodes = document.querySelectorAll(
                            "#thumbnailSlider > div.owl-wrapper-outer > div > div > div > img"
                          );

                          // Get image urls
                          const images = Array.from(imageNodes).map(
                            (imageNode) =>
                              imageNode
                                .getAttribute("src")
                                ?.replace("/vehicles/small", "/vehicles/large")
                          );

                          // Return the truck object
                          return {
                            name,
                            price,
                            year,
                            gvm,
                            make,
                            images,
                            bodyType,
                            kilometers,
                            location: "VIC",
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

                  // Close the browser
                  await browser.close();
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

        loadAllTrucks();
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
