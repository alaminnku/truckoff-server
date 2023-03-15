import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapWesternTruckSales() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      product: "firefox",
      headless: false,
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      try {
        // Go to the page
        await page.goto("https://www.westerntrucksales.com.au/stock-list/", {
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

                  console.log("clicked");

                  // Call the function recursively
                  loadAllTrucks();
                } catch (err) {
                  throw err;
                }
              } else {
                console.log("No button found");
                try {
                  // Get all the urls
                  const truckUrls = await page.evaluate(() => {
                    // Get all the nodes
                    const urlNodes = document.querySelectorAll(
                      "#js-sl-items-wrapper > div > div.sl-heading-link > a.sl-heading-details-link"
                    );

                    // "#js-sl-items-wrapper > div > div.sl-heading-link > a.sl-heading-details-link"

                    // #js-sl-items-wrapper > div > div.sl-heading-link > a.sl-heading-details-link

                    // #js-sl-items-wrapper > div:nth-child(3) > div.sl-heading-link > a.sl-heading-details-link

                    // #js-sl-items-wrapper > div:nth-child(1) > div.sl-content-wrapper.sl-vehicle-1 > div.sl-content-col-2 > div.sl-content-col-btn > a

                    // #js-sl-items-wrapper > div:nth-child(3) > div.sl-content-wrapper.sl-vehicle-1 > div.sl-content-col-2 > div.sl-content-col-btn > a

                    // Return the array of urls
                    return Array.from(urlNodes).map(
                      (urlNode) =>
                        `https://www.westerntrucksales.com.au${urlNode.getAttribute(
                          "href"
                        )}`
                    );
                  });

                  console.log("url", truckUrls);

                  // // Loop through the urls and extract the data
                  // for (let i = 0; i < truckUrls.length; i++) {
                  //   try {
                  //     // Go to the truck page
                  //     await page.goto(truckUrls[i], { timeout: 0 });

                  //     try {
                  //       // Get truck details
                  //       const truck = await page.evaluate(() => {
                  //         // Get selector text
                  //         const getSelectorText = (selector: string) =>
                  //           document
                  //             .querySelector(selector)
                  //             ?.textContent?.trim();

                  //         // Name
                  //         const name = getSelectorText(
                  //           "body > div.heading-wrapper > div > h1"
                  //         );

                  //         // Year
                  //         const year = getSelectorText(
                  //           "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(2) > p.sd-specs-text.sd-specs-value"
                  //         );

                  //         // Make
                  //         const make = name?.split(" ")[1];

                  //         // Kilometers
                  //         const kilometers = getSelectorText(
                  //           "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(4) > p.sd-specs-text.sd-specs-value"
                  //         );

                  //         // GVM
                  //         const gvm = getSelectorText(
                  //           "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(10) > p.sd-specs-text.sd-specs-value"
                  //         );

                  //         // Body
                  //         const bodyType = getSelectorText(
                  //           "body > main > div > div.sd-col-g > div > div.sd-group1-wrapper.sd-specification > div.sd-specs-wrapper > div.sd-specs-items-wrapper > div:nth-child(12) > p.sd-specs-text.sd-specs-value"
                  //         );

                  //         // Get image nodes
                  //         const imageNodes = document.querySelectorAll(
                  //           "#thumbnailSlider > div.owl-wrapper-outer > div > div > div > img"
                  //         );

                  //         // Get image urls
                  //         const images = Array.from(imageNodes).map(
                  //           (imageNode) =>
                  //             imageNode
                  //               .getAttribute("src")
                  //               ?.replace("/vehicles/small", "/vehicles/large")
                  //         );

                  //         // Return the truck object
                  //         return {
                  //           name,
                  //           year,
                  //           make,
                  //           images,
                  //           bodyType,
                  //           location: "VIC",
                  //           gvm: `${gvm} KG`,
                  //           kilometers: `${kilometers} KM`,
                  //         };
                  //       });

                  //       console.log(truck);
                  //     } catch (err) {
                  //       throw err;
                  //     }
                  //   } catch (err) {
                  //     throw err;
                  //   }
                  // }

                  // Close the browser
                  // await browser.close();
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
