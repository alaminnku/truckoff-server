import puppeteer from "puppeteer";
import Truck from "../models/truck";
import { sendErrorEmail } from "../utils";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

export default async function scrapDaimlerTrucksDanenong() {
  try {
    // Create browser
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      defaultViewport: { width: 1024, height: 1600 },
    });

    try {
      // Create page
      const page = await browser.newPage();

      try {
        // Go to the page
        await page.goto("https://daimlertrucksdandenong.com.au/stock/search/", {
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
                    // Close the browser and send email
                    console.log(err);
                    await browser.close();
                    // sendErrorEmail("Daimler Trucks Dandenong");
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
                          `https://daimlertrucksdandenong.com.au${urlNode.getAttribute(
                            "href"
                          )}`
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
                            // Get feature text
                            const getFeatureText = (identifier: string) =>
                              Array.from(
                                document.querySelectorAll(
                                  "body > section > div > div.inventory.inventory-detail > div.row > div:nth-child(2) > div > ul > li"
                                )
                              )
                                .find(
                                  (feature) =>
                                    feature.firstElementChild?.textContent ===
                                    identifier
                                )
                                ?.lastElementChild?.textContent?.trim();

                            // Name
                            const name = document
                              .querySelector("#detail-inv-title")
                              ?.textContent?.trim();

                            // Price
                            const price = getFeatureText("Price")
                              ?.slice(1)
                              .replace(",", "");

                            // Year
                            const year = getFeatureText("Model Year");

                            // Make
                            const make = name?.split(" ")[1];

                            // Kilometers
                            const kilometers = getFeatureText(
                              "Kilometres"
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
                              location: "VIC",
                              website: "daimlertrucksdandenong",
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
                          // sendErrorEmail("Daimler Trucks Dandenong");
                        }
                      } catch (err) {
                        // Send email
                        console.log(err);
                        // sendErrorEmail("Daimler Trucks Dandenong");
                      }
                    }

                    if (trucks.length > 0) {
                      // Replace the trucks in the db
                      try {
                        // Delete all previous trucks
                        await Truck.deleteMany({
                          website: "daimlertrucksdandenong",
                        });

                        try {
                          // Create new trucks
                          await Truck.create(trucks);

                          // Confirm message
                          console.log(
                            trucks.length,
                            "Daimler Trucks Dandenong done"
                          );

                          // Close the browser
                          await browser.close();
                        } catch (err) {
                          // Close the browser and send email
                          console.log(err);
                          await browser.close();
                          // sendErrorEmail("Daimler Trucks Dandenong");
                        }
                      } catch (err) {
                        // Close the browser and send email
                        console.log(err);
                        await browser.close();
                        // sendErrorEmail("Daimler Trucks Dandenong");
                      }
                    } else {
                      // Log error and close browser
                      console.log("Something went wrong");
                      await browser.close();
                    }
                  } catch (err) {
                    // Close the browser and send email
                    console.log(err);
                    await browser.close();
                    // sendErrorEmail("Daimler Trucks Dandenong");
                  }
                }
              } catch (err) {
                // Close the browser and send email
                console.log(err);
                await browser.close();
                // sendErrorEmail("Daimler Trucks Dandenong");
              }
            } catch (err) {
              // Close the browser and send email
              console.log(err);
              await browser.close();
              // sendErrorEmail("Daimler Trucks Dandenong");
            }
          } catch (err) {
            // Close the browser and send email
            console.log(err);
            await browser.close();
            // sendErrorEmail("Daimler Trucks Dandenong");
          }
        }

        // Run load all trucks function
        loadAllTrucks();
      } catch (err) {
        // Close the browser and send email
        console.log(err);
        await browser.close();
        // sendErrorEmail("Daimler Trucks Dandenong");
      }
    } catch (err) {
      // Close the browser and send email
      console.log(err);
      await browser.close();
      // sendErrorEmail("Daimler Trucks Dandenong");
    }
  } catch (err) {
    console.log(err);
    // sendErrorEmail("Daimler Trucks Dandenong");
  }
}
