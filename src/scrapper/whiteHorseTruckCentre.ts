import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapWhiteHorseTruckCentre() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      try {
        // Go to the page
        await page.goto("https://www.whitehorsetrucks.com.au/stock/search/", {
          timeout: 0,
        });

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
                      "#js-sl-items-wrapper > div > div.sl-content-wrapper.sl-vehicle-1 > div.sl-content-col-2 > div.sl-content-col-btn > a"
                    );

                    // Return the array of urls
                    return Array.from(urlNodes).map(
                      (urlNode) =>
                        `https://www.whitehorsetrucks.com.au${urlNode.getAttribute(
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
                          // Get selector text
                          const getSelectorText = (selector: string) =>
                            document
                              .querySelector(selector)
                              ?.textContent?.trim();

                          // Name
                          const name = getSelectorText(
                            "body > main > div > div.heading-wrapper > div > h1"
                          );

                          // Price
                          const price = getSelectorText(
                            "body > main > div > div.sd-col-g > div > div.sl-heading-link > a > h4"
                          );

                          // Year
                          const year = getSelectorText(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper.False > div:nth-child(2) > p.sd-specs-text.sd-specs-value"
                          );

                          // Make
                          const make = name?.split(" ")[1];

                          // Kilometers
                          const kilometers = getSelectorText(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper.False > div:nth-child(4) > p.sd-specs-text.sd-specs-value"
                          );

                          // GVM
                          const gvm = getSelectorText(
                            "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper.False > div:nth-child(9) > p.sd-specs-text.sd-specs-value"
                          )?.replace("kg", "KG");

                          // Get image nodes
                          const imageNodes = document.querySelectorAll(
                            "#thumbnailSlider > div.owl-wrapper-outer.autoHeight > div > div > div > img"
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
                            kilometers: `${kilometers} KM`,
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
