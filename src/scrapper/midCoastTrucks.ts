import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";
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
        await page.goto("https://stock.midcoasttrucks.com.au/stock", {
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
              const button = await page.$(
                "#main > div > div.cell.medium-9 > button"
              );

              if (button) {
                // Click load more button
                await button.click();

                // Call the function recursively
                loadAllTrucks();
              } else {
                try {
                  // Get all the urls
                  const truckUrls = await page.evaluate(() => {
                    // Get all the nodes
                    const urlNodes = document.querySelectorAll(
                      "div.tile__content > div > a.button.secondary.shadow"
                    );

                    // Return the array of urls
                    return Array.from(urlNodes).map(
                      (urlNode) => urlNode.getAttribute("href") as string
                    );
                  });

                  // All trucks
                  let trucks: any[] = [];

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
                            "#content > div:nth-child(2) > div > div.cell.medium-8 > h1"
                          );

                          // Get feature text
                          const getFeatureText = (identifier: string) =>
                            Array.from(
                              document.querySelectorAll(
                                "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__specifications.vehicle__main-section > table > tbody > tr"
                              )
                            )
                              .find(
                                (feature) =>
                                  feature.firstElementChild?.textContent ===
                                  identifier
                              )
                              ?.lastElementChild?.textContent?.trim();

                          // Price
                          const price = getSelectorText(
                            "#content > div:nth-child(2) > div > div.cell.medium-4 > div.vehicle__sidebar > div.vehicle__price-wrapper.text-center > span"
                          )
                            ?.replace("*", "")
                            ?.slice(1)
                            .replace(",", "");

                          // Year
                          const year = getFeatureText("Year");

                          // Make
                          const make = getFeatureText("Make");

                          // Model
                          const model = getFeatureText("Model");

                          // Kilometers
                          const kilometers = getFeatureText(
                            "Odometer"
                          )?.replace("km", "KM");

                          // GVM
                          const gvm = getFeatureText("GVM")?.replace("t", "");

                          // Get image nodes
                          const imageNodes = document.querySelectorAll(
                            "#content > div:nth-child(2) > div > div.cell.medium-8 > div.vehicle__gallery > div.vehicle__gallery-slider.slick-initialized.slick-slider > div > div > a"
                          );

                          // Get image urls
                          const images = Array.from(imageNodes).map(
                            (imageNode) => imageNode.getAttribute("href")
                          );

                          // Return the truck object
                          return {
                            name,
                            price,
                            year,
                            make,
                            model,
                            images,
                            kilometers,
                            location: "NSW",
                            website: "midcoasttrucks",
                            gvm: gvm ? `${+gvm * 1000} KG` : undefined,
                          };
                        });

                        // Add truck to trucks
                        trucks = [
                          ...trucks,
                          { ...truck, origin: truckUrls[i] },
                        ];
                      } catch (err) {
                        // Send email
                        console.log(err);
                        // sendErrorEmail("Mid Coast Trucks");
                      }
                    } catch (err) {
                      // Send email
                      console.log(err);
                      // sendErrorEmail("Mid Coast Trucks");
                    }
                  }

                  // Replace the trucks in the db
                  try {
                    // Delete all previous trucks
                    await Truck.deleteMany({
                      website: "midcoasttrucks",
                    });

                    try {
                      // Create new trucks
                      await Truck.create(trucks);

                      // Confirm message
                      console.log(trucks.length, "Mid Coast Trucks done");

                      // Close the browser
                      await browser.close();
                    } catch (err) {
                      // Close the browser and send email
                      console.log(err);
                      await browser.close();
                      // sendErrorEmail("Mid Coast Trucks");
                    }
                  } catch (err) {
                    // Close the browser and send email
                    console.log(err);
                    await browser.close();
                    // sendErrorEmail("Mid Coast Trucks");
                  }
                } catch (err) {
                  // Close the browser and send email
                  console.log(err);
                  await browser.close();
                  // sendErrorEmail("Mid Coast Trucks");
                }
              }
            } catch (err) {
              // Close the browser and send email
              console.log(err);
              await browser.close();
              // sendErrorEmail("Mid Coast Trucks");
            }
          } catch (err) {
            // Close the browser and send email
            console.log(err);
            await browser.close();
            // sendErrorEmail("Mid Coast Trucks");
          }
        }

        loadAllTrucks();
      } catch (err) {
        // Close the browser and send email
        console.log(err);
        await browser.close();
        // sendErrorEmail("Mid Coast Trucks");
      }
    } catch (err) {
      // Close the browser and send email
      console.log(err);
      await browser.close();
      // sendErrorEmail("Mid Coast Trucks");
    }
  } catch (err) {
    console.log(err);
    // sendErrorEmail("Mid Coast Trucks");
  }
}
