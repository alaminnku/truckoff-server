import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapDaimlerTrucksPerth() {
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
        await page.goto("https://www.daimlertrucksperth.com.au/stock/search/", {
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
              const button = await page.$("#loadmoreinventories");

              try {
                // Check if button has style attribute
                const hasStyleAttribute = await button?.evaluate((button) =>
                  button.getAttribute("style")
                );

                if (button && !hasStyleAttribute) {
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
                        "#inventorieslist > div > div > div.content-btn > a"
                      );

                      // Return the array of urls
                      return Array.from(urlNodes).map(
                        (urlNode) =>
                          `https://www.daimlertrucksperth.com.au${urlNode.getAttribute(
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
                            const name = getSelectorText("#detail-inv-title");

                            // Price
                            const price = getSelectorText(
                              "body > section > div > div.inventory.inventory-detail > div.row > div:nth-child(2) > div > ul > li:nth-child(9) > strong"
                            );

                            // Year
                            const year = getSelectorText(
                              "body > section > div > div.inventory.inventory-detail > div.row > div:nth-child(2) > div > ul > li:nth-child(1) > strong"
                            );

                            // Make
                            const make = name?.split(" ")[1];

                            // Kilometers
                            const kilometers = getSelectorText(
                              "body > section > div > div.inventory.inventory-detail > div.row > div:nth-child(2) > div > ul > li:nth-child(3) > strong"
                            )?.replace("Kms", "KM");

                            // Get image nodes
                            const imageNodes = document.querySelectorAll(
                              "#carousel > div.owl-wrapper-outer > div > div > a > img"
                            );

                            // Get image urls
                            const images = Array.from(imageNodes).map(
                              (imageNode) => imageNode.getAttribute("src")
                            );

                            // Return the truck object
                            return {
                              name,
                              year,
                              make,
                              price,
                              images,
                              kilometers,
                              location: "WA",
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
