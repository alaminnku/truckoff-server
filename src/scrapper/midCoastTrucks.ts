import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapMidCoastTrucks() {
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
        await page.goto("https://stock.midcoasttrucks.com.au/stock/", {
          timeout: 0,
        });

        // Load all trucks
        async function loadAllTrucks() {
          try {
            // Scroll to page bottom
            //@ts-ignore
            // await scrollPageToBottom(page);

            try {
              // Get the load more button
              // const button = await page.evaluate(() =>
              //   document.querySelector(
              //     "#main > div > div.cell.medium-9 > button"
              //   )
              // );

              const button = await page.$(
                "#main > div > div.cell.medium-9 > button"
              );

              if (button) {
                //@ts-ignore
                // await scrollPageToBottom(page);

                // Bring the button into view
                button.click();

                // Call the function recursively
                loadAllTrucks();
              } else {
                console.log("No more load button");
              }

              // // Get the load more button
              // const button = await page.$(
              //   "#main > div > div.cell.medium-9 > button"
              // );

              // if (button) {
              //   try {
              //     // Call the function recursively
              //     loadAllTrucks();
              //   } catch (err) {
              //     throw err;
              //   }
              // } else {
              //   console.log("No more button");
              //   try {
              //     // Get all the urls
              //     const truckUrls = await page.evaluate(() => {
              //       // Get all the nodes
              //       const urlNodes = document.querySelectorAll(
              //         "#tile__34895 > div.tile__content > div > a.button.secondary.shadow"
              //       );

              //       // Return the array of urls
              //       return Array.from(urlNodes).map(
              //         (urlNode) => urlNode.getAttribute("href") as string
              //       );
              //     });

              //     // Loop through the urls and extract the data
              //     for (let i = 0; i < truckUrls.length; i++) {
              //       try {
              //         // Go to the truck page
              //         await page.goto(truckUrls[i], { timeout: 0 });

              //         try {
              //           // Get truck details
              //           const truck = await page.evaluate(() => {
              //             // Get selector text
              //             const getSelectorText = (selector: string) =>
              //               document
              //                 .querySelector(selector)
              //                 ?.textContent?.trim();

              //             // Name
              //             const name = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > h1"
              //             );

              //             // Price
              //             const price = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-4 > div.vehicle__sidebar > div.vehicle__price-wrapper.text-center > span"
              //             );

              //             // Year
              //             const year = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__specifications.vehicle__main-section > table > tbody > tr:nth-child(8) > td.text-right"
              //             );

              //             // Make
              //             const make = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__specifications.vehicle__main-section > table > tbody > tr:nth-child(4) > td.text-right"
              //             );

              //             // Model
              //             const model = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__specifications.vehicle__main-section > table > tbody > tr:nth-child(5) > td.text-right"
              //             );

              //             // Kilometers
              //             const kilometers = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__quick-specs.grid-x.grid-margin-x.grid-margin-y.align-center > div:nth-child(2) > div > p"
              //             )?.replace("km", "KM");

              //             // GVM
              //             const gvm = getSelectorText(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__specifications.vehicle__main-section > table > tbody > tr:nth-child(7) > td.text-right"
              //             )?.replace("t", "");

              //             // Get image nodes
              //             const imageNodes = document.querySelectorAll(
              //               "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__gallery > div.vehicle__gallery-slider.slick-initialized.slick-slider > div > div > a"
              //             );

              //             // Get image urls
              //             const images = Array.from(imageNodes).map(
              //               (imageNode) =>
              //                 imageNode.getAttribute("href")?.trim()
              //             );

              //             // Return the truck object
              //             return {
              //               name,
              //               price,
              //               year,
              //               make,
              //               model,
              //               images,
              //               kilometers,
              //               location: "NSW",
              //               gvm: `${+gvm! * 1000} KG`,
              //             };
              //           });

              //           console.log(truck);
              //         } catch (err) {
              //           throw err;
              //         }
              //       } catch (err) {
              //         throw err;
              //       }
              //     }

              //     // // Close the browser
              //     // await browser.close();
              //   } catch (err) {
              //     throw err;
              //   }
              // }
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
